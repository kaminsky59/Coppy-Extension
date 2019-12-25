import { CopyEntry } from "./copyEntry";

export interface DashboardState {
    cards: {
        entries: any;
        pageCount: number;
        currentPage: number;
        start: number;
        offset: number;
        html: any;
    };
    redirectLogout: boolean;
    hidePagination: boolean;
}