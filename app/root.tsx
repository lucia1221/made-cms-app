import { extractStyles } from "evergreen-ui";
import type { MetaFunction } from "remix";
import {
  Links,
  LinksFunction,
  LiveReload,
  LoaderFunction,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
} from "remix";
export { CatchBoundary } from "~/components/CatchBoundary";

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
  ];
};

export const meta: MetaFunction = () => {
  return { title: "Blog by .made" };
};

export default function App() {
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
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {hydrationScript}
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
