import cx from "classnames";
import { LinksFunction } from "remix";

export let links: LinksFunction = function () {
    return [{ rel: "stylesheet", href: require("./Card.css") }];
};

type DivProps = JSX.IntrinsicElements["div"];

interface Props extends DivProps {
    padding: "0" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}

export let Card: React.FC<Props> = function ({ padding, ...props }) {
    return (
        <div
            {...props}
            className={cx(props.className, "card", `card-padding-${padding}`)}
        >
            {props.children}
        </div>
    );
};
