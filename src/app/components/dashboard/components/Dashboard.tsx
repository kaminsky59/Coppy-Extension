import * as React from 'react';
import * as $ from 'jquery';

import '../css/dashboard.css'
import { CopyEntry } from '../../../models/dashboard/copyEntry';
import { DashboardService } from '../../../services/dashboardService/dashboardService';
import Banner from './Banner';
import Search from './Search';
import SortBy from './SortBy';
import CoppyCard from './Card';
import LoginService from '../../../services/login/loginService';
import { Redirect } from 'react-router';
import ReactPaginate  from 'react-paginate';
import { DashboardState } from '../../../models/dashboard/dashboard';

class DashBoard extends React.Component<{}, DashboardState> {
    private dashBoardService: DashboardService;
    private loginService: LoginService;

    constructor(props: any) {
        super(props);

        this.dashBoardService = new DashboardService();
        this.loginService = new LoginService();
        this.dashBoardService.getEntriesForUser()
        .then((cards) => {
            this.setState({
                cards:{
                    entries: cards,
                    pageCount: 0,
                    currentPage: 0,
                    start: 0,
                    offset: 4,
                    html: null
                }
            });

            this.renderEntries();
        });

        this.state = {
            cards:{
                entries: [],
                pageCount: 0,
                currentPage: 0,
                start: 0,
                offset: 4,
                html: null
            },
            redirectLogout: false,
            hidePagination: false,
        }
    }

    componentDidMount() {
        this.renderEntries();
    }

    private userLoggedOut = () => {
        this.loginService.logoutUser()
        .then(() => {
            this.setState({
                redirectLogout: true
            });
        });
    }

    private userSync = async () => {
        await this.dashBoardService.syncCardsFromDB();
        const cards = await this.dashBoardService.getEntriesForUser();

        this.state.cards.entries = cards;
        this.state.cards.pageCount = cards.length;
        this.renderEntries();
    }

    private handlePageClick = (data) => {
        this.state.cards.currentPage = data.selected;

        const start = this.state.cards.currentPage * this.state.cards.offset;
        const finish = start + this.state.cards.offset;

        const html = this.generateCardHtml(this.state.cards.entries.slice(start, finish));

        this.setState({
            cards:{
                entries: this.state.cards.entries,
                pageCount: this.state.cards.pageCount,
                currentPage: this.state.cards.currentPage,
                html: html,
                offset: this.state.cards.offset,
                start: start
            }
        });
    }

    private renderEntries() {
        let toStart = this.state.cards.start;
        let html = this.generateCardHtml(this.state.cards.entries.slice(toStart, toStart + this.state.cards.offset));
        
        if (html.length === 0) {
            toStart -= 4;
            html = this.generateCardHtml(this.state.cards.entries.slice(toStart, toStart + this.state.cards.offset));
        }

        this.setState({
            cards:{
                entries: this.state.cards.entries,
                pageCount: this.state.cards.entries.length / 4,
                currentPage: 1,
                html: html,
                offset: this.state.cards.offset,
                start: toStart,
            }
        });
    }

    private onDeleteClicked = (id: string) => {
        this.dashBoardService.removeEntry(id)
        .then(() => {
            const entries = this.state.cards.entries;
            
            this.state.cards.entries = entries.filter((entry: CopyEntry) => {
                return entry.id! !== id;
            });

            this.renderEntries();
        });
    }

    private onTextClicked = () => {
        this.setState({
            hidePagination: !this.state.hidePagination
        });
    }

    private generateCardHtml(entries: CopyEntry[]): any {
        const html: any[] = [];

        entries.forEach((entry: CopyEntry) => {
            html.push((<CoppyCard entry={entry} onDeleteClicked={this.onDeleteClicked} onTextClicked={this.onTextClicked}/>));
        })

        return html;
    }

    render() {
        let { redirectLogout } = this.state;

        if(redirectLogout) return <Redirect to={{pathname: '/signin'} }/>;
        var container = 'pagination-container';
        
        if(this.state.hidePagination) {
            container += ' hidden';
        }
        return (
            <div>
                <Banner userLoggedOut={this.userLoggedOut} syncClicked={this.userSync}/>
                <div className="row search-row">
                    <Search/>
                    <SortBy/>
                </div>
                <div className="card-container">
                    {this.state.cards.html}
                </div>
                <nav className={container}>
                    <ReactPaginate
                        previousLabel=''
                        nextLabel=''
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={this.state.cards.pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={this.handlePageClick}
                        containerClassName={'pagination justify-content-center'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'pagination-active'}
                        pageClassName={'page-item'}
                        pageLinkClassName={'pagination-link'}
                        previousClassName={'page-item'}
                        nextClassName={'page-item'}
                        previousLinkClassName={'pagination-link pagination-prev fas fa-angle-left'}
                        nextLinkClassName={'pagination-link pagination-next fas fa-angle-right'}
                    />
                </nav>
            </div>
        )
    }
}

export default DashBoard;