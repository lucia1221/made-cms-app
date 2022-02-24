import { useContext } from "react";
import { ValidationError } from "yup";
import { RequestContext } from "~/components/context";

interface Props {
  name: string;
  label?: string;
}

export const InputGroup: React.FC<Props> = function (props) {
  let requestContext = useContext(RequestContext);

  let validationError = requestContext.validationError
    ? findValidationError(props.name, requestContext.validationError)
    : null;

  return (
    <div className="input-group">
      {props.label ? <span className="input-label">{props.label}</span> : null}
      {props.children}
      {validationError ? <span>{validationError.message}</span> : null}
    </div>
  );
};

function findValidationError(
  path: string,
  error: ValidationError,
): null | ValidationError {
  if (error.path === path) {
    return error;
  }

  return error.inner.find((e) => e.path === path) ?? null;
}
