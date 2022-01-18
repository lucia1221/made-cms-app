import { Link, LoaderFunction, useLoaderData } from "remix";
import { Article } from "~/models/article";
import { databaseService } from "~/services/databaseService";

export const loader: LoaderFunction = async function (): Promise<Article[]> {
  const response = await databaseService()
    .from<Article>("articles")
    .select("id, title");

  if (response.error) {
    return [];
  }

  return response.data;
};

export default function Index() {
  const articles = useLoaderData<Article[]>();

  return articles.map((a) => (
    <div key={a.id}>
      <Link to={`/article/${a.id}`}>{a.title}</Link>
    </div>
  ));
}
