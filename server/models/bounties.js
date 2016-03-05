const db = require('../db/database');
const util = require('../data-processor/util');

var Bounties = function() {

};

Bounties.prototype.saveIssue = function (githubId, org_name, repo_name, issueNumber, bountyPrice) {
  return db('bountyIssues').insert({
    number: issueNumber, 
    repo_name: repo_name,
    org_name: org_name,
    bounty_price: bountyPrice,
    bounty_user_id: githubId
  })
};

Bounties.prototype.updateIssue = function (internal_id) {
  return db.raw(`select org_name, repo_name, number, etag
          from bountyIssues
          where internal_id=${internal_id};`)
  .then((results) => util.refreshIssuesFromGithub(results[0]))
  .then(() => {
    console.log(`refresh new bountyIssue process FINISHED`);
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    console.error(`refresh bountyIssues process FAILED`);
    process.exit(1); //exit w/ failure
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

Bounties.prototype.removeBounty = function (url) {
  return db('bountyIssues')
    .where({html_url: url})
    .update({
      state: 'done'
    })
};

module.exports = Bounties;
