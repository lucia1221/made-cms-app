import React from "react";

interface Props {
    height: number;
}

let RATIO = 200 / 40;

export let Logo: React.FC<Props> = function (props) {
    return (
        <div
            style={{
                background: "black",
                borderRadius: 4,
                height: props.height,
                width: RATIO * props.height,
            }}
        ></div>
    );
};
