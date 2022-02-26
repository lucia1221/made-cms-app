import React from "react";
import { Compass, Frown, Key } from "react-feather";
import { LinksFunction, useCatch } from "remix";
import styles from "./CatchBoundary.css";

export let links: LinksFunction = function () {
  return [{ rel: "stylesheet", href: styles }];
};

export let CatchBoundary: React.FC = function () {
  let caught = useCatch();
  let message: React.ReactNode;

  switch (caught.status) {
    case 401:
    case 403:
      message = (
        <>
          <Key size={64} />
          <h1>
            Oops! Looks like you tried to visit a page that you do not have
            access to.
          </h1>
        </>
      );

      break;
    case 404:
      message = (
        <>
          <Compass size={64} />
          <h1>
            Oops! Looks like you tried to visit a page that does not exist.
          </h1>
        </>
      );
      break;

    default:
      message = (
        <>
          <Frown size={64} />
          <h1>Ooops! Something bad happened.</h1>
          <b>
            {caught.status} {caught.statusText}
          </b>
        </>
      );
      break;
  }

  return (
    <div className="catch-boundary">
      {message}
      {process.env.NODE_ENV === "development" && caught.data && (
        <pre>{JSON.stringify(caught.data, null, 2)}</pre>
      )}
    </div>
  );
};
