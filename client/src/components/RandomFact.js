import React, { useState, useEffect } from 'react'

import getRandomFact from '../helpers/get-random-fact'

function RandomFact() {
  const [fact, setFact] = useState(null)

  useEffect(() => {
    getRandomFact().then(setFact)
  }, [])

  return fact ? fact : <>&nbsp</>
}

export default RandomFact
