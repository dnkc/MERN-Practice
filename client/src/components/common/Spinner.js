import spingif from "../common/spinner.gif";

import React from "react";

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
