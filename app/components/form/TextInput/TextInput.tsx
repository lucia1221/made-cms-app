import { LinksFunction } from "remix";
import {
    CompositeField,
    CompositeFieldProps,
    links as compositeFieldLinks,
} from "../CompositeField/CompositeField";

interface Props extends React.ComponentProps<"input">, CompositeFieldProps {
    name: string;
}

export let links: LinksFunction = function () {
    return [
        { rel: "stylesheet", href: require("../Form.css") },
        { rel: "stylesheet", href: require("./TextInput.css") },
        ...compositeFieldLinks(),
    ];
};

export let TextInput: React.FC<Props> = function ({
    block,
    className,
    label,
    name,
    ...props
}) {
    return (
        <CompositeField name={name} label={label} block={block}>
            <input {...props} name={name} className="form-field-input" />
        </CompositeField>
    );
};
