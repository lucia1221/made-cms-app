import React from "react";

type ImgProps = JSX.IntrinsicElements["div"];

interface Props extends ImgProps {
    height: number;
}

let RATIO = 200 / 40;

export let Logo: React.FC<Props> = function (props) {
    return (
        <div
            className={props.className}
            style={{
                height: props.height,
                width: RATIO * props.height,
            }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 180 45"
                height={props.height}
                style={{ mixBlendMode: "darken" }}
            >
                <symbol id="m">
                    <path d="M12.35-.004h15.222L15.368 45H.147z" />
                    <path d="M16.054 0h11.519l7.09 32.398H23.146zM48.36-.004h15.22L51.378 45H36.156z" />
                    <path d="M59.877-.006H48.358L23.143 32.39h11.519z" />
                </symbol>
                <g id="logo">
                    <use x="2.5" fill="#0ff" href="#m" />
                    <use
                        fill="red"
                        href="#m"
                        style={{ mixBlendMode: "darken" }}
                    />
                </g>
                <text
                    x="65"
                    y="29"
                    style={{
                        fontFamily: "Montserrat",
                        fontSize: 40,
                        fontWeight: 700,
                        fontStyle: "italic",
                    }}
                    fill="#00ffff"
                >
                    blog
                </text>
            </svg>
        </div>
    );
};
