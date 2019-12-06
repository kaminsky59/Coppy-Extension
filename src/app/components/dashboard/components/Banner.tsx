import * as React from 'react';
import LoginService from '../../../services/login/loginService';
import { DashboardService } from '../../../services/dashboardService/dashboardService';

interface BannerProps {
    userLoggedOut: () => void,
    syncClicked: () => void,
}

interface BannerState {
    recordState: string;
}

class Banner extends React.Component<BannerProps, BannerState> {
    private loginService: LoginService;
    private dashboardService: DashboardService;

    constructor(props: BannerProps) {
        super(props);
        this.state = {
            recordState: ''
        }
        this.loginService = new LoginService();
        this.dashboardService = new DashboardService();

        this.dashboardService.getRecordState()
        .then((state) => {
            this.setState({
                recordState: this.getRecordClassname(state)
            })
        })
    }

    private logoutClicked = () => {
        this.loginService.logoutUser();
        this.props.userLoggedOut();
    }

    private syncClicked = () => {
        this.props.syncClicked();
    }

    private recordToggleClicked = () => {
        this.dashboardService.recordToggle()
        .then((state) => {
            this.setState({
                recordState: this.getRecordClassname(state)
            })
        });
    }

    private getRecordClassname(toggleState: boolean): string {
        return 'record-' + (toggleState ? 'enabled' : 'disabled');
    }

    render() {
        return (                
            <div className="banner">
                    <div className="logo">
                        <img src="images/logo.png"></img>
                    </div>
                    <div className="logo-name"><span>COPPY</span></div>
                    <div className="settings">
                        <div className="btn-group">
                        <button type="button" className="btn btn-settings" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        </button>
                        <div className="dropdown-menu dropdown-menu-right">
                            <a className="dropdown-item" href="#" onClick={this.recordToggleClicked}><span className={"fas fa-circle " + this.state.recordState} aria-hidden="true"></span>Record</a>
                            <a className="dropdown-item" href="#" onClick={this.syncClicked}><span className="fas fa-sync" aria-hidden="true"></span>Sync</a>
                            <div className="dropdown-divider"></div>
                            <a className="dropdown-item" href="#" onClick={this.logoutClicked}><span className="fas fa-sign-out-alt" aria-hidden="true"></span>Logout</a>
                        </div>
                        </div>
                    </div>
            </div>
        )
    }
}

export default Banner;