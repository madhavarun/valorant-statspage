# Valorant Statspage
## WIP

This is a project that aims to create a vlr-like interface to store the results and stats of valorant games, made for a 10mans server.
This repo only contains the website/frontend part of the page, the server code is maintained [here](https://github.com/madhavarun/valorant-statspage-server)
[Sample site](https://amc10.pages.dev)

## Current Features
- Display player stats individually (per agent) and overall
- Display scoreboard of each match
- Display a list of all the matches

## Setup
1. Setup a server following [this](https://github.com/madhavarun/valorant-statspage-server) to process and store the data from the game
2. In config.json save API_URL as the url to the server setup earlier.
3. Clone this repo and build the site with `npm run build`