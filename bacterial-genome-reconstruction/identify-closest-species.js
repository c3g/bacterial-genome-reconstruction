/*
 * identify-closest-species.js
 */

const fs = require('fs').promises
const cp = require('child_process')
const util = require('util')
const exec = util.promisify(cp.exec)
const shellEscape = require('shell-escape')
const tmp = require('tmp-promise')
const generateRandomReads = require('./generate-random-reads')


const BLAST_DB_PATH = `${__dirname}/db/blast_db/representative_db`
const SUMMARY_SCRIPT_PATH = `${__dirname}/module_1.R`

module.exports = identifyClosestSpecies

async function identifyClosestSpecies(inputFastqPath) {
  const { path: outputFolder, cleanup } = await tmp.dir()
  console.log({ inputFastqPath })
  const statsPath = await generateStats(outputFolder, inputFastqPath)
  console.log({ statsPath })
  const subsampledFastaPath = `${outputFolder}/subsample.fasta`
  console.log({ subsampledFastaPath })
  await generateRandomReads(inputFastqPath, subsampledFastaPath)
  console.log('generate done')
  const blastPath = await blast(outputFolder, subsampledFastaPath)
  console.log({ blastPath })
  const [summaryPath, readLengthPath] = await generateSummary(
    outputFolder,
    statsPath,
    blastPath
  )

  await cleanup()

  return {
    outputFolder,
    statsPath,
    blastPath,
    summaryPath,
    readLengthPath,
  }
}

function generateStats(outputFolder, inputFastqPath) {
  const statsPath = `${outputFolder}/stats.txt`
  const command = shellEscape([
    'seqkit',
    'stats',
    inputFastqPath,
    '-T',
    '-o',
    statsPath,
  ])

  return exec(command).then(() => statsPath)
}

function blast(outputFolder, inputFastaPath) {
  const outputPath = `${outputFolder}/blast.csv`

  const command = shellEscape([
    'blastn',
        '-task', 'megablast',
        '-db', BLAST_DB_PATH,
        '-max_hsps', 3,
        '-max_target_seqs', 3000,
        '-perc_identity', 95,
        '-query', inputFastaPath,
        '-outfmt', '10 qseqid sseqid length pident mismatch gapopen slen qlen bitscore',
        '-out', outputPath,
        // '-num_threads' 8,
  ])

  return exec(command).then(() => outputPath)
}

function generateSummary(outputFolder, statsPath, blastPath) {
  const summaryPath = `${outputFolder}/summary.csv`
  const readLengthPath = `${outputFolder}/read_length.csv`

  const command = shellEscape([
    'Rscript', SUMMARY_SCRIPT_PATH,
        statsPath,
        blastPath,
        summaryPath,
        readLengthPath,
  ])

  return exec(command).then(() => [summaryPath, readLengthPath])
}


