import { useValidationError } from "~/hooks/useValidationError";

interface Props {
  name: string;
  label?: string;
}

export const InputGroup: React.FC<Props> = function (props) {
  let validationError = useValidationError(props.name)

  return (
    <div className="input-group">
      {props.label ? <span className="input-label">{props.label}</span> : null}
      {props.children}
      {validationError ? <span>{validationError.message}</span> : null}
    </div>
  );
};
