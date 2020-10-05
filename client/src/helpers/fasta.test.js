/*
 * fasta.test.js
 */
/* global describe, test, expect */

import { fastaToString, isAllowed, parse, realignFasta, reverseComplement } from './fasta.js'

const file1 =
`>NZ_CP022077.1 Campylobacter jejuni subsp. jejuni strain FDAARGOS_263 chromosome, complete genome
TTTTTCATCTACCAAAGAGTAAGCTCCGATTAAATCCCCAATTTCTATTGCTTCATATTTAGGAGTTTTT
AAACCTTTTAAAAGAGTATTTTCAAGTTCATTTCTACCTATGATCATTTTAGCTCCATTGGGTAATCTTA
AATGACGACCATATTTTAAAAGTTGTGCGTCATTAACCTGCATATCTTTGTCAAATTCTATGAAATCTCG
ATAGGAATTTCTTACATCTATCATTTCAAAATCTGCACCTA`

const file2 =
`>file 2
AAAAAAAAACCGTAAAAXXX`

const badFastaFile =
`>TEST for a bad fasta file
TCTTATGATTTTATCTTAAZZZZZZZZZZZZZZZZZOZZZZZZZZZZZZZZZCGATGCTACGTACGTACG
TCTTATGATTTTATCTTAAAATCAGACTTAAAAGAGGAAACCACCCTAAAAGCTAGCATCTAGCATCTAG`

const badFile =
'I am a very bad file'

// Both come from file2
const startSequence    = 'CGT'
const startSequenceRev = 'ACG'



describe('isAllowed()', () => {

  test('returns true with good input', () => {
    const result = isAllowed('ACBDFKLJFHLUAEHLU')
    expect(result).toBe(true)
  })

  test('returns false with bad letters input', () => {
    const result = isAllowed('ACBDFKLJFHLUAEHLUO')
    expect(result).toBe(false)
  })

  test('returns false with bad numbers input', () => {
    const result = isAllowed('AAAA7AAAA')
    expect(result).toBe(false)
  })

  test('returns false with bad chars input', () => {
    const result = isAllowed('AAAA AAAA')
    expect(result).toBe(false)
  })
})

describe('parse()', () => {

  test('works with fasta files', () => {
    const validation = parse(file1)
    expect(validation).toEqual({ success: true, result: {
      description: '>NZ_CP022077.1 Campylobacter jejuni subsp. jejuni strain FDAARGOS_263 chromosome, complete genome',
      sequence: 'TTTTTCATCTACCAAAGAGTAAGCTCCGATTAAATCCCCAATTTCTATTGCTTCATATTTAGGAGTTTTTAAACCTTTTAAAAGAGTATTTTCAAGTTCATTTCTACCTATGATCATTTTAGCTCCATTGGGTAATCTTAAATGACGACCATATTTTAAAAGTTGTGCGTCATTAACCTGCATATCTTTGTCAAATTCTATGAAATCTCGATAGGAATTTCTTACATCTATCATTTCAAAATCTGCACCTA'
    }})
  })

  test('works with bad fasta files', () => {
    const validation = parse(badFastaFile)
    expect(validation).toEqual({ success: false, result: undefined})
  })

  test('works with bad files', () => {
    const validation = parse(badFile)
    expect(validation).toEqual({ success: false, result: undefined})
  })
})

describe('reverseComplement()', () => {
  test('works', () => {
    expect(startSequence).toBe(reverseComplement(startSequenceRev))
  })
})

describe('realignFasta()', () => {

  test('works with original sequence', () => {
    const { result: fasta } = parse(file2)

    const newFasta = realignFasta(fasta, startSequence)
    expect(newFasta).toEqual({
      success: true,
      result: {
        description: fasta.description,
        sequence: 'CGTAAAAXXXAAAAAAAAAC',
        isReversed: false,
        conversions: 0,
      }
    })
  })

  test('works with reversed sequence', () => {
    const { result: fasta } = parse(file2)

    const newFasta = realignFasta(fasta, startSequenceRev)
    expect(newFasta).toEqual({
      success: true,
      result: {
        description: fasta.description,
        sequence: 'ACGGTTTTTTTTTNNNTTTT',
        isReversed: true,
        conversions: 3,
      }
    })
  })
})

describe('fastaToString()', () => {
  test('works', () => {
    const { result: fasta } = parse(file1)
    const string = fastaToString(fasta)
    expect(string).toBe(file1)
  })
})
