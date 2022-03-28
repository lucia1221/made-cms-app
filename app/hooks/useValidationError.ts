import { useContext } from "react";
import { ValidationError } from "yup";
import { RequestContext } from "~/components/context";

export function useValidationError(name: string): undefined | ValidationError {
  let requestContext = useContext(RequestContext);

  if (ValidationError.isError(requestContext.error)) {
    return findValidationError(name, requestContext.error);
  }
  
  return requestContext.validationError
    ? findValidationError(name, requestContext.validationError)
    : undefined;
}

function findValidationError(
  path: string,
  error: ValidationError,
): undefined | ValidationError {
  if (error.path === path) {
    return error;
  }

  return error.inner.find((e) => e.path === path);
}
