export interface TransactionalEmail {
    id: string;
    email: string;
    template: string;
    token: string;
    claimedAt: null | Date
}
