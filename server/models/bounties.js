const db = require('../db/database');
const util = require('../data-processor/util');

var Bounties = function() {

};

Bounties.prototype.saveIssue = function (githubId, org_name, repo_name, issueNumber, bountyPrice, bitcoin_amount) {
  if (bitcoin_amount === undefined) {
    bitcoin_amount = null;
  }
  return db('bountyIssues').insert({
    number: issueNumber, 
    repo_name: repo_name,
    org_name: org_name,
    bounty_price: bountyPrice,
    bounty_user_id: githubId,
    bitcoin_amount: bitcoin_amount,
    bounty_paid: false
  })
};

Bounties.prototype.updateIssue = function (internal_id) {
  return db.raw(`select org_name, repo_name, number, etag
          from bountyIssues
          where internal_id=${internal_id};`)
  .then((results) => util.refreshIssuesFromGithub(results[0]))
  .then(() => {
    console.log(`refresh new bountyIssue process FINISHED`);
  })
  .catch((err) => {
    console.error('error: ', err);
    console.error(`refresh bountyIssues process FAILED`);
  })
};

Bounties.prototype.saveBitcoin = function (bitCoinAmount, org_name, repo_name, number, githubId) {
  return db('bountyIssues').where({
    bounty_user_id: githubId,
    org_name: org_name,
    repo_name: repo_name,
    number: number
  })
  .update({
  	bitcoin_amount: bitCoinAmount
  })
};

module.exports = Bounties;
