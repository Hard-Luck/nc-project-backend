const devData = require("../data/development-data/index.js");
export const seed = require("./seed.js");
export const db = require("../connection.js");

const runSeed = () => {
  return seed(devData).then(() => db.end());
};

runSeed();
