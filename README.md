
# Bacterial Genome Reconstruction

This is the source code for a web tool that identifies bacterial genomes & optimizes read-lengths.

It is divided as such:
 - `/tool`: CLI scripts exposed as nodejs functions in a neat package
 - `/server`: the back-end (nodejs+express)
 - `/client`: the front-end (react)


## Install

### Dependencies
 - Unix tools: `xargs`
 - GNU `parallel`
 - BBTools: https://jgi.doe.gov/data-and-tools/bbtools/
 - BLAST utilities: https://ftp.ncbi.nlm.nih.gov/blast/executables/blast+/LATEST/
 - seqkit: https://bioinf.shenwei.me/seqkit/
 - R: https://www.r-project.org/

### Data

Run: `cd tool && ./scripts/setup/index.sh`

This will create the directories, download the data, and create the bast
databases required for running the tool.

### Application

Run: `cd server && npm i`

This will create the required directories, install the backend & frontend,
and build the frontend.

## Development

Run:
 - `cd server && npm watch`
 - `cd client && npm start`

## Architecture

The app is composed of 3 steps (or "modules"). Those steps operate on the same input files.
Steps:
 - Identify species
 - Identify exact reference
 - Optimize read length

The `./tool` part of the application was conceived in cooperation with Matthew D'Iorio
and Ken Dewar. The specs document is available at `./tool/specs.Rmd`. It shows how to
perform the different steps of the app on the command line. It exposes the functionality
as various nodejs functions, used by the `./server`.

The server's job is to receive the input file(s) (R1 or R1+R2), and expose the scripts in
`./tool` to run on those files. The scripts can be computationally expensive, so there is
a task runner to ensure at most 1 job is running. The concepts of requests & tasks are explained
in more details in `./server/helpers/request.js`.

The client is a simple react/redux app.

The data for the "Identify species" step is composed of one blast DB with one sample for
each species. For the step "Identify exact reference", the is one blast DB for each species,
with all the refernces for such species. Using a single DB for all references was too slow.
