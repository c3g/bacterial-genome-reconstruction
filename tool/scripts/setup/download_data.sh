#!/bin/bash
set -euf
set -o pipefail


# Download text files of FTP paths
# output files:
#  - db/all_seqs.txt
#  - db/representative_seqs.txt
Rscript ./scripts/setup/download_ncbi_bacteria_ftps.R db


# Download all files using gnu parallel
# should take ~1 hour for all seqs
cat db/all_seqs.txt \
 | parallel --progress --bar -j 8 --gnu \
      wget --timestamping -q -P db/all
# and <20 mins for representative seqs
cat db/representative_seqs.txt \
 | parallel --progress --bar -j 8 --gnu \
      wget --timestamping -q -P db/representative

