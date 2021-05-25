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
# stats_path <- as.character(args[1])
blast_path <- as.character(args[2])
summary_path <- as.character(args[3])
# read_length_path <- as.character(args[4])

# stats_table <-
#     fread(stats_path)

size <- file.size(blast_path)

if (size == 0) {
    write.csv(list(), summary_path)
    # write.csv(list(), read_length_path)
} else {
    ## add a column for true percent identity, and filter
    blast_table <-
        fread(
            blast_path
        ) %>%
        `colnames<-`(c(
            "qseqid", "sseqid", "length",
            "pident", "mismatch",
            "gapopen", "slen", "qlen", "bitscore", "name")) %>%
        mutate(npid = round((length*0.01*pident*100)/qlen)) %>%
        filter(npid >= 95) %>%
        mutate(
            sseqid =
                unlist(
                    lapply(
                        sseqid,
                        function(x){ strsplit(x, "\\|")[[1]][2]}
                    )
                ),
            genus_name = 
                unlist(
                    lapply(
                        name,
                        function(x){ 
                            paste(strsplit(x, " ")[[1]][1], collapse = " ")
                        }
                    )
                )
        )
    
    blast_table_unique <-
        blast_table %>%
        filter(!duplicated(qseqid) | !duplicated(qseqid, fromLast = T)) %>%
        group_by(genus_name) %>%
        summarise(
            unique_count=n(),
            unique_bitscore = round(sum(bitscore))
        ) %>%
        ungroup %>%
        arrange(desc(unique_bitscore))

    ## Report a summary of each database hit
    blast_table_total <-
        blast_table %>%
        group_by(genus_name) %>%
        summarise(
            total_count=n(),
            total_bitscore = round(sum(bitscore))
        ) %>%
        ungroup %>%
        arrange(desc(total_bitscore)) 

    out_summary <- 
        full_join(
            blast_table_unique, 
            blast_table_total, by = "genus_name"
        ) %>%
        replace(is.na(.), 0) %>%
        arrange(desc(unique_bitscore), desc(total_bitscore)) %>%
        mutate(
            Percent_aligned = round(100*total_count/1000)
        ) %>%
        `colnames<-`(
            c(
                "name",
                "unique_count", "unique_bitscore",
                "total_count", "total_bitscore",
                "percent_aligned"
            )
        ) %>%
        as.data.frame() %>%
        dplyr::slice(1:10)

    write.csv(
        out_summary,
        summary_path, row.names = F
    )

    ## then get the count of each read length
    # out_table_read_length <-
    #     blast_table %>%
    #     dplyr::count(qlen) %>%
    #     as.data.frame()

    # write.csv(
    #     out_table_read_length,
    #     read_length_path
    # )
}
