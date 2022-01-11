import { Link, LoaderFunction, useLoaderData } from "remix";
import path from "path";
import fs from "fs/promises";

type Article = {
  id: number | string;
  title: string;
};

export const loader: LoaderFunction = async (): Promise<Article[]> => {
  const storagePath = path.resolve("storage", "articles");
  const filename = await fs.readdir(storagePath);

  return filename.map((filename): Article => {
    const [id, title] = filename.split("_");
    return { id: id, title: title.replace(".mdx", "") };
  });
};

export default function Index() {
  const articles = useLoaderData<Article[]>();

  return articles.map((a) => (
    <div key={a.id}>
      <Link to={`/article/${a.id}`}>{a.title}</Link>
    </div>
  ));
}
