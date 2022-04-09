import React from "react";
import { HeadingProps, Text } from "../text";

export { links } from "../text";

interface Props extends Omit<HeadingProps, "as"> {
    level: HeadingProps["as"];
}

export let Heading: React.FC<Props> = ({ level, ...props }) => {
    return <Text as={level} {...props} />;
};
