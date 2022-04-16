import cx from "classnames";
import { LinksFunction } from "remix";

export let links: LinksFunction = function () {
    return [{ rel: "stylesheet", href: require("./Card.css") }];
};

interface Props {
    padding?: "0" | "xs" | "sm" | "md" | "lg" | "xl";
}

export let Card: React.FC<Props> = function (props) {
    return (
        <div
            className={cx("card", {
                [`card-padding-${props.padding}`]: props.padding,
                "card-padding-0": props.padding === undefined,
            })}
        >
            {props.children}
        </div>
    );
};
