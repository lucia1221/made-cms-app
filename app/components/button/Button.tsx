import cx from "classnames";
import { LinksFunction } from "remix";

interface Props extends React.ComponentProps<"button"> {
    appearance: "primary" | "default" | "link";
    block?: boolean;
}

export let links: LinksFunction = () => [
    { rel: "stylesheet", href: require("./Button.css") },
];

export const Button: React.FC<Props> = ({ appearance, block, ...props }) => {
    let className = cx(props.className, `button-${appearance}`, {
        "button-block": block,
    });

    return (
        <button {...props} className={className}>
            {props.children}
        </button>
    );
};
