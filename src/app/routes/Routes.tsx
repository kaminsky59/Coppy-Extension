import * as React from 'react';
import { Route, Redirect, withRouter, RouteComponentProps } from 'react-router-dom';
import SignIn from '../components/signIn/components/signIn';
import Register from '../components/register/components/registerComponent';
import Dashboard from '../components/dashboard/components/Dashboard';
import LoginService from '../services/login/loginService';

interface AuthState {
  isAuthenticated: boolean,
  loaded: boolean
}

class Routes extends React.Component<any, AuthState>{
  private loginService: LoginService;

  constructor(props: any) {
    super(props);

    this.loginService = new LoginService();

    this.state = {
      isAuthenticated: false,
      loaded: false,
    };
  }

  componentDidMount = () => {
    this.checkForState();
  }

  checkForState = () => {
    this.loginService.checkForUserLoggedIn()
    .then((loggedIn) => {
      this.setState({
        isAuthenticated: loggedIn,
        loaded: true
      });
    })
  }

  loggedIn = () => {
    this.setState({
      isAuthenticated: true,
      loaded: true
    });
  }

  render() {
    var loaderClass = 'loader-container' + (this.state.loaded ? ' hidden' : '')
    return (
      <div>
        <div className={loaderClass}>
          <div className="css-loader"></div>
        </div>  
        <div className={!this.state.loaded ? 'hidden' : ''}>
          <Route path='/' exact render={() => (
            !this.state.isAuthenticated ? (<Redirect to={{pathname: '/signin'} }/>) : (<Dashboard/>)
          )}/>
          <Route path='/signin' exact render={() => (
            <SignIn onLoggedIn={this.loggedIn}/>
          )}/>
          <Route path='/register' exact component={Register}/>
        </div>
      </div>
    );
  }
}

export default withRouter(Routes);