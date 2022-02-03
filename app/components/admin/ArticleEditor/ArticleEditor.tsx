import Editor from "@draft-js-plugins/editor";
import sideToolbarStyles from "@draft-js-plugins/side-toolbar/lib/plugin.css";
import draftJsStyles from "draft-js/dist/Draft.css";
import { createRef, useState } from "react";
import { Form, LinksFunction } from "remix";
import { InputGroup } from "~/components";
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

export const ArticleEditor: React.FunctionComponent = () => {
  let [editorState, setEditorState] = useState(() =>
    getEditorState("<b>aaa</b>"),
  );

  function injectEditorStateToForm() {
    inputRef.current!.value = getHtml(editorState);
  }

  let inputRef = createRef<HTMLTextAreaElement>();
  let plugins = usePlugins();

  return (
    <Form className="editor" method="post" onSubmit={injectEditorStateToForm}>
      <div className="editor-main">
        <textarea name="content" ref={inputRef} style={{ display: "none" }} />
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
          <input type="text" name="title" placeholder="Post title" />
        </InputGroup>
        <InputGroup>
          <TagInput name="tags" type="text" placeholder="Add a tag" />
        </InputGroup>
        <InputGroup>
          <button type="submit">Create new post</button>
        </InputGroup>
      </div>
    </Form>
  );
};
