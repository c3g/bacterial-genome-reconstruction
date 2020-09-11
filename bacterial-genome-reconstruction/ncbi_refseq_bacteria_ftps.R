#!/usr/bin/env Rscript --vanilla

list.of.packages <-
    c("magrittr", "dplyr", "data.table")
new.packages <- 
    list.of.packages[!(list.of.packages %in% installed.packages()[,"Package"])]
if(length(new.packages)>0) install.packages(new.packages)

suppressMessages(require(magrittr))
suppressMessages(require(dplyr))
suppressMessages(require(data.table))

#arguments
args <- commandArgs(trailingOnly=TRUE)
outfile <- as.character(args[1])

## Access the refseq genomes
refseq <- 
  fread(
    "https://ftp.ncbi.nlm.nih.gov/genomes/refseq/bacteria/assembly_summary.txt", 
    stringsAsFactors = F, quote = "", select = c(1,11,12,16,18,19,20)
  ) %>% 
  filter(
    assembly_level =="Complete Genome" & 
      version_status =="latest"
  ) %>%
  `colnames<-`(c("assembly", colnames(.)[-1])) %>%
  as_tibble
## Access the Genbank genomes that are not in refseq
genbank <- 
  fread(
    "https://ftp.ncbi.nlm.nih.gov/genomes/genbank/bacteria/assembly_summary.txt", 
    stringsAsFactors = F, quote = "", select = c(1,11,12,16,18,19,20)
  ) %>% 
  filter(
    assembly_level =="Complete Genome" & 
      version_status =="latest"
  ) %>%
  `colnames<-`(c("assembly", colnames(.)[-1])) %>%
  as_tibble %>%
  filter(paired_asm_comp != "identical")

## Combine the rows and extract the ftp links
ftp_paths <- 
  bind_rows(refseq, genbank) %>%
  pull(ftp_path) %>%
  sprintf(
    "%s/%s_genomic.fna.gz",
    ., gsub(".*/", "", .)
  )

fileConn <- 
    file(outfile)
writeLines(
    ftp_paths, 
    fileConn
)
close(fileConn)

