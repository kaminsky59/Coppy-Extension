export interface MessageCallback {
    callbacks: {(response: any): void}[];
}