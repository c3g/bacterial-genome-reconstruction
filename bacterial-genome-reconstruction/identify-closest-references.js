/*
 * identify-closest-references.js
 */

const os = require('os')
const fs = require('fs').promises
const cp = require('child_process')
const util = require('util')
const exec = util.promisify(cp.exec)
const shellEscape = require('shell-escape')
const parseCSV = require('csv-parse/lib/sync')

const NUM_CPUS = os.cpus().length

const getBlastDBPath = genus => `${__dirname}/db/blast_db/by_genus/${genus}/db`
const SUMMARY_SCRIPT_PATH = `${__dirname}/blast_summaries.R`

module.exports = identifyClosestReferences

async function identifyClosestReferences(inputFolder, genus) {
  const statsPath = `${inputFolder}/stats.txt`
  const subsampledFastaPath = `${inputFolder}/subsample.fasta`
  const blastPath = await blast(inputFolder, subsampledFastaPath, genus)
  const [summaryPath, readLengthPath] = await generateSummary(
    inputFolder,
    statsPath,
    blastPath
  )

  const summaryContent = (await fs.readFile(summaryPath)).toString()
  const data = parseCSV(summaryContent, { columns: true, skip_empty_lines: true })

  return { blastPath, summaryPath, readLengthPath, data }
}

function blast(outputFolder, inputFastaPath, genus) {
  const outputPath = `${outputFolder}/references_blast.csv`

  const command = shellEscape([
    'blastn',
        '-task', 'megablast',
        '-db', getBlastDBPath(genus),
        '-max_hsps', 3,
        '-max_target_seqs', 3000,
        '-perc_identity', 100,
        '-query', inputFastaPath,
        '-outfmt', '6 qseqid sseqid length pident mismatch gapopen slen qlen bitscore stitle',
        '-out', outputPath,
        '-num_threads', NUM_CPUS,
  ])

  return exec(command).then(() => outputPath)
}

function generateSummary(outputFolder, statsPath, blastPath) {
  const summaryPath =    `${outputFolder}/references_summary.csv`
  const readLengthPath = `${outputFolder}/references_read_length.csv`

  const command = shellEscape([
    'Rscript', SUMMARY_SCRIPT_PATH,
        statsPath,
        blastPath,
        summaryPath,
        readLengthPath,
  ])

  return exec(command).then(() => [summaryPath, readLengthPath])
}


