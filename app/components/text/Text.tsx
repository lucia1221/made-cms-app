import cx from "classnames";
import React from "react";

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

interface LabelProps extends React.ComponentProps<"label"> {
    as: "label";
}

type Props = SpanProps | ParagraphProps | HeadingProps | LabelProps;

type SharedProps = {
    size?: "3xl" | "2xl" | "xl" | "lg" | "base" | "md" | "sm";
    color?: "error";
    weight?: "light" | "normal" | "bold";
};

export let Text: React.FC<Props & SharedProps> = ({
    as,
    size,
    color,
    weight,
    ...props
}) => {
    return React.createElement(as, {
        ...props,
        className: cx(props.className, {
            [`text-${size}`]: size,
            [`color-${color}`]: color,
            [`weight-${weight}`]: weight,
        }),
    });
};
