import { AlertCircle, CheckCircle, Info, XOctagon } from "react-feather";
import { LinksFunction } from "remix";
import styles from "./Alert.css";

interface Props {
  type: "success" | "error" | "warning" | "info";
  style?: React.CSSProperties;
}

export let links: LinksFunction = function () {
  return [{ rel: "stylesheet", href: styles }];
};

export let Alert: React.FC<Props> = function (props) {
  let icon: React.ReactNode;

  switch (props.type) {
    case "success":
      icon = <CheckCircle size={24} />;
      break;
    case "error":
      icon = <AlertCircle size={24} />;
      break;
    case "warning":
      icon = <XOctagon size={24} />;
      break;

    default:
      icon = <Info size={24} />;
      break;
  }

  return (
    <div className={`alert alert-${props.type}`} style={props.style}>
      {icon}
      {props.children}
    </div>
  );
};
