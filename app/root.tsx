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

export let loader: LoaderFunction = function ({ request }) {
  // Remove trailing "/" from URL
  if (request.url.endsWith("/")) {
    return redirect(request.url.replace(/\/$/, ""));
  }

  return null;
};

export let links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: "https://unpkg.com/modern-css-reset@1.4.0/dist/reset.min.css",
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
        <meta name="viewport" content="width=device-width,initial-scale=1" />
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
