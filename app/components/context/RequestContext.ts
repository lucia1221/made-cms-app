import React from "react";
import { ValidationError } from "yup";
import { SessionUser } from "~/models/user";

export interface RequestContextValue {
    validationError?: null | ValidationError;
    error?: any;
    session: SessionUser | null;
}

export const RequestContext = React.createContext<RequestContextValue>({
    validationError: null,
    session: null,
});
