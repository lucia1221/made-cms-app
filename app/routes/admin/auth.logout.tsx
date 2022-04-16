import { LoaderFunction } from "remix";
import { AuthController } from "~/controllers/admin/AuthController";

export let loader: LoaderFunction = function ({ request }) {
    let controller = new AuthController();
    const url = new URL(request.url);
    url.pathname = "/admin";

    return controller.logoutUser(url.toString());
};
