/*
=========================================================
POPS PREDICTIONS NFL — TD DATA BUILDER
File: scripts/build-td-data.js
Version: 1.0
=========================================================

PURPOSE

Builds the weekly Top 25 touchdown scorer prediction data.

FINAL OUTPUT

data/td-predictions.json

VERSION 1 FACTORS

1. Touchdown production
2. Player usage
3. Player yardage
4. Team scoring offense
5. Opponent defensive matchup
=========================================================
*/

const fs = require("fs");
const path = require("path");

/*
=========================================================
SETTINGS
=========================================================
*/

const SETTINGS = {
  sport: "football",
  league: "nfl",

  regularSeasonType: 2,

  maximumPredictions: 25,

  playerPositions: [
    "QB",
    "RB",
    "FB",
    "WR",
    "TE"
  ],

  requestDelayMilliseconds: 125
};

/*
=========================================================
PROJECT PATHS
=========================================================
*/

const ROOT_DIRECTORY = path.join(
  __dirname,
  ".."
);

const DATA_DIRECTORY = path.join(
  ROOT_DIRECTORY,
  "data"
);

const UPCOMING_GAMES_FILE = path.join(
  DATA_DIRECTORY,
  "upcoming-games.json"
);

const TEAMS_FILE = path.join(
  DATA_DIRECTORY,
  "teams.json"
);

const TD_PREDICTIONS_FILE = path.join(
  DATA_DIRECTORY,
  "td-predictions.json"
);

/*
=========================================================
ESPN API
=========================================================
*/

const ESPN_BASE_URL =
  "https://site.api.espn.com/apis/site/v2/sports/football/nfl";

const ESPN_CORE_URL =
  "https://sports.core.api.espn.com/v2/sports/football/leagues/nfl";

/*
=========================================================
DIRECTORY HELPER
=========================================================
*/

function ensureDirectories() {
  if (!fs.existsSync(DATA_DIRECTORY)) {
    fs.mkdirSync(DATA_DIRECTORY, {
      recursive: true
    });
  }
}

/*
=========================================================
NUMBER HELPER
=========================================================
*/

function numberValue(value, fallback = 0) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}

/*
=========================================================
TEXT HELPER
=========================================================
*/

function textValue(value, fallback = "") {
  if (
    value === null ||
    value === undefined
  ) {
    return fallback;
  }

  return String(value).trim();
}

/*
=========================================================
WAIT HELPER
=========================================================
*/

function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

/*
=========================================================
FETCH JSON
=========================================================
*/

async function fetchJSON(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(
      `Request failed ${response.status}: ${url}`
    );
  }

  return response.json();
}

/*
=========================================================
READ JSON FILE
=========================================================
*/

function readJSONFile(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) {
      return fallback;
    }

    const fileContents = fs.readFileSync(
      filePath,
      "utf8"
    );

    return JSON.parse(fileContents);
  } catch (error) {
    console.warn(
      `Could not read ${filePath}:`,
      error.message
    );

    return fallback;
  }
}

/*
=========================================================
WRITE JSON FILE
=========================================================
*/

function writeJSONFile(filePath, data) {
  fs.writeFileSync(
    filePath,
    JSON.stringify(data, null, 2),
    "utf8"
  );

  console.log(
    `Saved: ${path.relative(
      ROOT_DIRECTORY,
      filePath
    )}`
  );
}

/*
=========================================================
SEASON HELPER
=========================================================
*/

function getPredictionSeason() {
  const today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  /*
  January through June uses the previous NFL season.

  July through December uses the current/upcoming season.
  */

  return month <= 6
    ? year - 1
    : year;
}

/*
=========================================================
LOAD UPCOMING GAMES
=========================================================
*/

function loadUpcomingGames() {
  const data = readJSONFile(
    UPCOMING_GAMES_FILE,
    []
  );

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.games)) {
    return data.games;
  }

  return [];
}

/*
=========================================================
LOAD TEAMS
=========================================================
*/

function loadTeams() {
  const data = readJSONFile(
    TEAMS_FILE,
    []
  );

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.teams)) {
    return data.teams;
  }

  return [];
}

/*
=========================================================
EMPTY OUTPUT
=========================================================
*/

function createEmptyOutput() {
  return {
    generatedAt: new Date().toISOString(),

    season: getPredictionSeason(),

    version: "1.0",

    model: "POPS TD Prediction Formula",

    predictionCount: 0,

    predictions: []
  };
}

/*
=========================================================
MAIN BUILDER
=========================================================
*/

async function main() {
  console.log(
    "=========================================="
  );

  console.log(
    "POPS TD DATA BUILDER — VERSION 1"
  );

  console.log(
    "=========================================="
  );

  ensureDirectories();

  const season = getPredictionSeason();
  const games = loadUpcomingGames();
  const teams = loadTeams();

  console.log(`Season: ${season}`);
  console.log(`Upcoming games loaded: ${games.length}`);
  console.log(`Teams loaded: ${teams.length}`);

  const output = createEmptyOutput();

  writeJSONFile(
    TD_PREDICTIONS_FILE,
    output
  );

  console.log(
    "Part 1 completed successfully."
  );
}

/*
=========================================================
RUN
=========================================================
*/

main().catch((error) => {
  console.error(
    "POPS TD builder failed:",
    error
  );

  process.exitCode = 1;
});