import { LinksFunction } from "remix";
import { InputGroup } from "~/components";
import { links as tagInputLinks, TagInput } from "../../form/TagInput/TagInput";
import editorStyles from "./article-editor.css";

export const links: LinksFunction = function () {
  return [{ rel: "stylesheet", href: editorStyles }, ...tagInputLinks()];
};

export const ArticleEditor: React.FC = () => {
  return (
    <>
      <div className="editor-main">
        <textarea name="content" placeholder="Post content" />
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
