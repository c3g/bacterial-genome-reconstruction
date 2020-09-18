#!/usr/bin/env Rscript --vanilla

#options(repos="https://cran.rstudio.com",verbose = F )
list.of.packages <-
    c("magrittr", "dplyr", "data.table")
new.packages <- 
    list.of.packages[!(list.of.packages %in% installed.packages()[,"Package"])]

if(length(new.packages)>0) install.packages(new.packages)
suppressMessages(require(magrittr))
suppressMessages(require(dplyr))
suppressMessages(require(data.table))
if (!requireNamespace("BiocManager", quietly = TRUE))
    install.packages("BiocManager")

BiocManager::install("Biostrings")
suppressMessages(require(Biostrings))
#arguments
args <- commandArgs(trailingOnly=TRUE)
cutoffs <- as.character(args[1])
in_path <- as.character(args[2])
out_path <- as.character(args[3])


rl_cutoffs <- 
    as.numeric(unlist(strsplit(cutoffs, split = ",")))

sample_seqs <- 
    readDNAStringSet(in_path)

## trim the sequence, and write out to a new file
## we'll store the number of seqs for later
n_seqs <- 
    lapply(
        rl_cutoffs,
        function(cutoff_number){
            cut_seq <- 
                sample_seqs[lengths(sample_seqs)>=cutoff_number] %>%
                subseq(., 1, cutoff_number)
            writeXStringSet(
                cut_seq,
                sprintf(
                    "%s/cutoff_%i.txt",
                    out_path,
                    cutoff_number
                )
            )
        }
    ) %>%
    unlist

