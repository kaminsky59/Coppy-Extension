import { auth, initializeApp, app, firestore}  from 'firebase';
import { User } from '../../models/shared/user';
import { CopyEntry } from '../../models/dashboard/copyEntry';

class FirebaseService {
    private firebaseAuth!: auth.Auth;
    private firebaseApp!: app.App;
    private firebaseDB!: firestore.Firestore;
    private static instance: FirebaseService;

    private constructor() {
        const firebaseConfig = {
                apiKey: "",
                authDomain: "",
                databaseURL: "",
                projectId: "",
                storageBucket: "",
                messagingSenderId: "",
                appId: ""
            };

        this.firebaseApp = initializeApp(firebaseConfig);
        this.firebaseAuth = auth();
        this.firebaseDB = firestore(this.firebaseApp);
    }

    static get Instance(): FirebaseService {
        return this.instance || (this.instance = new FirebaseService());
    }

    async login(email: string, password: string): Promise<User | null> {
        
        try {
            let response = await this.firebaseAuth.signInWithEmailAndPassword(email, password)
            let user: User = {
                userId: response.user!.uid,
                name: response.user!.displayName,
                lastLogin: new Date(),
                entryHash: null,
                settings: {recordAllowed: true}
            };

            return Promise.resolve(user);
        }
        catch (error) {
            return Promise.reject("Couldn't login user");
        }
    }

    async logout(): Promise<void> {
        try {
            await this.firebaseAuth.signOut();
        }
        catch (error) {
            return Promise.reject('Error trying to log out user');
        }
    }

    async registerNewUser(email: string, password: string): Promise<boolean> {
        try {
            let response = await this.firebaseAuth.createUserWithEmailAndPassword(email, password);

            return Promise.resolve(response.user!.uid !== '');
        }
        catch (error) {
            return Promise.reject('Error attempting to register user. Please try again later')
        }
    }

    async loginWithGoogle() {

    }

    async getUserData(user: User): Promise<boolean> {
        try {
            let docRef = this.firebaseDB.collection('UserAccounts').doc(user.userId!);
            let doc = await docRef.get();
    
            let data = doc.data();
    
            if (data !== undefined)  {
                data!.lastOpen = new Date();
    
                docRef.update(data);

                user.lastLogin = data!.lastOpen;
                user.entryHash = data!.entryHash;
                user.settings = data!.settings;
    
                return Promise.resolve(true);
            }

            return Promise.resolve(false);
        } catch (error) {
            return Promise.reject(`GetUserData threw an error`);
        }
    }

    async getUserNotesFromDB(userId: string): Promise<CopyEntry[]> {
        let entries: CopyEntry[] = [];
        let collRef = this.firebaseDB.collection('Notes').doc(userId).collection('textEntries');
        
        let docsRef = await collRef.get()
        
        if (!docsRef.empty) {
            docsRef.forEach((doc) => {
                let entry = doc.data();
                let newEntry: CopyEntry = {
                    text: entry.text,
                    date: entry.date.toDate(),
                    url: entry.url,
                    id: doc.id
                };
             
                entries.push(newEntry);
            });
        }

        return Promise.resolve(entries);
    }

    async updateNeeded(userId: string, entriesHash: string): Promise<{updateNeed: boolean, newEntryHash?: string}> {
        try {
            let docRef = this.firebaseDB.collection("UserAccounts").doc(userId);

            let doc = await docRef.get();

            if (doc.exists) {
                const updateNeeded = doc.data()!.entriesHash !== entriesHash;
            
                return Promise.resolve({updateNeed: updateNeeded, newEntryHash: doc.data()!.entriesHash});
            }

            throw new Error('User does not have an account. Something is wrong');
        }
        catch(err) {
            throw err;
        }
    }

    async setEntryToDB(userId: string, textEntry: CopyEntry, hash: string): Promise<CopyEntry> {
        try {
            let docRef = this.firebaseDB.collection("Notes").doc(userId);
               
            let doc = await docRef.collection('textEntries').add({
                text: textEntry.text,
                date: textEntry.date,
                url: textEntry.url
            });

            let userRef = this.firebaseDB.collection("UserAccounts").doc(userId);
            await userRef.update({
                entryHash: hash
            });

            textEntry.id = doc.id;
            
            return textEntry;
        } catch (error) {
            throw error;
        }
    }

    async addToDB<T>(ref: string, docId: string | undefined, model: T) {
        let docRef = this.firebaseDB.collection(ref);

        if(docId === undefined) {
            await docRef.add(model);
        }
        else {
            await docRef.doc(docId).set(model);
        }
    }

    async updateRecordState(state: boolean, userId: string): Promise<void> {
        let docRef = this.firebaseDB.collection('UserAccounts').doc(userId);

        await docRef.update({
            settings: {
                recordAllowed: state
            }
        });
    }

    async removeEntry(userId: string, id: string) {
        let docRef = this.firebaseDB.collection('Notes').doc(userId).collection('textEntries').doc(id);

        await docRef.delete();
    }

    async updateHash(userId: string, hash: string) {
        let userRef = this.firebaseDB.collection('UserAccounts').doc(userId);

        await userRef.update({
            entryHash: hash
        });
    }
}

export default FirebaseService;