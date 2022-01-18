import { LinksFunction } from "remix";
import { InputGroup } from "~/components";
import { links as tagInputLinks, TagInput } from "../../form/TagInput/TagInput";
import editorStyles from "./article-editor.css";

export const links: LinksFunction = function () {
  return [{ rel: "stylesheet", href: editorStyles }, ...tagInputLinks()];
};

export const ArticleEditor: React.FC = () => {
  return (
    <div className="article-editor">
      <div className="content">
        <InputGroup label="Content">
          <input type="text" name="content" placeholder="Post content" />
        </InputGroup>
      </div>
      <div className="meta">
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
    </div>
  );
};
