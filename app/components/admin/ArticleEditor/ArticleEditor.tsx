import Editor, { createEditorStateWithText } from "@draft-js-plugins/editor";
import createSideToolbarPlugin from "@draft-js-plugins/side-toolbar";
import sideToolbarStyles from "@draft-js-plugins/side-toolbar/lib/plugin.css";
import { DraftHandleValue, EditorState, RichUtils } from "draft-js";
import createBlockBreakoutPlugin from "draft-js-block-breakout-plugin";
import draftJsStyles from "draft-js/dist/Draft.css";
import { useCallback, useState } from "react";
import { LinksFunction } from "remix";
import { InputGroup } from "~/components";
import { links as tagInputLinks, TagInput } from "../../form/TagInput/TagInput";
import editorStyles from "./article-editor.css";

export let links: LinksFunction = function () {
  return [
    ...tagInputLinks(),
    { rel: "stylesheet", href: editorStyles },
    { rel: "stylesheet", href: draftJsStyles },
    { rel: "stylesheet", href: sideToolbarStyles },
  ];
};

const sideToolbarPlugin = createSideToolbarPlugin();
const blockBreakoutPlugin = createBlockBreakoutPlugin();
const plugins = [sideToolbarPlugin, blockBreakoutPlugin];

export const ArticleEditor: React.FC = () => {
  let [editorState, setEditorState] = useState(() =>
    createEditorStateWithText(""),
  );

  let handleKeyCommand = useCallback(function (
    command: string,
    editorState: EditorState,
  ): DraftHandleValue {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }

    return "not-handled";
  },
  []);

  return (
    <>
      <div className="editor-main">
        <Editor
          editorKey="new-article-editor"
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={handleKeyCommand}
          placeholder="Tell your story..."
          plugins={plugins}
        />
        <sideToolbarPlugin.SideToolbar />
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
    </>
  );
};
