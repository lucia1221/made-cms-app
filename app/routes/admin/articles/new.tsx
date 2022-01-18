import { ActionFunction, Form, LinksFunction, redirect } from "remix";
import { ArticleEditor, links as articleEditorLinks } from "~/components/admin";
import { Article } from "~/models/article";
import { databaseService } from "~/services/databaseService";

export const links: LinksFunction = function () {
  return [...articleEditorLinks()];
};

export const action: ActionFunction = async function ({ request }) {
  const form = await request.formData();

  let article: Partial<Article> = {
    title: form.get("title")?.toString() ?? "",
    content: form.get("content")?.toString() ?? "",
  };

  try {
    const response = await databaseService()
      .from<Article>("articles")
      .insert(article);

    if (response.data) {
      article = response.data[0];

      return redirect(`/admin/articles/${article.id}`);
    }
  } catch (error) {
    console.log(error);
  }

  return null;
};

export default function NewArticlesRoute() {
  return (
    <Form method="post">
      <ArticleEditor />
    </Form>
  );
}
