const React = require('react');
const NavBar = require('./NavBar');

const linksRight = [
  {name: 'Login', url: '/login'},
  {name: 'Profile', url: '/profile'},
  {name: 'Bounties', url: '/bounties'}
];

const linksLeft = [
  {name: 'Getting Started', url: '/resources'},
  {name: 'Beginner\'s Section', url: '/beginner'},
  {name: 'Repositories', url: '/repos'}
];

const App = class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      route: '/',
      currentUser: {
        loggedIn: false,
        displayName: '',
        username: ''
      }
    };
  }

  fetchUserInfo() {
    $.get( 'fetchUserInfo', ( data ) => {
      console.log(data);
      if (data) {
        this.setState({
          currentUser: {
            loggedIn: true,
            displayName: data.displayName,
            username: data.username
          }
        });
      }
    });
  }

  render () {
    return (
    <div className='app-shell grey lighten-2'>
      <NavBar
      fetchUserInfo={this.fetchUserInfo.bind(this)}
      loggedIn={this.state.currentUser.loggedIn}
      login={this.state.currentUser.login}
      linksRight={linksRight}
      linksLeft={linksLeft}/>
      <div className="row">
        <div className="main col s12 container">
          {this.props.children}
        </div>
      </div>
    </div>
    );
  }
};
module.exports = App;
