navigator.getUserMedia = (
  navigator['getUserMedia'] ||
  navigator['webkitGetUserMedia'] ||
  navigator['mozGetUserMedia'] ||
  navigator['msGetUserMedia']
)

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

  try {
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
  catch (err) {
      console.error('Exception:', err)
  }
}
