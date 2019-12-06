import { BrowserService } from "./services/browser/browserService";
import { StateService } from "./services/state/stateService";
import { CopyEntry } from "./models/dashboard/copyEntry";
import { v4 } from 'uuid';

export class BackgroundScript {
    private browserService: BrowserService;
    private stateService: StateService;

    constructor() {
        this.browserService = new BrowserService();
        // this.dashboardService = new DashboardService();
        this.stateService = StateService.Instance;

        this.browserService.addListener('copy', this.onCopyCalled.bind(this));
        // this.stateService.quietCheckLogState();
    }

    async onCopyCalled(response: any): Promise<void> {
        if (this.stateService.isLoggedIn() && this.stateService.User.settings.recordAllowed) {
            const url = await this.browserService.getTabUrl();
            let entry: CopyEntry = {
                text: response, 
                url: url,
                date: new Date()
            }

            this.stateService.addEntry(entry);
        }

        return Promise.resolve();
    }
};

let test = new BackgroundScript();