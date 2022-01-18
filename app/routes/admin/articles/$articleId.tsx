import { LoaderFunction, useLoaderData } from "remix";
import { Article } from "~/models/article";
import { databaseService } from "~/services/databaseService";

export const loader: LoaderFunction = async function ({
  params,
}): Promise<any> {
  return databaseService()
    .from("articles")
    .select(`*, tags(*)`)
    .match({ id: params.articleId })
    .single();
};

export default function ArticleRoute() {
  const article = useLoaderData<any>();

  return <pre>{JSON.stringify(article.data, null, 4)}</pre>;
}
