#!/bin/bash
set -euf
set -o pipefail

# Create directories for the sequence data & BLAST databases
mkdir -p db
mkdir -p db/all/
mkdir -p db/representative/
mkdir -p db/by_genus/
mkdir -p db/blast_db
mkdir -p db/blast_db/all
mkdir -p db/blast_db/representative
mkdir -p db/blast_db/by_genus

# Create directories for the WGS input (for testing/development)
mkdir -p data

# Create directories for outputs for each module (for testing/development)
mkdir -p output
mkdir -p output/module_1
mkdir -p output/module_2
mkdir -p output/module_3
