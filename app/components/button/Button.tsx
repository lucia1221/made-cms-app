import cx from "classnames";
import { LinksFunction } from "remix";

interface Props extends React.ComponentProps<"button"> {
    appearance: "primary" | "default" | "link";
}

export let links: LinksFunction = () => [
    { rel: "stylesheet", href: require("./Button.css") },
];

export const Button: React.FC<Props> = (props) => {
    let className = cx(props.className, `button-${props.appearance}`);

    return (
        <button {...props} className={className}>
            {props.children}
        </button>
    );
};
