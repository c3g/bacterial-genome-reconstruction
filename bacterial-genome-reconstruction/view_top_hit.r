library(data.table)
library(tidyverse)
top_hit <- 
    (fread("output/module_1/module_1_summary_table.csv") %>% 
    pull(accession))[1]

top_hit
