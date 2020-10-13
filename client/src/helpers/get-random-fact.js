import stoic from 'stoic-api'

const ENDPOINT = 'https://uselessfacts.jsph.pl/random.json?language=en'


export default function getRandomFact() {
  if (Math.random() < 0.5)
    return Promise.resolve(stoic.random())

  return fetch(ENDPOINT)
  .then(res => res.json())
  .then(res => res.text)
  .catch(() => Promise.resolve(stoic.random()))
}
