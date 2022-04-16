import { LinksFunction, LoaderFunction, Outlet, redirect } from "remix";
import { Sidebar } from "~/components/admin";
import { isRequestAuthenticated } from "~/services/authService.server";

export const AUTH_ROUTES = {
    login: "/admin/auth/login",
    logout: "/admin/auth/logout",
    register: "/register",
    passwordReset: "/admin/auth/password-reset",
};

const DEFAULT_ROUTE = "/admin/articles";

export const links: LinksFunction = function () {
    return [{ rel: "stylesheet", href: require("./admin.css") }];
};

export const loader: LoaderFunction = async function ({ request }) {
    const url = new URL(request.url);
    const isAuthRoute = Object.values(AUTH_ROUTES).some((route) =>
        request.url.startsWith(route),
    );

    if (isAuthRoute === false && isRequestAuthenticated(request) === false) {
        url.pathname = AUTH_ROUTES.login;
        url.searchParams.set("redirectTo", request.url);
        console.log("redirect");

        return redirect(url.toString());
    }

    if (url.pathname.replace(/\/$/, "") === "/admin") {
        return redirect(DEFAULT_ROUTE);
    }

    return null;
};

export default function AdminRoute() {
    return (
        <div className="container">
            <div className="sidebar">
                <Sidebar></Sidebar>
            </div>
            <div className="main">
                <Outlet></Outlet>
            </div>
        </div>
    );
}
