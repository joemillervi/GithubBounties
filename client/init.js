
//Code that starts app goes here
const React = require('react');
const ReactDOM = require('react-dom');
const { Router, Route, Link, IndexRoute, hashHistory, RouterContext } = require('react-router');

const App = require('./components/app');
const TicketList = require('./components/TicketList');
const RepoList = require('./components/RepoList');
const RepoProfile = require('./components/RepoProfile');
const ResourceList = require('./components/ResourceList');
const Login = require('./components/Login');
const Signup = require('./components/Signup');
const Profile = require('./components/Profile');
const BountyForm = require('./components/BountyForm');
const BankAccountForm = require('./components/BankAccountForm');
const BitCoinPaymentForm = require('./components/BitCoinPaymentForm');

class Bounties extends React.Component {
  render() {
    return (
        <TicketList bounties='true' />
    );
  }
}

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path='/' component={App}>
      <IndexRoute component={Bounties} />
      <Route path='repos' component={RepoList} />
      <Route path='repoProfile/:repoId' component={RepoProfile} />
      <Route path='resources' component={ResourceList} />
      <Route path='beginner' component={TicketList} />
      <Route path='bounties' component={Bounties} />
      <Route path='login' component={Login} />
      <Route path='signup' component={Signup} />
      <Route path='profile' component={Profile} />
      <Route path='bountyForm' component={BountyForm} />
      <Route path='bankAccountForm' component={BankAccountForm} />
      <Route path='bitcoinpaymentform' component={BitCoinPaymentForm} />
    </Route>
  </Router>
), document.getElementById('app'));
