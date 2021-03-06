import cx from "classnames";
import { AlertCircle } from "react-feather";
import { LinksFunction } from "remix";
import * as Text from "~/components/text";
import { useValidationError } from "~/hooks/useValidationError";

export interface CompositeFieldProps {
    name: string;
    block?: boolean;
    className?: string;
    style?: React.CSSProperties;
    label?: string;
}

export let links: LinksFunction = function () {
    return [
        { rel: "stylesheet", href: require("../Form.css") },
        ...Text.links(),
    ];
};

export let CompositeField: React.FC<CompositeFieldProps> = function (props) {
    let validationError = useValidationError(props.name);

    return (
        <div
            className={cx("form-field", props.className, {
                "form-field-block": props.block,
            })}
            style={props.style}
        >
            {props.label && (
                <Text.Text
                    as="label"
                    className="form-field-label"
                    size="md"
                    weight="bold"
                >
                    {props.label}
                </Text.Text>
            )}

            {props.children}

            {validationError ? (
                <Text.Text
                    as="span"
                    color="error"
                    className="form-field-error"
                    size="md"
                >
                    <AlertCircle size={16} className="leading-icon" />
                    {validationError.message}
                </Text.Text>
            ) : null}
        </div>
    );
};
