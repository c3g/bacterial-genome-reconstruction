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

#arguments
args <- commandArgs(trailingOnly=TRUE)
cutoffs <- as.character(args[1])
cutoff_path <- as.character(args[2])
output_path <- as.character(args[3])

rl_cutoffs <-
    as.numeric(unlist(strsplit(cutoffs, split = ",")))

perfect_alignments <-
    lapply(
        rl_cutoffs,
        function(cutoff_number) {
            lines <- fread(
                sprintf(
                    "%s/cutoff_%i.csv",
                    cutoff_path,
                    cutoff_number
                )
            )

            if (nrow(lines) == 0) {
                return(0)
            }

            blast_table_m3 <-
                lines %>%
                `colnames<-`(c(
                    "qseqid", "sseqid", "length",
                    "pident", "mismatch",
                    "gapopen", "slen", "qlen", "bitscore", "stitle")) %>%
                mutate(npid = round((length*0.01*pident*100)/slen)) %>%
                filter(npid == 100) %>%
                nrow
            blast_table_m3
        }
    ) %>% unlist


m3_summary_table <-
    tibble(
        cutoff = rl_cutoffs,
        perfectHits = perfect_alignments
    ) %>%
    mutate(product = perfectHits * cutoff)

write.csv(
    m3_summary_table,
    output_path
)
