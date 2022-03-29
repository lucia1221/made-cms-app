import { extractStyles } from "evergreen-ui";
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
            href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap",
        },
        ...catchBoundaryLinks(),
    ];
};

export const meta: MetaFunction = () => {
    return { title: "Blog by .made" };
};

let Document: React.FC = function (props) {
    const { css, hydrationScript } = extractStyles();

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
                <style dangerouslySetInnerHTML={{ __html: css }} />
            </head>
            <body>
                {props.children}
                <ScrollRestoration />
                <Scripts />
                {hydrationScript}
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
