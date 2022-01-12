import { ActionFunction, Form } from "remix";
import { ArticleDraft } from "~/models/article";
import { databaseService } from "~/services/databaseService";

export const action: ActionFunction = async function ({ request }) {
  const form = await request.formData();

  const article: ArticleDraft = {
    title: form.get("title")?.toString() ?? "",
    content: form.get("content")?.toString() ?? "",
  };

try {
   const response = await databaseService.from("articles").insert(article)
   console.log(response)
} catch (error) {
    console.log(error)
}

  return null;
};

export default function AdminIndex() {
  return (
    <div>
      <Form method="post">
        <input type={"text"} name="title" placeholder="post title" />
        <input type={"text"} name="content" placeholder="post content" />
        <button type="submit">Create new post</button>
      </Form>
    </div>
  );
}
