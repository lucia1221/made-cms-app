import { LinksFunction } from "remix";
import { InputGroup } from "~/components";
import { TagInput } from "../../form/TagInput/TagInput";
import { Editor, EditorState } from "draft-js";
import { useState } from "react";


export const ArticleEditor: React.FC = () => {
  
  let [editorState, setEditorState]= useState(EditorState.createEmpty())
  console.log(editorState)
  return (
    <>
      <div className="editor-main">
        
        <Editor editorState={editorState} onChange={setEditorState} />
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


{/* <textarea name="content" placeholder="Post content" />? */}