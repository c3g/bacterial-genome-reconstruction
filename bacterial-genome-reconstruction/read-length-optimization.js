/*
 * read-length-optimization.js
 */

const os = require('os')
const fs = require('fs').promises
const cp = require('child_process')
const util = require('util')
const exec = util.promisify(cp.exec)
const shellEscape = require('shell-escape')
const parseCSV = require('csv-parse/lib/sync')
const del = require('del')
const { range } = require('rambda')

const NUM_CPUS = os.cpus().length

const OPTIMIZATION_SCRIPT_PATH = `${__dirname}/read_length_optimization.R`
const SUMMARY_SCRIPT_PATH      = `${__dirname}/read_length_product.R`
const DB_BY_GENUS_PATH         = `${__dirname}/db/blast_db/by_genus`

module.exports = readLengthOptimization

async function readLengthOptimization(inputFolder, genus, accession) {
  await mkdirp([
    `${inputFolder}/cutoffs`,
    `${inputFolder}/blast_results`,
  ])

  const cutoffs = range(0, ((250 - 150) / 5) + 1).map(n => 150 + n * 5)

  const referenceResultPath = await blastDBCommand(inputFolder, genus, accession)

  /* const readsetPaths = */ await generateReadsets(inputFolder, cutoffs)

  for (cutoff of cutoffs) {
    const blastDBPath = await makeBlastDB(inputFolder, cutoff)
    const blastResultPath = await blast(inputFolder, blastDBPath, referenceResultPath, cutoff)
    // console.log(blastDBPath, blastResultPath)
  }

  const summaryPath = await generateReadLengthSummary(inputFolder, cutoffs)

  const summaryContent = (await fs.readFile(summaryPath)).toString()
  const data = normalizeResults(parseCSV(summaryContent, { columns: true, skip_empty_lines: true }))

  await del([
    `${inputFolder}/cutoffs`,
    `${inputFolder}/blast_results`,
  ])

  return { summaryPath, data }
}

function blastDBCommand(outputFolder, genus, accession) {
  const outputPath = `${outputFolder}/references_result.fasta`

  const command = shellEscape([
    'blastdbcmd',
        '-db', `${DB_BY_GENUS_PATH}/${genus}/db`,
        '-entry', accession,
        '-outfmt', '%f',
        '-out', outputPath
  ])

  return exec(command).then(() => outputPath)
}

function generateReadsets(outputFolder, cutoffs) {
  const subsampledFastaPath = `${outputFolder}/subsample.fasta`

  const command = shellEscape([
    'Rscript', OPTIMIZATION_SCRIPT_PATH,
        cutoffs.join(', '),
        subsampledFastaPath,
        outputFolder,
  ])

  return exec(command)
}

function makeBlastDB(outputFolder, cutoff) {
  const inputPath  = `${outputFolder}/cutoff_${cutoff}.txt`
  const outputPath = `${outputFolder}/cutoffs/cutoff_${cutoff}`

  const command = shellEscape([
    'makeblastdb',
        '-in',  inputPath,
        '-out', outputPath,
        '-dbtype', 'nucl',
        '-parse_seqids',
  ])

  return exec(command).then(() => outputPath)
}

function blast(outputFolder, inputDBPath, inputFastaPath, cutoff) {
  const outputPath = `${outputFolder}/blast_results/cutoff_${cutoff}.csv`

  const command = shellEscape([
    'blastn',
        '-task', 'megablast',
        '-db', inputDBPath,
        '-max_hsps', 1,
        '-max_target_seqs', 5000,
        '-perc_identity', 100,
        '-query', inputFastaPath,
        '-out', outputPath,
        '-outfmt', '6 qseqid sseqid length pident mismatch gapopen slen qlen bitscore stitle',
        '-num_threads', NUM_CPUS,
  ])

  return exec(command).then(() => outputPath)
}

function generateReadLengthSummary(outputFolder, cutoffs) {
  const inputFolderPath = `${outputFolder}/blast_results`
  const outputPath = `${outputFolder}/read_length_summary.csv`

  const command = shellEscape([
    'Rscript', SUMMARY_SCRIPT_PATH,
        cutoffs.join(', '),
        inputFolderPath,
        outputPath,
  ])

  return exec(command).then(() => outputPath)
}

function normalizeResults(data) {
  data.forEach(r => {
    delete r['']
    r.cutoff      = parseInt(r.cutoff, 10)
    r.perfectHits = parseInt(r.perfectHits, 10)
    r.product     = parseInt(r.product, 10)
  })
  data.sort((a, b) => b.product - a.product)
  return data
}

async function mkdirp(filepaths) {
  if (typeof filepaths === 'string')
    filepaths = [filepaths]

  return Promise.all(filepaths.map(filepath =>
    fs.mkdir(filepath)
    .catch(async e => {
      if (e.code === 'EEXIST') {
        if (!(await fs.lstat(filepath)).isDirectory()) {
          throw e
        }
      } else {
        throw e
      }
      return Promise.resolve()
    })
  ))
}

