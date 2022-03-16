import React, { useState } from "react";
import ProgressBar from "./ProgressBar";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const allowedTypes = ["image/png", "image/jpeg"];
  const maxBytes = 5000000;

  function changeHandler(e) {
    let selected = e.target.files[0];
    if (
      selected &&
      allowedTypes.includes(selected.type) &&
      selected.size < maxBytes
    ) {
      setFile(selected);
      setError("");
    } else {
      setFile(null);
      setError("Please select an image file (png or jpeg) under 5MB");
    }
  }

  return (
    <form>
      <input type="file" onChange={changeHandler} />
      <div className="output">
        {error && <div className="error">{error}</div>}
        {file && <div>{file.name}</div>}
        {file && <ProgressBar file={file} setFile={setFile} />}
      </div>
    </form>
  );
}
