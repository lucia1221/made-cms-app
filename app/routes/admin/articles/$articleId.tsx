import { useParams } from "remix";

export default function ArticleRoute() {
  const params = useParams();

  return <div>Edit article {params.articleId}</div>;
}
