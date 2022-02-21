import { DataFunctionArgs } from "@remix-run/server-runtime";
import {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
  redirect,
  useFetcher,
  useLoaderData,
} from "remix";
import { ClientOnly } from "~/components";
import { ArticleEditor, links as articleEditorLinks } from "~/components/admin";
import { Article } from "~/models/article";
import { ArticleTag } from "~/models/article_tag";
import { Tag } from "~/models/tag";
import { databaseService } from "~/services/databaseService";

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

  const articleToSave: Partial<Article> = {
    title: form.get("title")?.toString() ?? "",
    content: form.get("content")?.toString() ?? "",
  };

  let saveOperationResult;

  if (params.articleId == "new") {
    // let createOperationResult = await databaseService()
    saveOperationResult = await databaseService()
      .from<Article>("articles")
      .insert(articleToSave);
  } else {
    // let updateOperationResult = await databaseService()
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
