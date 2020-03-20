navigator.getUserMedia = (
  navigator['getUserMedia'] ||
  navigator['webkitGetUserMedia'] ||
  navigator['mozGetUserMedia'] ||
  navigator['msGetUserMedia']
)

// peer2.on('stream', stream => {
//   log('stream')
//
//   // got remote video stream, now let's show it in a video tag
//   if ('srcObject' in video) {
//     video.srcObject = stream
//   } else {
//     video.src = window.URL.createObjectURL(stream) // for older browsers
//   }
//   video.play()
// })

// function addMedia(stream) {
//   log('addMedia')
//   peer1.addStream(stream) // <- add streams to peer dynamically
// }

export function connectStreamToVideoElement(stream, video) {
  if ('srcObject' in video) {
    video.srcObject = stream
  } else {
    video.src = window.URL.createObjectURL(stream) // for older browsers
  }
  video.play()
}

export function getUserMedia(fn) {

  function errorHandler(err) {
    log('error', err)
  }

  // Solution via https://stackoverflow.com/a/47958949/140927
  // Only available for HTTPS! See https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#Security
  const opt = {
    audio: true,
    video: {
      facingMode: 'user',
      frameRate: {
        ideal: 10,
      },
    },
  }
  if (typeof navigator.mediaDevices.getUserMedia === 'undefined') {
    navigator.getUserMedia(opt, fn, errorHandler)
  } else {
    navigator.mediaDevices.getUserMedia(opt).then(fn).catch(errorHandler)
  }
}
