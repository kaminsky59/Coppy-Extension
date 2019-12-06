import * as React from 'react';
import { GoogleLogin } from 'react-google-login';

class SignInWithForm extends React.Component {
    render() {
        return (
            <div className="text-center">
                <GoogleLogin clientId='' onSuccess={() => {}} onFailure={() => {}}/>
            </div>
        )
    }
}

export default SignInWithForm;