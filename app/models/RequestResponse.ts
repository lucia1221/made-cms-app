export interface ErrorRequestResponse<T> {
    data: null;
    error: T;
}

export interface SuccessRequestResponse<T> {
    data: T;
    error: null;
}

export type RequestResponse<V = unknown, E = unknown> =
    | SuccessRequestResponse<V>
    | ErrorRequestResponse<E>;
