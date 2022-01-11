import { Link, LoaderFunction, useLoaderData } from "remix";

type Article = {
  id: number;
  title: string;
};

export const loader: LoaderFunction = (): Article[] => {
  return [
    { id: 1, title: "slovaci vyhrali" },
    { id: 2, title: "slovaci prehrali" },
  ];
};

export default function Index() {
  const articles = useLoaderData<Article[]>();

  return articles.map((a) => (
    <div key={a.id}>
      <Link to={`/article/${a.id}`}>{a.title}</Link>
    </div>
  ));
}
