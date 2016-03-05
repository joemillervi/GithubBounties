'use strict';

const Promise = require('bluebird');
const util = require('./util');
const db = require('../db/database');
const sql = require('./sqlQueries');

/**
 * This script iterates through all issues in our bountyIssues db table and refreshes data 
 * from the github API for any issue that has not been refreshed recently.
 */

console.log(`refresh bountyIssues process STARTED at ${new Date()}`);

db.raw(sql.bountyIssuesToUpdate)
.then((results) => util.refreshIssuesFromGithub(results[0]))
.then(() => {
  console.log(`refresh bountyIssues process FINISHED at ${new Date()}`);
  process.exit(0);
})
.catch((err) => {
  console.error(err);
  console.error(`refresh bountyIssues process FAILED at ${new Date()}`);
  process.exit(1); //exit w/ failure
});

// /**
//  * This script iterates through all PRs in our pullRequests db table and refreshes data 
//  * from the github API for any PR that has not been refreshed recently.
//  */

//  console.log(`refresh pullRequests process STARTED at ${new Date()}`);

//  db.raw(sql.bountyIssuesToUpdate)
//  .then((results) => util.refreshIssuesFromGithub(results[0]))
//  .then(() => {
//    console.log(`refresh pullRequests process FINISHED at ${new Date()}`);
//    process.exit(0);
//  })
//  .catch((err) => {
//    console.error(err);
//    console.error(`refresh pullRequests process FAILED at ${new Date()}`);
//    process.exit(1); //exit w/ failure
//  });