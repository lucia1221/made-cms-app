import { User } from "react-feather";
import { LinksFunction } from "remix";

interface Props {
    size: number;
    imageUrl?: string | null;
    alt?: string;
}

const colors = [
    "#dc8665",
    "#e8a39c",
    "#7dd6f6",
    "#0d0944",
    "#215273",
    "#9f8189",
    "#061c89",
    "#2c6974",
    "#6bac9d",
    "#4a7079",
    "#37bbca",
    "#004d9a",
    "#47cacc",
];

export let links: LinksFunction = function () {
    return [{ rel: "stylesheet", href: require("./Avatar.css") }];
};

export let Avatar: React.FC<Props> = function (props) {
    const sizeStyle: React.CSSProperties = {
        width: props.size,
        height: props.size,
    };

    if (props.imageUrl) {
        return (
            <div
                className="avatar"
                style={{
                    backgroundImage: `url("${props.imageUrl}")`,
                    ...sizeStyle,
                }}
            />
        );
    }

    if (props.alt) {
        let letter = props.alt[0].toUpperCase();
        let code = letter.charCodeAt(0) - 64;

        return (
            <div
                className="avatar"
                style={{
                    backgroundColor: colors[(code % colors.length) - 1],
                    ...sizeStyle,
                }}
            >
                <span
                    className="avatar-alt"
                    style={{ fontSize: props.size / 2 }}
                >
                    {letter}
                </span>
            </div>
        );
    }

    return (
        <div
            className="avatar"
            style={{
                backgroundColor: colors[0],
                ...sizeStyle,
            }}
        >
            <User size={props.size / 2} color="white" />
        </div>
    );
};
