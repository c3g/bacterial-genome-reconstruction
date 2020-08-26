
library(tidyverse)
library(data.table)

## load the stats table and the blast table
stats_table <-
    fread("data/stats.txt")

## add a column for true percent identity, and filter
blast_table_m1 <-
    fread(
        "data/module_1_blast.csv"
    ) %>%
    `colnames<-`(c(
        "qseqid", "sseqid", "length",
        "pident", "mismatch",
        "gapopen", "slen", "qlen", "bitscore")) %>%
    mutate(npid = round((length*0.01*pident*100)/qlen)) %>%
    filter(npid >= 95)

## the depth of the full database will be the number of R1s*2
sample_depth <-
    stats_table %>%
    pull(sequences)*2

mean_seq_length <-
    sample_table %>%
    pull(`average length`)

## Report a summary of each database hit
out_table_hits <-
    blast_table_m1 %>%
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
        reads = sample_depth,
        exp_coverage =
             round(
                 ((total_count * mean_ss_length)*(sample_depth/1000))/
                     unique(slen)
                 )
        ) %>%
    arrange(desc(total_count)) %>%
    `colnames<-`(
        c(
            "accession", "total_count",
            "total_bitscore", "genome_length", "total_reads",
            "expected_coverage"

            )
        )
write_csv(
    out_table,
    "data/module_1_summary_table.csv",
    )

## then get the count of each read length
out_table_read_length <-
    blast_table_m1 %>%
    dplyr::count(qlen)

write_csv(
    out_table,
    "data/module_1_read_length_table.csv",
    )
