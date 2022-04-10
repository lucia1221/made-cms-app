import { LinksFunction } from "remix";
export { Heading } from "./Heading";

export { Text } from "./Text";

export { Paragraph } from "./Paragraph";

export let links: LinksFunction = () => [
    { rel: "stylesheet", href: require("./Text.css") },
];
