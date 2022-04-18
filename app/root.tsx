import React from "react";
import {
    Links,
    LinksFunction,
    LiveReload,
    LoaderFunction,
    Meta,
    MetaFunction,
    Outlet,
    redirect,
    Scripts,
    ScrollRestoration,
} from "remix";
import {
    CatchBoundary as CommonCatchBoundary,
    links as catchBoundaryLinks,
} from "~/components/CatchBoundary";

export let links: LinksFunction = () => {
    return [
        {
            rel: "stylesheet",
            href: "https://unpkg.com/modern-css-reset@1.4.0/dist/reset.min.css",
        },
        {
            rel: "preconnect",
            href: "https://fonts.googleapis.com",
            crossOrigin: "anonymous",
        },
        {
            rel: "stylesheet",
            href: "https://fonts.googleapis.com/css2?family=Lato&family=Montserrat:wght@500;700&display=swap",
        },
        {
            rel: "stylesheet",
            href: require("~/styles/global.css"),
        },
        ...catchBoundaryLinks(),
    ];
};

export const meta: MetaFunction = () => {
    return { title: "Blog by .made" };
};

export let loader: LoaderFunction = ({ request }) => {
    let url = new URL(request.url);

    if (url.pathname.endsWith("/")) {
        url.pathname = url.pathname.replace(/\/+$/, "");
        return redirect(url.toString());
    }

    return null;
};

let Document: React.FC = function (props) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width,initial-scale=1"
                />
                <script>var global = globalThis;</script>
                <Meta />
                <Links />
            </head>
            <body>
                {props.children}
                <ScrollRestoration />
                <Scripts />

                {process.env.NODE_ENV === "development" && <LiveReload />}
            </body>
        </html>
    );
};

export default function App() {
    return (
        <Document>
            <Outlet />
        </Document>
    );
}

export let CatchBoundary: React.FC = function () {
    return (
        <Document>
            <CommonCatchBoundary />
        </Document>
    );
};
