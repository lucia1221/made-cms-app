import { Compass, Frown, Key } from "react-feather";
import { ThrownResponse, useCatch } from "remix";

interface Props {
  caught?: ThrownResponse<number, unknown>;
}

let style: Record<string, React.CSSProperties> = {
  boundary: {
    minHeight: "100%",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    color: "#fc483d",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
  },
  code: {
    maxWidth: "800px",
    width: "100%",
    textAlign: "left",
    fontSize: "13px",
    padding: "1rem",
    borderRadius: "0.5rem",
    color: "rgba(0, 0, 0, 0.7)",
    fontFamily: "monospace",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
};

export function CatchBoundary(props: Props) {
  let caught = useCatch() ?? props.caught!;
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
    <div style={style.boundary}>
      {message}
      {process.env.NODE_ENV === "development" && caught.data && (
        <pre style={style.code}>{JSON.stringify(caught.data, null, 2)}</pre>
      )}
    </div>
  );
}
