import React from "react";
import { ValidationError } from "yup";
import { RequestResponse } from "~/models/RequestResponse";

export interface RequestContextValue {
    validationError?: null | ValidationError;
    error?: any;
}

export const RequestContext = React.createContext<RequestContextValue>({
    validationError: null,
});
