#!/bin/bash
set -euf
set -o pipefail

./scripts/setup/create_directories.sh
./scripts/setup/download_data.sh
./scripts/setup/create_blast_databases.sh
