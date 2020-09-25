#!/bin/bash
set -euf
set -o pipefail


###########################
# Generate main databases #
###########################

# Unzip the sequences and generate the blast database

# ...for all seqs
find db/all/ -type f -name "*.gz" -print0 \
  | xargs -0 gunzip -c \
  | makeblastdb \
    -in - \
    -out db/blast_db/all_seqs_db \
    -title all_seqs \
    -dbtype nucl \
    -parse_seqids

# ...for representative seqs
find db/representative/ -type f -name "*.gz" -print0 \
  | xargs -0 gunzip -c \
  | makeblastdb \
      -in - \
      -out db/blast_db/representative/db \
      -title representative_seqs \
      -dbtype nucl \
      -parse_seqids


# (OPTIONAL) delete the gzipped files
# rm db/all/*.gz
# rm db/representative/*.gz



###############################
# Generate databases by genus #
###############################

# Create text files containing accessions and titles of all genomes in the database
blastdbcmd -db db/blast_db/all_seqs_db -outfmt "%t" -entry 'all' > db/titles.txt
blastdbcmd -db db/blast_db/all_seqs_db -outfmt "%a" -entry 'all' > db/accessions.txt

# Create text files containing all genera names
blastdbcmd -db db/blast_db/all_seqs_db -outfmt "%t" -entry 'all' \
  | awk '{
     if ($0 ~ /^\w/) {
        print tolower($1)
      }
      if ($0 ~ /^'"'"'/) {
        print gensub(/'"'"'(.*)'"'"'.*/, "\\1", "g", tolower($0))
      }
      if ($0 ~ /^\[/) {
        print gensub(/\[(.*)\].*/, "\\1", "g", tolower($0))
      }
    }' \
  | sort \
  | uniq \
  | tail +2 > db/genera.txt

# Generate accessions for each genus
cat db/genera.txt \
  | xargs -I{} Rscript ./scripts/setup/generate_genus_accessions.R "{}"

# the output will be in db/by_genus/salmonella/genus_accessions.txt
# These accessions are used to query the full database, extract those sequences, and pipe them into their own blast database
cat db/genera.txt \
  | awk '{ print gensub(" ", "_", "g", $0) }' \
  | xargs -I{} bash -c '
    blastdbcmd \
      -db db/blast_db/all_seqs_db -outfmt "%f" \
      -entry_batch "db/by_genus/{}/genus_accessions.txt" \
    | makeblastdb \
        -in - \
        -out "db/blast_db/by_genus/{}/db" -title "{}_seqs" \
        -dbtype nucl -parse_seqids
  '
