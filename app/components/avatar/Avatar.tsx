import { User } from "react-feather";
import { InputGroup } from "..";

interface Props {
  size: number;
  imageUrl?: string;
}

export let Avatar: React.FC<Props> = function (props) {
  if (props.imageUrl) {
    return (
      <div
        className="avatar"
        style={{
          backgroundImage: `url("${props.imageUrl}")`,
          width: props.size,
          height: props.size,
        }}
      ></div>
    );
  }
  return <User size={props.size}></User>;
};
