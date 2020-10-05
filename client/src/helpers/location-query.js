/*
 * location-query.js
 */

/**
 * Adds a search param to the current URL
 * Source: https://stackoverflow.com/a/487049/6303229
 */
export function insert(key, value) {
  const location = window.location
  const history = window.history

  const keyValue   = encodeURIComponent(key)
  const valueValue = encodeURIComponent(value)

  // kvp looks like ['key1=value1', 'key2=value2', ...]
  const kvp = location.search.substr(1).trim().split('&').filter(Boolean)

  let i = 0

  for(; i < kvp.length; i++) {
    if (kvp[i].startsWith(keyValue + '=')) {
      let pair = kvp[i].split('=')
      pair[1] = valueValue
      kvp[i] = pair.join('=')
      break
    }
  }

  if (i >= kvp.length){
    kvp[kvp.length] = [keyValue, valueValue].join('=')
  }

  const query = '?' + kvp.join('&')

  if (history.pushState) {
    const path = location.protocol + '//' + location.host + location.pathname + query;
    history.pushState({ path }, '', path);
  }
}

export function remove(key) {
  const location = window.location
  const history = window.history

  const keyValue   = encodeURIComponent(key)

  // kvp looks like ['key1=value1', 'key2=value2', ...]
  const kvp =
    location.search.substr(1).trim().split('&')
    .filter(Boolean)
    .filter(k => !k.startsWith(keyValue + '='))

  const query = '?' + kvp.join('&')

  if (history.pushState) {
    const path = location.protocol + '//' + location.host + location.pathname + query;
    history.pushState({ path }, '', path);
  }
}
