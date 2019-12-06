import { MessageListeners } from "./messageListeners";
import { MessageCallback } from "./messageCallback";
import { MessageSend } from "./messageSend";
import { promises } from "dns";
import { User } from "../../models/shared/user";

export class BrowserService {
    private listeners: MessageListeners = {};
    
    constructor(){
    }

    addListener(action: string, listenr: (response: any) => void): void {
        if(this.listeners[action] === undefined) {
            let browserCallback: MessageCallback = {
                callbacks: [listenr]
            };

            this.listeners[action] = browserCallback;
            
        } else {
            this.listeners[action].callbacks.push(listenr);
        }

        chrome.runtime.onMessage.addListener((message, sender, sendRepsonse) => {
            if (message.action === 'copy') {
                switch (message.type) {
                    case 'text':
                        this.runListeners(this.listeners[message.action], message.textCopied);
                        // this.sendMessage('copy', 'dashboard', message.textCopied);
                        break;
                    default:
                        break;
                }
            }
        });
    };

    getTabUrl(): Promise<string> {
        return new Promise((resolve) => {
            chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
                console.log(tabs[0].url);
                resolve(tabs[0].url);
            });
        });
    }

    private sendMessage(action: string, destination: string, message: MessageSend): void {
        chrome.runtime.sendMessage({
            action: action,
            message: message,
            destination: destination
        });
    };

    private runListeners(browser: MessageCallback, text: string): void {
        browser.callbacks.forEach((callback) => {
            callback(text);
        });
    }
}