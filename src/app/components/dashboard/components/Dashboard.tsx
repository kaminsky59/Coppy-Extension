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

            this.attachClickListeners();
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
        }
    }

    componentDidMount() {
        this.renderEntries();
    }

    componentDidUpdate() {
        this.attachClickListeners();
    }

    private attachClickListeners() {
        $('.coppy-card .text').off('click').click(function() {
            var coppyCardParent = $(this).parents('.coppy-card');

            $('.coppy-card').not(coppyCardParent).toggleClass('hidden');
            $(coppyCardParent).toggleClass('open');
            $('.buttons').toggleClass('open');
        });
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
        const html = this.generateCardHtml(this.state.cards.entries.slice(this.state.cards.start, this.state.cards.start + this.state.cards.offset));

        this.setState({
            cards:{
                entries: this.state.cards.entries,
                pageCount: this.state.cards.entries.length / 4,
                currentPage: 1,
                html: html,
                offset: this.state.cards.offset,
                start: this.state.cards.start
            }
        });
    }

    //FIXME: The last item deleted in the list on the page, removes the HTML for all items on the page
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

    private generateCardHtml(entries: CopyEntry[]): any {
        const html: any[] = [];

        entries.forEach((entry: CopyEntry) => {
            html.push((<CoppyCard entry={entry} onDeleteClicked={this.onDeleteClicked}/>));
        })

        return html;
    }

    render() {
        let { redirectLogout } = this.state;

        if(redirectLogout) return <Redirect to={{pathname: '/signin'} }/>;

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
                <nav className="pagination-container">
                    <ReactPaginate
                        previousLabel={'previous'}
                        nextLabel={'next'}
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={this.state.cards.pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={this.handlePageClick}
                        containerClassName={'pagination justify-content-center'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'}
                        pageClassName={'page-item'}
                        pageLinkClassName={'page-link'}
                        previousClassName={'page-item'}
                        nextClassName={'page-item'}
                        previousLinkClassName={'page-link'}
                        nextLinkClassName={'page-link'}
                    />
                </nav>
            </div>
        )
    }
}

export default DashBoard;