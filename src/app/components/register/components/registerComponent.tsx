import * as React from 'react';
import GoToLogin from './goToLoginComponent';

import '../css/register.css';
import { RegisterDetails } from '../../../models/register/RegisterDetails';
import { RegisterFormState } from '../state/registerForm';
import RegisterService from '../../../services/login/registerService';

class Register extends React.Component<{}, RegisterFormState> {
    private registerService: RegisterService;

    constructor(props) {
        super(props);

        this.state = {
            emailInput: '',
            passwordInput: '',
            confirmPasswordInput: ''
        };

        this.registerService = new RegisterService()
    }

    onSubmit = (event: any): any => {
        //Validate username password

        let registerDetails: RegisterDetails = {
            email: this.state.emailInput,
            password: this.state.passwordInput
        }

        this.registerService.registerUser(registerDetails)
        .then((response) => {
            // Send a popup that an email has been sent
        })
        .catch((error) => {
            // Send an error message to the component
        });
    }

    render() {
        return (
            <div id='register' className='wrap'>
                <div className="register-html login-html">
                    <label htmlFor="tab-2" className="tab">Register</label><input id="tab-w" type="radio" name="tab" className="sign-in"></input>
                    <div className="login-form register-form">
                        <div className="sign-in-htm">
                            <div className='group'>
                                <label htmlFor="email" className='label'>Email</label>
                                <input type="text" placeholder="Enter Email" name="email" required className='input' onChange={this.emailInputChanged} value={this.state.emailInput}></input>
                            </div>
                            <div className='group'>
                                <label htmlFor="psw" className='label'>Password</label>
                                <input type="password" placeholder="Enter Password" name="psw" required className='input' onChange={this.passInputChanged} value={this.state.passwordInput}></input>
                            </div>
                            <div className='group'>
                                <label htmlFor="psw-repeat" className='label'>Repeat Password</label>
                                <input type="password" placeholder="Repeat Password" name="psw-repeat" required className='input' onChange={this.confirmInputChanged} value={this.state.confirmPasswordInput}></input>
                            </div>
                            <hr></hr>
                            <p>By creating an account you agree to our <a href="#">Terms Privacy</a>.</p>
                            <div className="group">
                                <input type="submit" className="registerbtn button" value="Register" onClick={this.onSubmit}></input>
                            </div>
                        </div>
                    </div>
                    <GoToLogin/>
                </div>
            </div>
        )
    }

    private emailInputChanged = (event: React.FormEvent<HTMLInputElement>): void => {
        this.setState({
            emailInput: event.currentTarget.value
        });
    }

    private passInputChanged = (event: React.FormEvent<HTMLInputElement>): void => {
        this.setState({
            passwordInput: event.currentTarget.value
        });
    }

    private confirmInputChanged = (event: React.FormEvent<HTMLInputElement>): void => {
        this.setState({
            confirmPasswordInput: event.currentTarget.value
        })
    }
}

export default Register;