import { LoaderFunction } from "remix";
import { AuthController } from "~/controllers/admin/AuthController";

export let loader: LoaderFunction = function ({ request }) {
    let controller = new AuthController();

    return controller.logoutUser("/admin");
};
