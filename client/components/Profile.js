const React = require('react');
const Link = require('react-router').Link;

class Profile extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      currentUser: null,
      prUrl: '',
      claimedIssues: [
        {title: 'Some Mapped Dang',
        url: 'https://github.com/ProfoundMongoose/GithubBounties/pulls'
        },
        {title: 'Second Mapped Dang',
        url: 'https://github.com/ProfoundMongoose/GithubBounties/pulls/2'
        } // Suppose to be fetched from the server 
      ],
      issueToggle: undefined
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

  submitPull(url) { 
    $.post('submitPull', {url: url, }, ( data ) => {
      console.log(data);
    });
  }

  toggleIssue(index){
    console.log('state in toggle', this.state);
    console.log('toggled', index);
    var obj = {};
    obj[index] = !this.state.issueToggle[index];
    this.setState({
      issueToggle: Object.assign(this.state.issueToggle, obj)
    })
  }

  componentDidMount() {
    this.fetchUserInfo();
    var obj = {};
    console.log('state issues', this.state.claimedIssues);
    console.log('state before claimedIssues', this.state);
    this.state.claimedIssues.forEach(function(issue, index){
      obj[index] = false;
    })
    console.log('obj', obj);
    this.setState({issueToggle: obj}) 
    console.log('state after issues', this.state);
  }

  render() {
    var submitPull = this.submitPull.bind(this);
    var toggleIssue = this.toggleIssue.bind(this);
    var state = this.state;
    if(this.state.currentUser){
    return (
      <div className="row">
        <div className="col s12 m12">
          <div id='profile' className="card white">
            <div className="card-content black-text" >
              <div className="row">
                <div className="col s12 m4 l6">
                  <img className="responsive-img" src={`${this.state.currentUser.avatar}`} /> 
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
              {
                this.state.claimedIssues.map(function(issue, i){

                  return (
                    <div>
                      <h4> {issue.title} </h4>
                      {state.issueToggle[i] ? <input placeholder='Enter your PRs URL '/> : null }
                      {state.issueToggle[i] ? <button className='btn' onClick={submitPull.bind(null, issue.url)}>Submit </button>
                                                 : <button className='btn' onClick={toggleIssue.bind(null, i)}> Add PR URL </button> }
                    </div>
                  )
                })
              }
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