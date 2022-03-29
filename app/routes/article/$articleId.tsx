import { useParams } from "remix";

export default function ArticleRoute() {
    const params = useParams();

    return <div>Hello {params.articleId}</div>;
}
