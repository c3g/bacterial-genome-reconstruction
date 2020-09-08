#!/usr/bin/env Rscript --vanilla

# options(repos="https://cran.rstudio.com" )
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
stats_path <- as.character(args[1])
blast_path <- as.character(args[2])
summary_path <- as.character(args[3])
read_length_path <- as.character(args[4])

stats_table <-
    fread(stats_path)

## add a column for true percent identity, and filter
blast_table <-
    fread(
        blast_path
    ) %>%
    `colnames<-`(c(
        "qseqid", "sseqid", "length",
        "pident", "mismatch",
        "gapopen", "slen", "qlen", "bitscore", "stitle")) %>%
    mutate(npid = round((length*0.01*pident*100)/qlen)) %>%
    filter(npid >= 95)


## Report a summary of each database hit
out_table_hits <-
    blast_table %>%
    mutate(
        sseqid =
            unlist(
                lapply(
                    sseqid,
                    function(x){ strsplit(x, "\\|")[[1]][2]}
                )
            )
    ) %>%
    group_by(sseqid) %>%
    summarise(
        total_count=n(),
        total_bitscore = sum(bitscore),
        slen = unique(slen),
        reads = 2*stats_table$num_seqs,
        exp_coverage =
            round(
                ((total_count * stats_table$avg_len)*(reads/1000))/
                    unique(slen), 2
            ),
        name = first(stitle)
    ) %>%
    arrange(desc(total_count)) %>%
    `colnames<-`(
        c(
            "accession", "total_count",
            "total_bitscore", "genome_length", "total_reads",
            "expected_coverage", "name"

        )
    ) %>%
    as.data.frame()

write.csv(
    out_table_hits,
    summary_path
)

## then get the count of each read length
out_table_read_length <-
    blast_table %>%
    dplyr::count(qlen) %>%
    as.data.frame()

write.csv(
    out_table_read_length,
    read_length_path
)
