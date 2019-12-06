import { LoginDetails } from "../../models/login/loginDetails";
import { User } from "../../models/shared/user";
import FirebaseService from '../firebase/firebaseService';
import { exp } from '../messageService/messageService';

class LoginService {
    private firebaseService: FirebaseService;

    constructor() {
        this.firebaseService = FirebaseService.Instance;
    }

    async loginUser(loginDetails: LoginDetails): Promise<User | null> {

        try {
            let user = await this.firebaseService.login(loginDetails.username, loginDetails.password);

            if(user !== null) {
                const isUser = await this.firebaseService.getUserData(user);

                // First login attempt, add to DB
                if (!isUser) {            
                    this.firebaseService.addToDB<User>('UserAccounts', user.userId!, user);
                }

                exp.sendMessage('setUser', user);

                let entries = await this.firebaseService.getUserNotesFromDB(user!.userId!);

                exp.sendMessage('setCopyEntries', entries);

                return Promise.resolve(user);
            }

            return Promise.reject('User object was null');
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async logoutUser(): Promise<boolean> {
        await this.firebaseService.logout();

        // this.stateService.clearUser();

        return Promise.resolve(true);
    }

    async checkForUserLoggedIn(): Promise<boolean> {
        // check if the user is logged in
       return exp.sendMessage('getUserFromLocal')
       .then(async (response: any) => {
            if (response === null) {
                return Promise.resolve(false);
            }
            let entries = response.entries;

            if(response.user.entryHash !== null) {
                const update = await this.firebaseService.updateNeeded(response.user.userId!, response.user.entryHash);

                if (update.updateNeed) {
                    entries = await this.firebaseService.getUserNotesFromDB(response.user.userId!);
                    response.user.entryHash = update.newEntryHash !== undefined ? update.newEntryHash : response.user.entryHash;
                }
            }
            exp.sendMessage('setUser', response.user)
            exp.sendMessage('setCopyEntries', entries)

            return Promise.resolve(true);
       });
    }
}

export default LoginService