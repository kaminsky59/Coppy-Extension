import { MessageCallback } from "./messageCallback";

export interface MessageListeners {
    [action: string]: MessageCallback
}