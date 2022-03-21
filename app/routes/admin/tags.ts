import { json, LoaderFunction } from "remix";
import { Tag } from "~/models/tag";
import { databaseService } from "~/services/databaseService.server";

export const loader: LoaderFunction = async function ({ request }) {
  const url = new URL(request.url);
  const search = (url.searchParams.get("search") ?? "").trim();

  if (search.length === 0) {
    return json([], 200);
  }

  const response = await databaseService()
    .from<Tag>("tags")
    .select("id, name")
    .ilike("name", `%${search}%`);

  return json(
    response.data ?? response.error,
    response.error === null ? 200 : 500,
  );
};
