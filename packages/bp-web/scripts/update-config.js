/**
 * Updates Pokemon base stats config file
 */

const fs = require('fs');

const { fetchBaseStats } = require('shared');

fetchBaseStats()
  .then((baseStats) => {
    try {
      const pathToSrc = `${__dirname}/../src`;
      if (!fs.existsSync(pathToSrc)) {
        fs.mkdirSync(pathToSrc);
      }

      const pathToFile = `${pathToSrc}/stats.json`;
      fs.writeFileSync(pathToFile, JSON.stringify(baseStats, null, 2));
      console.log('+ Successful write to stats.json config file');
    } catch (err) {
      console.log('- Error in file write');
      console.log('- See below for error\n');
      console.error(err);
    }
  })
  .catch((err) => {
    console.log('- Error in fetching stats');
    console.log('- See below for error\n');
    console.error(err);
  });
