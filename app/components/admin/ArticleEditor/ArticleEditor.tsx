import Editor from "@draft-js-plugins/editor";
import sideToolbarStyles from "@draft-js-plugins/side-toolbar/lib/plugin.css";
import draftJsStyles from "draft-js/dist/Draft.css";
import { createRef, useState } from "react";
import { Form, LinksFunction } from "remix";
import { InputGroup } from "~/components";
import { Article } from "~/models/article";
import { links as tagInputLinks, TagInput } from "../../form/TagInput/TagInput";
import editorStyles from "./article-editor.css";
import {
    getEditorState,
    getHtml,
    useKeyCommandHandler,
    usePlugins,
} from "./utils";

export let links: LinksFunction = function () {
    return [
        ...tagInputLinks(),
        { rel: "stylesheet", href: editorStyles },
        { rel: "stylesheet", href: draftJsStyles },
        { rel: "stylesheet", href: sideToolbarStyles },
    ];
};

interface Props {
    data: Article | null;
}

export const ArticleEditor: React.FunctionComponent<Props> = (props) => {
    console.log(props.data?.tags);

    let [editorState, setEditorState] = useState(() =>
        getEditorState(props.data?.content || ""),
    );

    function injectEditorStateToForm() {
        inputRef.current!.value = getHtml(editorState);
    }

    let inputRef = createRef<HTMLTextAreaElement>();
    let plugins = usePlugins();

    let tags = (props.data?.tags ?? []).map(function (tag) {
        return tag.name;
    });

    return (
        <Form
            className="editor"
            method="post"
            onSubmit={injectEditorStateToForm}
        >
            <div className="editor-main">
                <textarea
                    name="content"
                    ref={inputRef}
                    style={{ display: "none" }}
                />
                <Editor
                    editorKey="new-article-editor"
                    editorState={editorState}
                    onChange={setEditorState}
                    handleKeyCommand={useKeyCommandHandler(setEditorState)}
                    placeholder="Tell your story..."
                    plugins={plugins.plugins}
                />
                <plugins.SideToolbar />
            </div>
            <div className="editor-sidebar">
                <InputGroup label="Title">
                    <input
                        type="text"
                        name="title"
                        placeholder="Post title"
                        defaultValue={props.data?.title}
                    />
                </InputGroup>
                <InputGroup>
                    <TagInput
                        name="tags"
                        type="text"
                        placeholder="Add a tag"
                        defaultValue={tags}
                    />
                </InputGroup>
                <InputGroup>
                    <button type="submit">
                        {props.data == null
                            ? "Create new post"
                            : "Save changes"}
                    </button>
                </InputGroup>
            </div>
        </Form>
    );
};
