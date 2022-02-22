import {
  ActionFunction,
  Form,
  json,
  Link,
  LoaderFunction,
  useLoaderData,
} from "remix";
import { Article } from "~/models/article";
import { databaseService } from "~/services/databaseService";
import { getRange } from "~/utils/paging";
export { CatchBoundary } from "~/components/CatchBoundary";

interface LoaderData {
  articles: Article[];
  previousPageUrl: string | null;
  nextPageUrl: string | null;
}

export const loader: LoaderFunction = async function ({
  request,
}): Promise<LoaderData> {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? 1);
  const itemsPerPage = 10;
  const range = getRange(page, itemsPerPage);

  const response = await databaseService()
    .from<Article>("articles")
    .select(
      `
      id, title,
      tags ( id, name )
    `,
      { count: "exact" },
    )
    .order("id", { ascending: false })
    .range(range.from, range.to);

  let previousPageUrl = null;
  let nextPageUrl = null;

  if (response.error) {
    throw json(response.error, response);
  }

  if (page > 1) {
    url.searchParams.set("page", (page - 1).toString());
    previousPageUrl = `${url.pathname}?${url.searchParams}`;
  }

  if (page * itemsPerPage < response.count!) {
    url.searchParams.set("page", (page + 1).toString());
    nextPageUrl = `${url.pathname}?${url.searchParams}`;
  }

  return {
    articles: response.error ? [] : response.data,
    previousPageUrl: previousPageUrl,
    nextPageUrl: nextPageUrl,
  };
};

export const action: ActionFunction = async function ({ request }) {
  switch (request.method) {
    case "DELETE":
      const form = await request.formData();

      await databaseService()
        .from("articles")
        .delete()
        .match({ id: form.get("id") });
      break;
  }

  return null;
};

export default function AdminArticleListing() {
  const data = useLoaderData<LoaderData>();
  function confirmDelete(event: React.FormEvent<HTMLFormElement>) {
    if (window.confirm("Are you sure?") === false) {
      event.preventDefault();
    }
  }

  return (
    <>
      <Link to={"/admin/articles/new"}>write new article</Link>
      {data.articles.map((article) => (
        <Form key={article.id} method="delete" onSubmit={confirmDelete}>
          <input defaultValue={article.id} name="id" type="hidden"></input>
          {article.id},{article.title}
          <Link to={`/admin/articles/${article.id}`}>Edit</Link>
          <button type="submit">Delete</button>
        </Form>
      ))}
      {data.previousPageUrl && (
        <Link to={data.previousPageUrl}>previous page</Link>
      )}
      {data.nextPageUrl && <Link to={data.nextPageUrl}>next page</Link>}
    </>
  );
}
