import * as React from 'react';
import * as NotificationSystem from 'react-notification-system';
import SignInForm from './signInForm';
import SignInWithForm from './signInWithForm';
import GoToRegister from './goToRegister';
import { SignInProps } from '../props/signIn';
import { withRouter, Redirect } from 'react-router';
import { LoginDetails } from '../../../models/login/loginDetails';
import LoginService from '../../../services/login/loginService';

import '../css/signIn.css';

interface SignInState {
    redirectToReferrer: boolean
}

class SignIn extends React.Component<SignInProps, SignInState> {
    private loginService: LoginService;
    notificationDOMRef = React.createRef<any>();

    constructor(props: SignInProps) {
        super(props);

        this.loginService = new LoginService();
        this.state = {
            redirectToReferrer: false
        }
    }

    componentDidMount = () => {
        this.checkForState();
    }

    checkForState = () => {
      this.loginService.checkForUserLoggedIn()
      .then((loggedIn) => {
        this.setState({
            redirectToReferrer: loggedIn
        });
      })
    }

    handleAttempt = (userInfo: LoginDetails) => {
        console.log('SignIn Component Called');

        this.loginService.loginUser(userInfo)
        .then(() => {
            this.props.onLoggedIn(true);
            this.props.history.push('/');
        })
        .catch((err) => {
            this.addFailedLoginNotification();
            console.log(err);
        });
    }

    addFailedLoginNotification = () => {
        //   this.notificationDOMRef.current!.addNotification({
        //     message: 'Notification message',
        //     level: 'success'
        //   });
    }

    render() {
        // Need to redirect back to the home page is user is logged in
        let { from } = this.props.location.state || { from: { pathname: "/" } };
        let { redirectToReferrer } = this.state;

        if (redirectToReferrer) return <Redirect to={from} />;

        return (
            <div id='signIn' className='wrap'>
                <div className="login-html">
                    <label htmlFor="tab-1" className="tab">Sign In</label><input id="tab-1" type="radio" name="tab" className="sign-in"></input>
                    <SignInForm onLoginAttempt={this.handleAttempt}/>
                    <p className="divider-text"></p>
                    <SignInWithForm/>
                    <GoToRegister/>
                    <NotificationSystem ref={this.notificationDOMRef} />
                </div>
            </div>
        );
    }
};

export default withRouter(SignIn);