#!/usr/bin/env Rscript
#options(repos="https://cran.rstudio.com",verbose = F )
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
genus_name <- as.character(args[1])
outfile <- as.character(args[2])

ftp_paths <- 
    fread(
        "https://ftp.ncbi.nlm.nih.gov/genomes/refseq/bacteria/assembly_summary.txt", 
        stringsAsFactors = F, quote = ""
    ) %>% 
    filter(
        assembly_level =="Complete Genome" & 
            version_status =="latest" &
            grepl(genus_name, organism_name, ignore.case = T)) %>%
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

