import FirebaseService from "../firebase/firebaseService";
import { CopyEntry } from "../../models/dashboard/copyEntry";
import { BrowserService } from "../browser/browserService";
import { exp } from '../messageService/messageService';
import { User } from "../../models/shared/user";

export class DashboardService {
    private firebaseService: FirebaseService;
    private browserService: BrowserService;

    constructor() {
        this.firebaseService = FirebaseService.Instance;
        this.browserService = new BrowserService();
    }

    getEntriesForUser(): Promise<CopyEntry[]> {
        return exp.sendMessage('getCopyEntries');
    }

    async syncCardsFromDB(): Promise<void> {
        const user = await exp.sendMessage('getUser') as User;
        let entries = await this.firebaseService.getUserNotesFromDB(user.userId!);

        await exp.sendMessage('setCopyEntries', entries);

        return Promise.resolve();
    }
    async removeEntry(id: string): Promise<void> {
        return exp.sendMessage('removeEntry', id);
    }
    
    recordToggle(): Promise<boolean> {
        return exp.sendMessage('toggleRecord');
    }

    getRecordState(): Promise<boolean> {
        return exp.sendMessage('getRecordState');
    }
}