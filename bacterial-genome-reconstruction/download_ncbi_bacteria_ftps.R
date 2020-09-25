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
outdir <- as.character(args[1])

## Access the refseq genomes
refseq <- 
  fread(
    "https://ftp.ncbi.nlm.nih.gov/genomes/refseq/bacteria/assembly_summary.txt", 
    stringsAsFactors = F, quote = "", select = c(1,5,11,12,16,18,19,20)
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
    stringsAsFactors = F, quote = "", select = c(1,5,11,12,16,18,19,20)
  ) %>% 
  filter(
    assembly_level =="Complete Genome" & 
      version_status =="latest"
  ) %>%
  `colnames<-`(c("assembly", colnames(.)[-1])) %>%
  as_tibble %>%
  filter(paired_asm_comp != "identical")

## Combine the rows and extract the ftp links
all_ftp_paths <- 
  bind_rows(refseq, genbank) %>%
  pull(ftp_path) %>%
  sprintf(
    "%s/%s_genomic.fna.gz",
    ., gsub(".*/", "", .)
  )

# just the representative paths
representative_ftp_paths <- 
  bind_rows(refseq, genbank) %>%
  filter(refseq_category=="representative genome") %>%
  pull(ftp_path) %>%
  sprintf(
    "%s/%s_genomic.fna.gz",
    ., gsub(".*/", "", .)
  )
## write out all of the ftp paths to one file
fileConn <- 
  file(sprintf("%s/all_seqs.txt",outdir))
writeLines(
  all_ftp_paths, 
  fileConn
)
close(fileConn)

## write out only the representative of the ftp paths to one file
fileConn <- 
  file(sprintf("%s/representative_seqs.txt",outdir))
writeLines(
  representative_ftp_paths, 
  fileConn
)
close(fileConn)
