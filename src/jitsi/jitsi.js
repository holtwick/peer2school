import { Emitter } from '../lib/emitter'

// Hack!
require('strophe.js')
window.$ = require('./jquery-2.1.1')
// window.$ = (...args) => log('jQuery required for', args)
const JitsiMeetJS = require('./lib-jitsi-meet.min')

const log = require('debug')('jitsi:jitsi')

// https://github.com/jitsi/lib-jitsi-meet/blob/master/doc/API.md#installation
// See https://beta.meet.jit.si/config.js

const options = {
  hosts: {
    domain: 'beta.meet.jit.si',
    muc: 'conference.beta.meet.jit.si', // FIXME: use XEP-0030
  },
  bosh: 'https://beta.meet.jit.si/http-bind', // FIXME: use xep-0156 for that

  // The name of client node advertised in XEP-0115 'c' stanza
  clientNode: 'http://jitsi.org/jitsimeet',
}

const confOptions = {
  openBridgeChannel: true,
}

const initOptions = {
  disableAudioLevels: true,

  // The ID of the jidesha extension for Chrome.
  desktopSharingChromeExtId: 'mbocklcggfhnbahlnepmldehdhpjfcjp',

  // Whether desktop sharing should be disabled on Chrome.
  desktopSharingChromeDisabled: false,

  // The media sources to use when using screen sharing with the Chrome
  // extension.
  desktopSharingChromeSources: ['screen', 'window'],

  // Required version of Chrome extension
  desktopSharingChromeMinExtVersion: '0.1',

  // Whether desktop sharing should be disabled on Firefox.
  desktopSharingFirefoxDisabled: true,
}

export class JitsiBridge extends Emitter {

  connection = null
  isJoined = false

  userID = null

  room = null
  conferenceName = 'peerSchoolConference'

  localTracks = []
  remoteTracks = {}

  constructor({ room } = {}) {
    super()
    log('setupJitsi', room)

    this.conferenceName = room.toLowerCase() // !sic
  }

  async connect() {
    window.addEventListener('beforeunload', this.unload)
    window.addEventListener('unload', this.unload)

    // JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.INFO)
    JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.WARN)
    JitsiMeetJS.init(initOptions)

    this.connection = new JitsiMeetJS.JitsiConnection(null, null, options)

    this.connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED, _ => this.onConnectionSuccess())
    this.connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_FAILED, _ => this.onConnectionFailed())
    // this.connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,_) => this.disconnect())

    // JitsiMeetJS.mediaDevices.addEventListener(JitsiMeetJS.events.mediaDevices.DEVICE_LIST_CHANGED, this.onDeviceListChanged)

    this.connection.connect()

    try {
      let tracks = await JitsiMeetJS.createLocalTracks({ devices: ['audio', 'video'] })
      this.onLocalTracks(tracks)
    } catch (err) {
      log('connect err', err)
      console.error('Exception:', err)
    }

    // if (JitsiMeetJS.mediaDevices.isDeviceChangeAvailable('output')) {
    //   JitsiMeetJS.mediaDevices.enumerateDevices(devices => {
    //     const audioOutputDevices
    //       = devices.filter(d => d.kind === 'audiooutput')
    //
    //     if (audioOutputDevices.length > 1) {
    //       $('#audioOutputSelect').html(
    //         audioOutputDevices
    //           .map(
    //             d =>
    //               `<option value="${d.deviceId}">${d.label}</option>`)
    //           .join('\n'))
    //
    //       $('#audioOutputSelectWrapper').show()
    //     }
    //   })
    // }
    log('setup done')
  }

  onLocalTracks(tracks) {
    log('onLocalTracks', tracks)
    this.localTracks = tracks
    for (let i = 0; i < this.localTracks.length; i++) {
      let track = this.localTracks[i]

      track.addEventListener(JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED, audioLevel => log(`Audio Level local: ${audioLevel}`))
      track.addEventListener(JitsiMeetJS.events.track.TRACK_MUTE_CHANGED, () => log('local track muted'))
      track.addEventListener(JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED, () => log('local track stoped'))
      track.addEventListener(JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED, deviceId => log(`track audio output device was changed to ${deviceId}`))

      if (track.getType() === 'video') {
        this.emit('stream', {
          stream: track,
        })
      }

      if (this.isJoined) {
        this.room.addTrack(track)
      }
    }
  }

  onRemoteTrack(track) {
    if (track.isLocal()) return

    const id = track.getParticipantId()
    log('onRemoteTrack', id)

    if (!this.remoteTracks[id]) {
      this.remoteTracks[id] = []
    }
    this.remoteTracks[id].push(track)

    track.addEventListener(JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED, audioLevel => log(`Audio Level remote: ${audioLevel}`))
    track.addEventListener(JitsiMeetJS.events.track.TRACK_MUTE_CHANGED, () => log('remote track muted'))
    track.addEventListener(JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED, () => log('remote track stoped'))
    track.addEventListener(JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED, deviceId => log(`track audio output device was changed to ${deviceId}`))

    this.emit('add', {
      id,
      track,
      video: track.getType() === 'video',
    })
  }

  onConferenceJoined() {
    this.userID = this.room.myUserId()
    log('onConferenceJoined', this.userID)
    this.isJoined = true
    for (let i = 0; i < this.localTracks.length; i++) {
      this.room.addTrack(this.localTracks[i])
    }
    this.emit('joined', {
      id: this.userID,
    })
  }

  onUserLeft(id) {
    log('onUserLeft')
    log('user left')
    if (!this.remoteTracks[id]) {
      return
    }
    // const tracks = this.remoteTracks[id]
    // for (let i = 0; i < tracks.length; i++) {
    //   tracks[i].detach($(`#${id}${tracks[i].getType()}`))
    // }
  }

  onConnectionSuccess() {
    log('onConnectionSuccess')
    this.room = this.connection.initJitsiConference(this.conferenceName, confOptions)
    this.room.on(JitsiMeetJS.events.conference.TRACK_ADDED, track => this.onRemoteTrack(track))
    this.room.on(JitsiMeetJS.events.conference.TRACK_REMOVED, track => log(`track removed!!!${track}`))
    this.room.on(JitsiMeetJS.events.conference.CONFERENCE_JOINED, _ => this.onConferenceJoined())
    this.room.on(JitsiMeetJS.events.conference.USER_JOINED, id => {
      log('user join', id)
      this.remoteTracks[id] = []
    })
    this.room.on(JitsiMeetJS.events.conference.USER_LEFT, id => this.onUserLeft(id))
    this.room.on(JitsiMeetJS.events.conference.TRACK_MUTE_CHANGED, track => log(`${track.getType()} - ${track.isMuted()}`))
    this.room.on(JitsiMeetJS.events.conference.DISPLAY_NAME_CHANGED, (userID, displayName) => log(`${userID} - ${displayName}`))
    this.room.on(JitsiMeetJS.events.conference.TRACK_AUDIO_LEVEL_CHANGED, (userID, audioLevel) => log(`${userID} - ${audioLevel}`))
    this.room.on(JitsiMeetJS.events.conference.PHONE_NUMBER_CHANGED, _ => log(`${this.room.getPhoneNumber()} - ${this.room.getPhonePin()}`))
    this.room.join()
  }

  onConnectionFailed() {
    log('onConnectionFailed')
    console.error('Connection Failed!')
  }

  // onDeviceListChanged(devices) {
  //   log('onDeviceListChanged')
  //   console.info('current devices', devices)
  // }

  // disconnect() {
  //   log('disconnect')
  //   log('disconnect!')
  //   connection.removeEventListener(JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED, this.onConnectionSuccess)
  //   connection.removeEventListener(JitsiMeetJS.events.connection.CONNECTION_FAILED, this.onConnectionFailed)
  //   connection.removeEventListener(JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED, this.disconnect)
  // }

  unload() {
    if (this.room) {
      log('unload')
      for (let i = 0; i < (this.localTracks || []).length; i++) {
        this.localTracks[i].dispose()
      }
      this.room.leave()
      this.connection.disconnect()
      this.room = null
      this.connection = null
    }
  }

}
