import { TextInputField } from "evergreen-ui";
import { useValidationError } from "~/hooks/useValidationError";

interface Props extends React.ComponentProps<typeof TextInputField> {
  name: string;
}

export let TextInput: React.FC<Props> = function (props) {
  let validationError = useValidationError(props.name);

  return (
    <TextInputField {...props} validationMessage={validationError?.message} />
  );
};
