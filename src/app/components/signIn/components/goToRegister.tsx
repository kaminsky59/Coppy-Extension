import * as React from 'react';
import { Link } from 'react-router-dom';

class GoToRegister extends React.Component{
    render() {
        return (
            <div>
                <div className="etc-login-form">
                    <p>New User?  
                        <Link to="/register/">Create new account</Link>
                    </p>
                </div>
            </div>
        )
    }
}

export default GoToRegister;