import { ActionFunction, Form, redirect } from "remix";
import { Article } from "~/models/article";
import { databaseService } from "~/services/databaseService";

export const action: ActionFunction = async function ({ request }) {
  const form = await request.formData();

  let article: Partial<Article> = {
    title: form.get("title")?.toString() ?? "",
    content: form.get("content")?.toString() ?? "",
  };

  try {
    const response = await databaseService
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
      <input type={"text"} name="title" placeholder="post title" />
      <input type={"text"} name="content" placeholder="post content" />
      <button type="submit">Create new post</button>
    </Form>
  );
}
