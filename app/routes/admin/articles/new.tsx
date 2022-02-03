import { ActionFunction, LinksFunction, redirect, useFetcher } from "remix";
import { ClientOnly } from "~/components";
import { ArticleEditor, links as articleEditorLinks } from "~/components/admin";
import { Article } from "~/models/article";
import { ArticleTag } from "~/models/article_tag";
import { Tag } from "~/models/tag";
import { databaseService } from "~/services/databaseService";

export let links: LinksFunction = function () {
  return [...articleEditorLinks()];
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
  let fetcher = useFetcher();
  return (
    <ClientOnly>
      <ArticleEditor />
    </ClientOnly>
  );
}
