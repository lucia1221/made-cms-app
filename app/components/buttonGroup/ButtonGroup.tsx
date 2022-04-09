import cx from "classnames";
import { LinksFunction } from "remix";

interface Props {
    alignChildren?: React.CSSProperties["justifyContent"];
    className?: string;
}

export let links: LinksFunction = () => [
    { rel: "stylesheet", href: require("./ButtonGroup.css") },
];

export let ButtonGroup: React.FC<Props> = (props) => {
    return (
        <div
            className={cx("button-group", props.className)}
            style={{
                justifyContent: props.alignChildren,
            }}
        >
            {props.children}
        </div>
    );
};
