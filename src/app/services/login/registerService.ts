import { StateService } from "../state/stateService";
import FirebaseService from "../firebase/firebaseService";
import { RegisterDetails } from "../../models/register/RegisterDetails";

class RegisterService {
    private firebase: FirebaseService;

    constructor() {
        this.firebase = FirebaseService.Instance;
    }

    async registerUser(registerDetails: RegisterDetails): Promise<void> {
        try {
            let validResistration = await this.firebase.registerNewUser(registerDetails.email, registerDetails.password);

            // TODO: Log an error when user has an issue registering

            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export default RegisterService;