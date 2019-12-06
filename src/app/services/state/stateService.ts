import FirebaseService from "../firebase/firebaseService";
import { User } from "../../models/shared/user";
import { CopyEntry } from "../../models/dashboard/copyEntry";
import { sha1 } from 'object-hash';
import { exp } from '../messageService/messageService';

export class StateService {

    public isLoggedIn = (): boolean => {return this.user !== undefined};
    private user!: User | null;
    private entries: CopyEntry[];
    private firebaseService: FirebaseService;
    private entryHash = () => {return sha1(this.entries);}
    private static instance: StateService;
    private recordAllowed: boolean;

    private constructor() {
        this.firebaseService = FirebaseService.Instance;
        this.entries = [];
        this.recordAllowed = true;

        exp.attachStateListener(this.listenForMessages.bind(this));
    }

    static get Instance(): StateService {
        return this.instance || (this.instance = new this()); 
    }

    getUserFromLocal(): Promise<any> {
        return new Promise((resolve, rejcet) => {
            chrome.storage.local.get(['coppy_extension'], async (response) => {
                if (response['coppy_extension']=== undefined) return resolve(null);
    
                let user: User = {
                    userId: response['coppy_extension']['uid'],
                    name: response['coppy_extension']['name'],
                    lastLogin: new Date(),
                    entryHash: response['coppy_extension']['hash'],
                    settings: response['coppy_extension']['settings'],
                }

                this.recordAllowed = user.settings.recordAllowed;

                resolve({user: user, entries: response['coppy_extension']['entries']});
            });
        });
    }

    async quietCheckLogState(): Promise<boolean> {
        console.log('Quiet check called');
        return this.getUserFromLocal()
        .then((response: any) => {
            if (response === null) {
                console.log('Quiet check called: NOT Logged in');

                return Promise.resolve(false);
            }

            this.user = response.user;
            console.log('Quiet check called: Logged in');

            return Promise.resolve(true);
        });
    }

    set User(user: User) {
        if (user !== undefined) {
            this.user = user;

            chrome.storage.local.set({
                'coppy_extension' : {
                    uid: user.userId,
                    name: user.name,
                    lastLogin: user.lastLogin,
                    settings: user.settings
                }
            });
        }
    }

    get User(): User{
        return this.user!;
    }

    set CopyEntries(entries: CopyEntry[]) {
        if (entries === undefined) {
            entries = []
        }

        this.entries = entries;
        chrome.storage.local.get(['coppy_extension'], (response) => {
            let data = response['coppy_extension'];
            data.hash = this.entryHash();
            data.entries = this.entries;

            chrome.storage.local.set({
                'coppy_extension' : data
            });
        });
    }

    get CopyEntries(): CopyEntry[] {
        return this.entries;
    }

    get toggleState(): boolean {
        return this.recordAllowed;
    }

    addEntry(entry: CopyEntry): void {
        chrome.storage.local.get(['coppy_extension'], async (response) => {
            var entryWithId = await this.firebaseService.setEntryToDB(this.user!.userId!, entry, this.entryHash());

            this.entries = response['coppy_extension'].entries;
            this.entries.push(entryWithId);
            response['coppy_extension'].entries = this.entries;
            response['coppy_extension'].entryHash = this.entryHash();
            
            chrome.storage.local.set(response);
        });
    }

    clearUser():void {
        this.user = null;
        chrome.storage.local.remove('coppy_extension');
    }

    toggleRecord(): boolean {
        if (this.user) {
            this.user.settings.recordAllowed = !this.user.settings.recordAllowed;

            chrome.storage.local.get(['coppy_extension'], async (response) => {
                response['coppy_extension'].settings.recordAllowed = this.user!.settings.recordAllowed;
                
                chrome.storage.local.set(response);
            });

            this.firebaseService.updateRecordState(this.user.settings.recordAllowed, this.user.userId!);

            return this.user.settings.recordAllowed;
        }
        return false;
    }

    removeEntry(id: string) {
        chrome.storage.local.get(['coppy_extension'], async (response) => {
            const entries = response['coppy_extension'].entries as CopyEntry[];

            const newEntries = entries.filter((entry) => {
                return entry.id! !== id;
            });

            response['coppy_extension'].entries = newEntries;
            response['coppy_extension'].entryHash = this.entryHash();

            chrome.storage.local.set(response);

            this.firebaseService.removeEntry(this.user!.userId!, id);
            this.firebaseService.updateHash(this.user!.userId!, this.entryHash());

        });
    }

    private listenForMessages(message: any, sender: any, callback: any) {
        const prom = new Promise((res) => {
            switch (message.func) {
                case 'getUserFromLocal':
                    this.getUserFromLocal().then((response) => res(response));
                    break;
                case 'quietCheckLogState':
                    break;
                case 'addEntry':
                    this.addEntry(message.params);
                    res();
                    break;
                case 'getUserFromLocal':
                    break;
                case 'clearUser':
                    this.clearUser();
                    res();
                    break;
                case 'toggleRecord':
                    res(this.toggleRecord());
                    break;
                case 'setCopyEntries':
                    this.CopyEntries = message.params;
                    res();
                    break;
                case 'setUser':
                    this.User = message.params;
                    res();
                    break;
                case 'getCopyEntries':
                    res(this.CopyEntries);
                    break;
                case 'getRecordState':
                    res(this.toggleState)
                    break;
                case 'removeEntry':
                    this.removeEntry(message.params);
                    res();
                default:
                    break;
            }
        })

        prom.then((response) => callback(response));

        return true;
    }
}

export interface StateChange {
    state: string;
    oldValue: any;
    newValue: any;
}