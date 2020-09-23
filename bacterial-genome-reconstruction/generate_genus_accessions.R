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
genus <- as.character(args[1])

out_dir <- sprintf("db/%s", genus)

if (!dir.exists(out_dir)) {dir.create(out_dir, recursive = TRUE)}
#extracts only the accessions corresponding to title files with the genus string
genus_accessions <- 
  tibble(
    accessions = readLines("db/accessions.txt"),
    titles = readLines("db/titles.txt")
  ) %>%
  filter(grepl(pattern = genus, x = titles, ignore.case = TRUE)) %>%
  pull(accessions)
# Then writes those accessions to db/genus/accessions.txt
fileConn <- 
  file(sprintf("%s/genus_accessions.txt", out_dir))
writeLines(
  genus_accessions, 
  fileConn
)
close(fileConn)
