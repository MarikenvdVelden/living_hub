library(tidyverse)
library(haven)
library(here)

d <- read_spss(here("data/raw/living_hub_data.sav")) %>%
  zap_labels()

d <- d %>%
  pivot_longer(cols = en:xx,
               names_to = "language") %>%
  filter(value==1) %>%
  select(-value) %>%
  pivot_longer(cols = man:bot,
               names_to = "method") %>%
  filter(value==1) %>%
  select(-value) %>%
  pivot_longer(cols = forma:other,
               names_to = "measurement") %>%
  filter(value==1) %>%
  select(-value) %>%
  mutate(validation = if_else(valid1==0 & valid2== 0, "no validation attempt",
                      if_else(valid1==1 & valid2 == 0, "validation attempt: discussion",
                      if_else(valid1 ==1 & valid2 == 1, "validation attempt: discussion & demonstration",
                              "validation attempt: demonstration"))),
         method2 = recode(method, 
                         `man` = "Manual", 
                         `lnk` = "Rule-based",
                         `key` = "Rule-based",
                         `dct` = "Rule-based",
                         `nlp` = "Rule-based",
                         `sof` = "Rule-based",
                         `sna` = "Unsupervised",
                         `lda` = "Unsupervised",
                         `dcs` = "Unsupervised",
                         `plg` = "Unsupervised",
                         `sml` = "Supervised",
                         `hca` = "Supervised", 
                         `bot`= "Other",
                         `mat` = "Other")) %>%
  select(doi, language, method, method2, measurement:validation) 

write_csv(d, here("data/intermediate/data_living_hub.csv"))

head(d, 10)
#Input hub: methods2, language, data (politieke actoren, citizens, media -- andere wp's via doi connectie linken aan de hub)
      ## COderen van data onderdeel van gesprek in Sept -- hoe linken we dit! Wat is their idea?
# Output hub: papers based on methods, language, data, 
            # measurement met verschillende kleuren per categorie (zie viz Laslo) (pop-up box van categorien Measurement die begrijpelijk zijn), 
            # validation