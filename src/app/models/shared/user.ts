export interface User {
    userId: string | null;
    name: string | null;
    lastLogin: Date | null;
    entryHash: string | null;
    settings: {
        recordAllowed: boolean
    };
}