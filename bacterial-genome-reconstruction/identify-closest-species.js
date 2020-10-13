/*
 * identify-closest-species.js
 */

const os = require('os')
const fs = require('fs').promises
const cp = require('child_process')
const util = require('util')
const exec = util.promisify(cp.exec)
const shellEscape = require('shell-escape')
const parseCSV = require('csv-parse/lib/sync')

const NUM_CPUS = os.cpus().length

const BLAST_DB_PATH = `${__dirname}/db/blast_db/representative/db`
const SUMMARY_SCRIPT_PATH = `${__dirname}/blast_summaries.R`

module.exports = identifyClosestSpecies

async function identifyClosestSpecies(outputFolder, subsampledFastaPath, inputFastqPath) {
  const statsPath = await generateStats(outputFolder, inputFastqPath)
  const blastPath = await blast(outputFolder, subsampledFastaPath)
  const [summaryPath, readLengthPath] = await generateSummary(
    outputFolder,
    statsPath,
    blastPath
  )

  const summaryContent = (await fs.readFile(summaryPath)).toString()
  const data = parseCSV(summaryContent, { columns: true, skip_empty_lines: true })

  return { statsPath, summaryPath, readLengthPath, blastPath, data }
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
  const outputPath = `${outputFolder}/species_blast.csv`

  const command = shellEscape([
    'blastn',
        '-task', 'megablast',
        '-db', BLAST_DB_PATH,
        '-max_hsps', 3,
        '-max_target_seqs', 3000,
        '-perc_identity', 95,
        '-query', inputFastaPath,
        '-outfmt', '6 qseqid sseqid length pident mismatch gapopen slen qlen bitscore stitle',
        '-out', outputPath,
        '-num_threads', NUM_CPUS,
  ])

  return exec(command).then(() => outputPath)
}

function generateSummary(outputFolder, statsPath, blastPath) {
  const summaryPath    = `${outputFolder}/species_summary.csv`
  const readLengthPath = `${outputFolder}/species_read_length.csv`

  const command = shellEscape([
    'Rscript', SUMMARY_SCRIPT_PATH,
        statsPath,
        blastPath,
        summaryPath,
        readLengthPath,
  ])

  return exec(command).then(() => [summaryPath, readLengthPath])
}


