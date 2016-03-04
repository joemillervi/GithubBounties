const React = require('react');

class BountyForm extends React.Component {

  constructor(props) {
    super(props);
    //TODO: we will want to be able to pass in props that tell us which user is currently logged in, and whether or not they have a customer object with credit card access on file

    this.state = {
      issueURL: undefined,
      bountyPrice: 0,
      paymentMethod: '',
      card: {
        number: '',
        cvc: '',
        exp_month: '', //forget the camelCase linters on this one because this is how stripe wants it
        exp_year: '' //forget the camelCase linters on this one because this is how stripe wants it
      }
    };
  }

  componentDidMount() {
    Stripe.setPublishableKey('pk_test_4SrTTNmWSmtYCG2BxAYseTE9'); // set your test public key
  }

  handleSubmit(e) {
    e.preventDefault();
    Stripe.createToken(this.state.card, function (status, response) {
      console.log( status, response );
      var token = response.id;
      //send the token to the server so we can use it to make a customer object and store in our database
      $.ajax({
        url: 'http://127.0.0.1:3000/stripeCC',
        dataType: 'json',
        type: 'POST',
        data: {
          stripeToken: token,
          githubId: 1 //TODO: pass down from app state as props
        },
        success: function(data) {
          console.log('data..............', data);
        },
        error: function(xhr, status, err) {
          console.error('/stripe', status, err.toString());
        }
      });

    });
  }

  handleCreditCardChange(e) {
    let card = this.state.card;
    card[e.target.name] = e.target.value;
    this.setState(card);
    console.log(this.state);
  }

  handleIssueURLChange(e) {
    this.setState({issueURL: e.target.value});
    console.log(this.state);
  }

  handleBountyPriceChange(e) {
    var regex = /^\d+(?:\.\d{0,2})$/;
    this.setState({bountyPrice: e.target.value.replace(regex, '')});
    console.log(this.state);
  }

  onPaymentMethodChange(e) {
    this.setState({
      paymentMethod: e.currentTarget.id
    });
    console.log(e.currentTarget);
  }

  render() {
    console.log(this.state);
    var creditCardForm = (
      <div>
        <p>Note: You will not be charged until you approve and merge a pull request from a bounty hunter.</p>
        <p>Github Bounties will never store your credit card information. </p>

        <div className="row">
          <div className="input-field col s12">
            <span>Card Number</span>
            <input maxLength="20" id="card_number" name="number" placeholder="XXXX XXXX XXXX XXXX" required onChange={this.handleCreditCardChange.bind(this)} />
          </div>
        </div>

        <div className="row">
          <div className="input-field col s12">
            <span>CVC</span>
            <input maxLength="4" id="cvc" name="cvc" placeholder="CVC" required onChange={this.handleCreditCardChange.bind(this)} />
          </div>
        </div>

        <div className="row">
          <div className="input-field col s6">
            <span>Expiration (MM)</span>
            <input maxLength="2" placeholder="MM" id="exp_month" name="exp_month" required onChange={this.handleCreditCardChange.bind(this)} />
          </div>
          <div className="input-field col s6">
            <span>Expiration (YYYY)</span>
            <input maxLength="4" placeholder="YYYY" id="exp_year" name="exp_year" required onChange={this.handleCreditCardChange.bind(this)} />
          </div>
        </div>
      </div>
    );

    var bitCoinForm = (
      <div>
        <span>You selected BitCoin. Good luck figuring this stuff out!</span>
      </div>
    );

    return (
      <div className="row">
        <h3>Post a Bounty</h3>

        <form onSubmit={ this.handleSubmit.bind(this) } className="col s12" >
          <h4>Enter the Github URL of Your Issue</h4>
          <div className="row">
            <div className="input-field col s12">
              <span>Issue URL</span>
              <input name="Issue URL" placeholder="https://github.com/DapperArgentina/DapperArgentina/issues/55" required onChange={this.handleIssueURLChange.bind(this)} />
            </div>
          </div>

          <h4>Enter Your Price</h4>
          <div className="row">
            <div className="input-field col s12">
              <span>$ Amount</span>
              <input name="Price" type="number" min="0.01" step="0.01" placeholder="10.00" onChange={this.handleBountyPriceChange.bind(this)} />
            </div>
          </div>

          <h4>Enter Payment Information</h4> 
          <p>
            <input type="radio" id="Credit Card" checked={this.state.paymentMethod === 'Credit Card'} onChange={this.onPaymentMethodChange.bind(this)}/>
            <label htmlFor="Credit Card">Pay by Credit Card</label>
          </p>
          <p>
            <input type="radio" id="BitCoin" checked={this.state.paymentMethod === 'BitCoin'} onChange={this.onPaymentMethodChange.bind(this)}/>
            <label htmlFor="BitCoin">Pay by BitCoin</label>
          </p>

          {this.state.paymentMethod === 'Credit Card' ? creditCardForm : null}
          {this.state.paymentMethod === 'BitCoin' ? bitCoinForm : null}
          {this.state.paymentMethod !== '' ? <button className="waves-effect waves-light btn" type="submit">Submit Bounty</button> : null}

        </form>

      </div>
    );
  }
}

module.exports = BountyForm;
