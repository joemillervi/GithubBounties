var db = require('../db/database');

var Bounties = function() {

};

Bounties.prototype.saveBitcoin = function (bitCoinAmount, org_name, repo_name, number, githubId) {
  return db('bountyIssues')
    .where({github_id: githubId})
    .update({
    	bitcoin_amout: recipientId,
    	stripe_recipient_type: recipientId,
    	stripe_recipient_id: recipientId,
    	stripe_recipient_email: recipientId
    })
};

Bounties.prototype.createUser = function (customer) {
  return db('users').insert({
    github_id: customer.id,
    github_login: customer.login,
    github_name: customer.name,
    github_email: customer.email
  })
};

module.exports = Bounties;
