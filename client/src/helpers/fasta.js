/*
 * fasta.js
 */

/**
 * @typedef {Object} Fasta
 * @property {string} description
 * @property {string} genome
 * @property {boolean} [isReversed]
 */

/**
 * @typedef {Object} ValidationResult<T>
 * @property {boolean} ok
 * @property {T} result
 */


/**
 * @param {Fasta} fasta
 * @param {string} sequence
 * @returns {ValidationResult<Fasta>}
 */
export function realignFasta(fasta, sequence) {
  let index = fasta.sequence.indexOf(sequence)
  let isReversed = false
  let conversionsRef = { value: 0 }

  if (index === -1) {
    const reverseSequence = reverseComplement(sequence)
    index = fasta.sequence.indexOf(reverseSequence)
    isReversed = true
  }

  if (index === -1) {
    return { ok: false, result: undefined }
  }

  const input = isReversed ? reverseComplement(fasta.sequence, conversionsRef) : fasta.sequence

  if (isReversed)
    index = fasta.sequence.length - index - sequence.length

  const newSequence = input.slice(index) + input.slice(0, index)

  return { ok: true, result: { ...fasta, sequence: newSequence, isReversed, conversions: conversionsRef.value } }
}

export function reverseComplement(sequence, conversionsRef = null) {
  return Array.from(sequence.replace(/./g, (char) => {
    switch (char) {
      case 'A': return 'T'
      case 'T': return 'A'
      case 'G': return 'C'
      case 'C': return 'G'
      default:
        if (conversionsRef !== null)
          conversionsRef.value += 1
        return 'N'
    }
  })).reverse().join('')
}

/**
 * @param {Fasta} fasta
 * @returns {string} fasta file string
 */
export function fastaToString(fasta) {
  const LINE_LENGTH = 70

  let result = fasta.description + '\n'

  let i;
  for (i = 0; (i + LINE_LENGTH) < fasta.sequence.length; i += LINE_LENGTH) {
    result += fasta.sequence.slice(i, i + LINE_LENGTH) + '\n'
  }
  result += fasta.sequence.slice(i)

  return result
}

export function parse(text) {
  let isFastaFile = false
  let result = undefined

  const lines = text.split('\n')
  const lastLines = lines.slice(1)

  if (lines[0].startsWith('>') && lastLines.every(isAllowedOrEmpty)) {
    isFastaFile = true
    result = {
      description: lines[0],
      sequence: lastLines.map(l => l.toUpperCase()).join(''),
    }
  }

  return { ok: isFastaFile, result }
}

export function isAllowed(text) {
  for (let i = 0; i < text.length; i++) {
    if (!isAllowedCode(text.charCodeAt(i)))
      return false
  }
  return true
}

function isAllowedOrEmpty(text) {
  if (text.length === 0)
    return true
  return isAllowed(text)
}

function isAllowedCode(code) {
  if (
       (code >= 65 /* A */ && code <= 78 /* N */)
    || (code >= 80 /* P */ && code <= 90 /* Z */)
    || (code >= 97 /* a */ && code <= 110 /* n */)
    || (code >= 112 /* p */ && code <= 122 /* z */)
    || (code === 42 /* * */)
    || (code === 45 /* - */)
  )
    return true
  return false
}

/*
   Fasta format allowed chars:

        A  adenosine          C  cytidine             G  guanine
        T  thymidine          N  A/G/C/T (any)        U  uridine
        K  G/T (keto)         S  G/C (strong)         Y  T/C (pyrimidine)
        M  A/C (amino)        W  A/T (weak)           R  G/A (purine)
        B  G/T/C              D  G/A/T                H  A/C/T
        V  G/C/A              -  gap of indeterminate length

  For those programs that use amino acid query sequences (BLASTP and TBLASTN), the accepted amino acid codes are:

        A  alanine               P  proline
        B  aspartate/asparagine  Q  glutamine
        C  cystine               R  arginine
        D  aspartate             S  serine
        E  glutamate             T  threonine
        F  phenylalanine         U  selenocysteine
        G  glycine               V  valine
        H  histidine             W  tryptophan
        I  isoleucine            Y  tyrosine
        K  lysine                Z  glutamate/glutamine
        L  leucine               X  any
        M  methionine            *  translation stop
        N  asparagine            -  gap of indeterminate length
*/
