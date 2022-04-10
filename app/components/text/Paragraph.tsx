import React from "react";
import { ParagraphProps, Text } from "../text";
export { links } from "../text";

interface Props extends Omit<ParagraphProps, "as"> {}

export let Paragraph: React.FC<Props> = (props) => {
    return <Text as="p" {...props} />;
};
