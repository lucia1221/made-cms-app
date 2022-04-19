import { LinksFunction, LoaderFunction, redirect, useLoaderData } from "remix";
import { ClientOnly } from "~/components";
import { ArticleEditor, links as articleEditorLinks } from "~/components/admin";
import { Article } from "~/models/article";
import { getSessionData } from "~/services/authService.server";
import { databaseService } from "~/services/databaseService.server";

export let links: LinksFunction = function () {
    return [...articleEditorLinks()];
};

export const loader: LoaderFunction = async function ({
    params,
}): Promise<Article | null> {
    if (params.articleId == "new") {
        return null;
    }

    let response = await databaseService()
        .from<Article>("articles")
        .select(`*, tags(*)`)
        .match({ id: params.articleId })
        .single();

    if (response.error != null) {
        throw new Error(response.error.message);
    }

    return response.data;
};

interface Params {
    articleId: number | "new";
}

interface Ctx {
    request: Request;
    params: Params;
}

export const action = async function ({ request, params }: Ctx) {
    const form = await request.formData();
    const author = getSessionData(request)!;

    const articleToSave: Partial<Article> = {
        title: form.get("title")?.toString() ?? "",
        content: form.get("content")?.toString() ?? "",
        authorId: author.id,
    };

    let saveOperationResult;

    if (params.articleId == "new") {
        saveOperationResult = await databaseService()
            .from<Article>("articles")
            .insert(articleToSave);
    } else {
        saveOperationResult = await databaseService()
            .from<Article>("articles")
            .update(articleToSave)
            .match({ id: params.articleId });
    }
    const articleId = saveOperationResult.data![0].id;

    //save tags
    // const tagsToSave: Partial<Tag>[] = form
    //   .getAll("tags[]")
    //   .map(function (tagName) {
    //     return { name: tagName as string };
    //   });
    // const tagsOperationResult = await databaseService()
    //   .from<Tag>("tags")
    //   .upsert(tagsToSave, {ignoreDuplicates:true, onConflict:"name"});

    // // save article and tags relations
    // const tags = tagsOperationResult.data!;
    // const tagsRealationsToSave: Partial<ArticleTag>[] = tags.map(function (tag) {
    //   return {
    //     article_id: articleId as number,
    //     tag_id: tag.id,
    //   };
    // });
    // await databaseService()
    //   .from<ArticleTag>("article_tag")
    //   .insert(tagsRealationsToSave);

    return redirect(`/admin/articles/${articleId}`);
};

export default function NewArticlesRoute() {
    let data = useLoaderData<Article | null>();
    return (
        <ClientOnly>
            <ArticleEditor data={data} />
        </ClientOnly>
    );
}
