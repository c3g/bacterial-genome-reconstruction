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
db_name <- as.character(args[1])
outfile <- as.character(args[2])

if (db_name=="representative"){
    ftp_paths <- 
        fread(
            "https://ftp.ncbi.nlm.nih.gov/genomes/refseq/bacteria/assembly_summary.txt", 
            stringsAsFactors = F, quote = ""
        ) %>% 
        filter(
            assembly_level =="Complete Genome" & 
                version_status =="latest" &
                refseq_category=="representative genome") %>%
        pull(ftp_path) %>%
        sprintf(
            "%s/%s_genomic.fna.gz",
            ., gsub(".*/", "", .)
        )

} else {
    ftp_paths <- 
        fread(
            "https://ftp.ncbi.nlm.nih.gov/genomes/refseq/bacteria/assembly_summary.txt", 
            stringsAsFactors = F, quote = ""
        ) %>% 
        filter(assembly_level =="Complete Genome" & version_status =="latest") %>%
        pull(ftp_path) %>%
        sprintf(
            "%s/%s_genomic.fna.gz",
            ., gsub(".*/", "", .)
        )
}

fileConn <- 
    file(outfile)
writeLines(
    ftp_paths, 
    fileConn
)
close(fileConn)

