import cx from "classnames";
import React from "react";
import { LinksFunction } from "remix";

interface SpanProps extends React.ComponentProps<"span"> {
    as: "span";
}

export interface ParagraphProps extends React.ComponentProps<"p"> {
    as: "p";
}

export interface HeadingProps
    extends React.ComponentProps<`h${1 | 2 | 3 | 4 | 5 | 6}`> {
    as: `h${1 | 2 | 3 | 4 | 5 | 6}`;
}

type Props = SpanProps | ParagraphProps | HeadingProps;

type SharedProps = {
    size?: "3xl" | "2xl" | "xl" | "lg" | "base" | "md" | "sm";
};

export let links: LinksFunction = () => [
    { rel: "stylesheet", href: require("./Text.css") },
];

export let Text: React.FC<Props & SharedProps> = ({ as, size, ...props }) => {
    return React.createElement(as, {
        ...props,
        className: cx(props.className, { [`text-${size}`]: size }),
    });
};
