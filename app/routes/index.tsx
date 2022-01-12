import { Link, LoaderFunction, useLoaderData } from "remix";
import { databaseService } from "~/services/databaseService";

type Article = {
  id: number | string;
  title: string;
  content: string;
};

export const loader: LoaderFunction = async function (): Promise<Article[]> {
  const response = await databaseService.from<Article>("articles").select();

  if (response.error !== null) {
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
