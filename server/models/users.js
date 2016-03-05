var db = require('../db/database');

var Users = function() {

};

Users.prototype.saveCCPaymentId = function (custId, githubId) {
  githubId = Number(githubId);

  return db('users')
  .where({github_id: githubId})
  .update({stripe_cust_id: custId})
};

// check if user exists
Users.prototype.doesUserExist = function (githubId) {
  return db('users')
  .where({github_id: githubId})
};

Users.prototype.saveBankRecipientId = function (recipientName, recipientType, recipientId, recipientEmail, githubId) {
  return db('users')
  .where({github_id: githubId})
  .update({
  	stripe_recipient_name: recipientId,
  	stripe_recipient_type: recipientId,
  	stripe_recipient_id: recipientId,
  	stripe_recipient_email: recipientId
  })
};

Users.prototype.createUser = function (customer) {
  return db('users').insert({
    github_id: customer.id,
    github_username: customer.username,
    github_name: customer.name,
    github_email: customer.email
  })
};

module.exports = Users;
