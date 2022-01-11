import { Link, LoaderFunction, useLoaderData } from "remix";
import path from "path";
import fs from "fs/promises";

type Article = {
  id: number | string;
  title: string;
};

export const loader: LoaderFunction = (): Promise<Article[]> => {
  const storagePath = path.resolve("storage", "articles");

  return fs.readdir(storagePath).then((filenames) => {
    return filenames.map((filename) => {
      const [id, title] = filename.split("_");
      return { id: id, title: title.replace(".mdx", "") };
    });
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
