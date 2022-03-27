import spingif from "./spinner.gif";

export default function Spinner() {
  return (
    <div>
      <img
        style={{ width: "200px", margin: "auto", display: "block" }}
        src={spingif}
        alt="loading"
      />
    </div>
  );
}
