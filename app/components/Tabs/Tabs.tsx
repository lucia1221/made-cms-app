import cx from "classnames";
import { LinksFunction, NavLinkProps } from "remix";

export let links: LinksFunction = function () {
    return [{ rel: "stylesheet", href: require("./Tabs.css") }];
};

interface Props {
    children: React.ReactElement<NavLinkProps>[];
}

export let Tabs: React.FC<Props> = function (props) {
    return <div className="tabs">{props.children}</div>;
};
