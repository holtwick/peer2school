import clipboardCopy from 'clipboard-copy'

export function createLinkForRoom(room) {
  const DEBUG = location.port.toString() === '8080' || !location.pathname.startsWith('/dist')
  if (DEBUG) {
    return `https://${location.host}/#${room}`
  }
  return `https://peer.school/class/${room}`
}

export async function shareLink(url, { title = '', text = '' } = {}) {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'web.dev',
        text: 'Check out web.dev.',
        url,
      })
      return true
    } catch (err) {
      console.error('Exception:', err)
    }
  }
  if (window.electron) {
    try {
      // https://electronjs.org/docs/api/clipboard
      await window.electron.clipboard.writeText(url)
      alert('The URL has been copied to your clipboard.')
      return true
    } catch (err) {
      console.error('Exception:', err)
    }
  }
  try {
    await clipboardCopy(url)
    alert('The URL has been copied to your clipboard.')
    return true
  } catch (err) {
    console.error('Exception:', err)
  }
  alert('Cannot share ' + url)
}
