import { useParams } from "remix";

export default function ArticleRoute() {
  const params = useParams();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      Hello {params.articleId}
    </div>
  );
}
