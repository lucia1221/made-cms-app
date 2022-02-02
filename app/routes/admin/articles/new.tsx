import { ActionFunction, Form, LinksFunction, redirect } from "remix";
import { ArticleEditor } from "~/components/admin";
import editorStyles from "~/components/admin/ArticleEditor/article-editor.css";
import { links as tagInputLinks } from "~/components/form/TagInput/TagInput";
import { Article } from "~/models/article";
import { ArticleTag } from "~/models/article_tag";
import { Tag } from "~/models/tag";
import { databaseService } from "~/services/databaseService";

export const links: LinksFunction = function () {
  return [...tagInputLinks(), { rel: "stylesheet", href: editorStyles }];
};

export const action: ActionFunction = async function ({ request }) {
  const form = await request.formData();
  //save tags
  const tagsToSave: Partial<Tag>[] = form
    .getAll("tags[]")
    .map(function (tagName) {
      return { name: tagName as string };
    });
  const tagsOperationResult = await databaseService()
    .from<Tag>("tags")
    .insert(tagsToSave);

  // save article
  const articleToSave: Partial<Article> = {
    title: form.get("title")?.toString() ?? "",
    content: form.get("content")?.toString() ?? "",
  };

  const articleOperationResult = await databaseService()
    .from<Article>("articles")
    .insert(articleToSave);

  // save article and tags relations
  const articleId = articleOperationResult.data![0].id;
  const tags = tagsOperationResult.data!;
  const tagsRealationsToSave: Partial<ArticleTag>[] = tags.map(function (tag) {
    return {
      article_id: articleId as number,
      tag_id: tag.id,
    };
  });
  await databaseService()
    .from<ArticleTag>("article_tag")
    .insert(tagsRealationsToSave);

  return redirect(`/admin/articles/${articleId}`);
};

export default function NewArticlesRoute() {
  return (
    <Form className="editor" method="post">
      <ArticleEditor />
    </Form>
  );
}
