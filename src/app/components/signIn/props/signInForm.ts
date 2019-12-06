import { RouteComponentProps } from "react-router";
import { LoginDetails } from "../../../models/login/loginDetails";

export interface SignInFormProps extends RouteComponentProps{
    onLoginAttempt: (loginAttemp: LoginDetails) => void
}