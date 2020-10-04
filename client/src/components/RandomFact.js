import React, { useState, useEffect } from 'react'

const ENDPOINT = 'https://uselessfacts.jsph.pl/random.json?language=en'

function RandomFact() {
  const [fact, setFact] = useState(null)

  useEffect(() => {
    fetch(ENDPOINT)
    .then(res => res.json())
    .then(response => {
      setFact(response.text)
    })
  }, [])

  return fact ? fact : <>&nbsp</>
}

export default RandomFact
