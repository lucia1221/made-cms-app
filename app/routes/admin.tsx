import {
    json,
    LinksFunction,
    LoaderFunction,
    Outlet,
    redirect,
    useLoaderData,
} from "remix";
import { Sidebar, links as sidebarLinks } from "~/components/admin/sidebar";
import { RequestContext } from "~/components/context";
import { SessionUser } from "~/models/user";
import { getSessionData } from "~/services/authService.server";

export const AUTH_ROUTES = {
    login: "/admin/auth/login",
    logout: "/admin/auth/logout",
    register: "/admin/auth/register",
    passwordResetEmail: "/admin/auth/password-reset",
    updatePassword: "/admin/auth/update-password",
};

interface LoaderData {
    isAuthRoute: boolean;
    sessionData: null | SessionUser;
}

const DEFAULT_ROUTE = "/admin/articles";

export const links: LinksFunction = function () {
    return [
        { rel: "stylesheet", href: require("./admin.css") },
        ...sidebarLinks(),
    ];
};

export const loader: LoaderFunction = function ({ request }): Response {
    const url = new URL(request.url);
    const isAuthRoute = url.pathname.startsWith("/admin/auth");
    const sessionData = getSessionData(request);

    if (isAuthRoute === false && sessionData === null) {
        url.pathname = AUTH_ROUTES.login;
        url.searchParams.set("redirectTo", request.url);

        return redirect(url.toString());
    }

    if (url.pathname.replace(/\/$/, "") === "/admin") {
        return redirect(DEFAULT_ROUTE);
    }

    return json<LoaderData>({
        isAuthRoute: isAuthRoute,
        sessionData: sessionData,
    });
};

export default function AdminRoute() {
    let loaderData = useLoaderData<LoaderData>();

    if (loaderData.isAuthRoute) {
        return <Outlet />;
    }

    return (
        <RequestContext.Provider value={{ session: loaderData.sessionData }}>
            <div className="container">
                <div className="sidebar">
                    <Sidebar />
                </div>
                <div className="main">
                    <Outlet />
                </div>
            </div>
        </RequestContext.Provider>
    );
}
