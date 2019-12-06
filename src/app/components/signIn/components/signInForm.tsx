import * as React from 'react';
import { SignInFormProps } from '../props/signInForm';
import { withRouter } from 'react-router';
import { UserInfo } from 'os';
import { LoginDetails } from '../../../models/login/loginDetails';
import { SignInFormState } from '../state/signInForm';

class SignInForm extends React.Component<SignInFormProps, SignInFormState> {
    constructor(props: any) {
        super(props);
        
        this.state = {
            emailInput: '',
            passwordInput: ''
        }
      }

    onClick = (event: any): any => {

        let userInfo: LoginDetails = {
            username: this.state.emailInput,
            password: this.state.passwordInput
        };

        this.props.onLoginAttempt(userInfo);
    }

    render()  {
        return (
            <div className="login-form">
                <div className="sign-in-htm">
                    <div className="group">
                        <label htmlFor="user" className="label">Email</label>
                        <input id="user" type="text" className="input" value={this.state.emailInput} onChange={this.userInputChanged}></input>
                    </div>
                    <div className="group">
                        <label htmlFor="pass" className="label">Password</label>
                        <input id="pass" type="password" className="input" data-type="password" value={this.state.passwordInput} onChange={this.passInputChanged}></input>
                    </div>
                    <div className="group">
                        <input type="submit" className="button" value="Sign In" onClick={this.onClick}></input>
                    </div>
                    <div className="hr"></div>
                </div>
            </div>
            )
    }

    private userInputChanged = (event: React.FormEvent<HTMLInputElement>): void => {
        this.setState({
            emailInput: event.currentTarget.value
        });
    }

    private passInputChanged = (event: React.FormEvent<HTMLInputElement>): void => {
        this.setState({
            passwordInput: event.currentTarget.value
        });
    }
}

export default withRouter(SignInForm);