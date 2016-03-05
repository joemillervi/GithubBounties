var db = require('../db/database');

var Bounties = function() {

};

Bounties.prototype.saveBitcoin = function (bitCoinAmount, org_name, repo_name, number, githubId) {
  return db('bountyIssues')
    .where({github_id: githubId})
    .update({
    	bitcoin_amout: bitCoinAmount,
    	org_name: org_name,
    	repo_name: repo_name,
    	number: number,
      githubId: githubId
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
