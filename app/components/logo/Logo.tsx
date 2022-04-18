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
                background: "black",
                borderRadius: 4,
                height: props.height,
                width: RATIO * props.height,
            }}
        ></div>
    );
};
