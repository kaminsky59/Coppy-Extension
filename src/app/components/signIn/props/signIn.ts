import { RouteComponentProps } from "react-router";

export interface SignInProps extends RouteComponentProps{
    onLoggedIn: (auth: boolean) => void
}