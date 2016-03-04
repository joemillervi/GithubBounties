--This script is to create the entire database structure

/*First we create the database and a new user.  You should update the below w/ a different pw for prod*/

CREATE DATABASE gitBegin DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_unicode_ci;

CREATE USER 'gitBegin'@'localhost' IDENTIFIED BY 'password';

GRANT ALL PRIVILEGES ON gitBegin.* TO 'gitBegin'@'localhost';

/*Before running this part you need to login as the gitBegin user (or some user w/ permission on the db)*/
use gitBegin;
CREATE TABLE issues ( /* beginner Issues */
  internal_id int AUTO_INCREMENT PRIMARY KEY,
  id int NOT NULL,
  number int,
  repo_name varchar(50),
  org_name varchar(50), 
  title varchar(2000) NOT NULL,
  comments int,
  created_at datetime,
  updated_at datetime, 
  html_url varchar(255), 
  assignee varchar(255),
  body varchar(1500),
  labels varchar(1000)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE repos ( /* beginner repos */
  internal_id int AUTO_INCREMENT PRIMARY KEY,
  id int,
  name varchar(100) not null, /* repo name */
  org_name varchar(50) not null, 
  html_url varchar(255),
  language varchar(100),
  beginner_tickets int,
  description varchar(1000),
  stargazers_count int,
  watchers_count int, 
  has_wiki bool,
  has_pages bool, 
  open_issues int, 
  forks int,
  created_at datetime,
  updated_at datetime, 
  pushed_at datetime,
  data_refreshed_at datetime,
  record_inserted_at datetime,
  etag varchar(50),
  subscribers_count int,
  network_count int
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE table users (
  internal_id int AUTO_INCREMENT PRIMARY KEY,
  github_id int NOT NULL,
  github_login varchar(50),
  github_name varchar(50),
  github_email varchar(50),
  stripe_cust_id varchar(40),
  stripe_recipient_name varchar(40),
  stripe_recipient_type varchar(40),
  stripe_recipient_id varchar(40),
  stripe_recipient_email varchar(40)
);

CREATE table bountyIssues (
  internal_id int AUTO_INCREMENT PRIMARY KEY,
  id int NOT NULL,
  number int NOT NULL,
  repo_name varchar(50) NOT NULL,
  org_name varchar(50) NOT NULL, 
  title varchar(2000) NOT NULL,
  comments int,
  created_at datetime,
  updated_at datetime, 
  html_url varchar(255), 
  assignee varchar(255),
  body varchar(1500), /* how to get this? */
  labels varchar(1000),
  state varchar(20), /* ticket is open? */
  etag varchar(50),
  bountyAmount int,
  bitCoinAmount int, /* stored in satoshis */
  bounty_user_id int,
  data_refreshed_at datetime,
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE table pullRequests (
  internal_id int AUTO_INCREMENT PRIMARY KEY,
  id int NOT NULL,
  number int, /* issue # */
  repo_name varchar(50),
  org_name varchar(50), 
  title varchar(2000) NOT NULL,
  comments int,
  created_at datetime,
  updated_at datetime, 
  html_url varchar(255), 
  assignee varchar(255),
  body varchar(1500),
  labels varchar(1000),
  issue_id int, /* need to parse body to find this */
  etag varchar(50),
  pr_open bool,
  data_refreshed_at datetime
); /* add anything else? */

CREATE table issuesUsers (
  internal_id int AUTO_INCREMENT PRIMARY KEY,
  issue_id int NOT NULL,
  user_id int NOT NULL,
  pr_id int,
  FOREIGN KEY (user_id) REFERENCES users(internal_id),
  FOREIGN KEY (issue_id) REFERENCES bountyIssues(internal_id),
  FOREIGN KEY (pr_id) REFERENCES pullRequests(internal_id)
);

CREATE INDEX OrgRepo ON repos (name,org_name);