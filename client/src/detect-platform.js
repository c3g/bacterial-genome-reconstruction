/*
 * detect-platform.js
 */

import Bowser from 'bowser';

const browser = Bowser.parse(window.navigator.userAgent)

let className

if (browser.os.name.includes('Linux')) {
  className = 'platform-linux'
}
else if (browser.os.name.includes('macOS')) {
  className = 'platform-mac'
}
else if (browser.os.name.includes('Windows')) {
  className = 'platform-windows'
}

if (className) {
  document.body.classList.add(className)
}
