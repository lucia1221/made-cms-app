export const Error404: React.FC = function () {
  function goBack() {
    window.history.go(-1);
  }

  return (
    <>
      <h1
        style={{
          fontFamily: "system-ui, sans-serif",
          padding: "2rem",
          color: "red",
        }}
      >
        404 Not Found
      </h1>
      <a onClick={goBack}>Go Back</a>
    </>
  );
};
