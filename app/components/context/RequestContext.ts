import React from "react";
import { ValidationError } from "yup";

export interface RequestContextValue {
  validationError: null | ValidationError;
}

export const RequestContext = React.createContext<RequestContextValue>({
  validationError: null,
});
