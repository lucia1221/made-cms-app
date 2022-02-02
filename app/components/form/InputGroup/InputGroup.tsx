interface Props {
  label?: string;
}

export const InputGroup: React.FC<Props> = function (props) {
  return <div className="input-group">{props.children}</div>;
};
