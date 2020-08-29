# Nodejs-scraper

This app starts with rendering html template which reads data from database and stores scraped data in database.


## Endpoints

first endpoint is to read data from database and display on html template.
second endpoint first scraps the PPRA tenders and stores in database.

## scraper

scraper works in headless chromium browser using puppeteer library. It scraps the whole tenders table, using loop we get row and then each column of row, each row having columns is stored as object which then is added to an array so ultimately at the end the async fucntion returns an array of objects where each object is a row. 
This array is return to the express endpoint which then stores it in DB. 

## Database - Postgresql

for DB, postgresql is connected for now using psql database and table has been created.
