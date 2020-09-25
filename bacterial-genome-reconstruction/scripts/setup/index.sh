#!/bin/bash
set -euf
set -o pipefail

./scripts/setup/create_directories.sh
./scripts/setup/create_blast_databases.sh
./scripts/setup/create_blast_databases_by_genus.sh
