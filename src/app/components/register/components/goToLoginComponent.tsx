import * as React from 'react';
import { Link } from 'react-router-dom';

class GoToLogin extends React.Component {
    render() {
        return (
            <div>
                <div className="etc-login-form">
                    <p>If you alreadty have an account
                        <Link to='/signin'>Login</Link>
                    </p>
                </div>
            </div>
        );
    }
}

export default GoToLogin;