import { LinksFunction } from "remix";
import AvatarEditor from "react-avatar-editor";
import React, { createRef, useRef, useState } from "react";

interface Props {
    name: string;
}

export let links: LinksFunction = function () {
    return [{ rel: "stylesheet", href: require("./AvatarInput.css") }];
};

export let AvatarInput = React.forwardRef<AvatarEditor, Props>((props, ref) => {
    let [fileUrl, setFileUrl] = useState<string>();

    return (
        <>
            <label className="avatar-input">
                <input
                    type="file"
                    name={props.name}
                    accept="image/*"
                    onChange={(e) => {
                        let file = e.currentTarget.files?.item(0);
                        if (file) {
                            setFileUrl(URL.createObjectURL(file));
                        }
                    }}
                />
            </label>

            {fileUrl && (
                <AvatarEditor
                    ref={ref}
                    image={fileUrl}
                    width={250}
                    height={250}
                    border={50}
                    color={[255, 255, 255, 0.6]}
                    scale={1.2}
                    rotate={0}
                />
            )}
        </>
    );
});
