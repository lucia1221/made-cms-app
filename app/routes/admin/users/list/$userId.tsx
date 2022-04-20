import {
    json,
    LinksFunction,
    LoaderFunction,
    NavLink,
    useLoaderData,
    useParams,
} from "remix";
import { Article } from "~/models/article";
import { User } from "~/models/user";
import format from "date-fns/format";
import { databaseService } from "~/services/databaseService.server";

import { CatchBoundary as RootCatchBoundary } from "~/components/CatchBoundary";
import * as text from "~/components/text";
import { Avatar, links as avatarLinks } from "~/components/avatar";
import { Users } from "react-feather";

export let links: LinksFunction = function () {
    return [
        { rel: "stylesheet", href: require("./$userId.css") },
        ...avatarLinks(),
    ];
};

interface LoaderData {
    user: User;
    lastFiveArticles: Article[];
}

export let loader: LoaderFunction = async function ({
    params,
}): Promise<LoaderData> {
    console.log(params);
    let user = await databaseService()
        .from<User>("users")
        .select()
        .match({ id: params.userId })
        .single();
    let lastFiveArticles = await databaseService()
        .from<Article>("articles")
        .select("id, title, createdAt")
        .is("deletedAt", null)
        .order("createdAt", { ascending: false })
        .match({ authorId: params.userId })
        .limit(5);

    if (user.error || lastFiveArticles.error) {
        throw json(user.error ?? lastFiveArticles.error, 400);
    }

    return { user: user.data, lastFiveArticles: lastFiveArticles.data };
};

export default function UserProfileRoute() {
    let data = useLoaderData<LoaderData>();
    let fullName = `${data.user.firstName} ${data.user.lastName}`;
    return (
        <div className="user-detail">
            <div className="header">
                <Avatar size={100} alt={fullName}></Avatar>
                <text.Heading level={"h1"}>{fullName}</text.Heading>
                <text.Paragraph>{data.user.email}</text.Paragraph>
            </div>

            {data.lastFiveArticles.map(function (article) {
                return (
                    <div key={article.id}>
                        <span className="title">{article.title}</span>
                        <span className="date">
                            Published at{" "}
                            {new Date(article.createdAt).toLocaleString()}
                        </span>
                    </div>
                );
            })}
            {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        </div>
    );
}

export function CatchBoundary() {
    return (
        <div className="user-detail">
            <RootCatchBoundary />
        </div>
    );
}
