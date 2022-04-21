import React, { useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { LinksFunction } from "remix";
import { Avatar } from "~/components/avatar/Avatar";

interface Props {
    name: string;
    src?: string | null;
    accept?: string;
    alt?: string;
}

export let links: LinksFunction = function () {
    return [{ rel: "stylesheet", href: require("./AvatarInput.css") }];
};

let WIDTH = 250;
let HEIGHT = 250;
let BORDER_WIDTH = 50;

export let AvatarInput = React.forwardRef<AvatarEditor, Props>((props, ref) => {
    let [fileUrl, setFileUrl] = useState<string>();

    return (
        <div
            className="avatar-input"
            style={{
                width: WIDTH,
                height: HEIGHT,
                padding: BORDER_WIDTH,
            }}
        >
            <input
                id={`${props.name}-avatar-input`}
                type="file"
                name={props.name}
                accept={props.accept ?? "image/*"}
                onChange={(e) => {
                    let file = e.currentTarget.files?.item(0);
                    if (file) {
                        setFileUrl(URL.createObjectURL(file));
                    }
                }}
            />
            {props.src && (
                <>
                    <Avatar alt={props.alt} imageUrl={props.src} size={WIDTH} />
                    <label
                        htmlFor={`${props.name}-avatar-input`}
                        className="change-discard-button"
                    >
                        change
                    </label>
                </>
            )}
            {fileUrl && (
                <>
                    <AvatarEditor
                        className="editor-component"
                        ref={ref}
                        image={fileUrl}
                        width={WIDTH}
                        height={HEIGHT}
                        border={BORDER_WIDTH}
                        borderRadius={WIDTH}
                        color={[255, 255, 255, 0.6]}
                        scale={1.2}
                        rotate={0}
                    />
                    <span
                        onClick={() => setFileUrl(undefined)}
                        className="change-discard-button"
                    >
                        discard
                    </span>
                </>
            )}
        </div>
    );
});
