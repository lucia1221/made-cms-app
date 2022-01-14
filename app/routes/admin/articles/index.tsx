import {
  ActionFunction,
  Form,
  Link,
  LoaderFunction,
  useLoaderData,
} from "remix";
import { Article } from "~/models/article";
import { databaseService } from "~/services/databaseService";

export const loader: LoaderFunction = async function (): Promise<Article[]> {
  const response = await databaseService
    .from<Article>("articles")
    .select("id, title");

  if (response.error) {
    return [];
  }

  return response.data;
};
export const action: ActionFunction = async function ({ request }) {
  switch (request.method) {
    case "DELETE":
      const form = await request.formData();

      await databaseService
        .from("articles")
        .delete()
        .match({ id: form.get("id") });
      break;
  }

  return null;
};

export default function AdminArticleListing() {
  const articles = useLoaderData<Article[]>();
  function confirmDelete(event: any) {
    if (window.confirm("Are you sure?") !== true) {
      event.preventDefault();
    }
  }

  return articles.map((a) => (
    <Form method="delete" key={a.id}>
      <input defaultValue={a.id} name="id" type="hidden"></input>
      {a.title}
      <Link to={`/admin/articles/${a.id}`}>Edit</Link>
      <button type="submit" onClick={confirmDelete}>
        Delete
      </button>
    </Form>
  ));
}
