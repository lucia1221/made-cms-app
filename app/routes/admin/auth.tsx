import { LinksFunction, Outlet } from "remix";
import { Card, links as cardLinks } from "~/components/card";
import { Logo } from "~/components/logo";

export let links: LinksFunction = function () {
    return [{ rel: "stylesheet", href: require("./auth.css") }, ...cardLinks()];
};

export default function AdminAuthRoute() {
    return (
        <div className="auth-grid">
            <div className="auth-main">
                <Logo className="logo" height={24} />
                <Card className="page-container" padding="2xl">
                    <Outlet></Outlet>
                </Card>
            </div>
        </div>
    );
}
