const React = require('react');
const Link = require('react-router').Link;

class Profile extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      currentUser: null
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
            username: data.username,
            avatar: data._json.avatar_url
          }
        });
      }
    });
  }

  componentDidMount() {
    this.fetchUserInfo();
  }

  render() {
    if(this.state.currentUser){
    return (
      <div className="row">
        <div className="col s12 m12">
          <div id='profile' className="card white">
            <div className="card-content black-text" >
              <div className="row">
                <div className="col s12 m4 l6">
                  <img class="responsive-img" src={`${this.state.currentUser.avatar}`} /> 
                </div>
                <div className="col s12 m4 l6">
                  <div className="row">
                    <h3> {this.state.currentUser.displayName} </h3>
                  </div>
                  <div className="row">
                    <h4> Github handle: {this.state.currentUser.username} </h4>
                  </div>
                </div>
              </div>
              <h3> Open Bounties: </h3>
              <h4> Fix some Dang </h4>
              <input placeholder='Enter your PRs URL'></input> <button className='btn'> Submit </button>
              <h4> Fix another Dang </h4>
              <input placeholder='Enter your PRs URL'></input> <button className='btn'> Submit </button>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <div> </div>
  }

  }
}


module.exports = Profile;