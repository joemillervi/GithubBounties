var db = require('../db/database');

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
