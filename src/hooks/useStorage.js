import { useState, useEffect } from "react";
import {
  projectStorage,
  projectFirestore,
  timestamp,
} from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function useStorage(file) {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    // create reference
    const storageRef = ref(projectStorage, file.name);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        let uploadPercentage =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(uploadPercentage);
      },
      (err) => {
        setError(err);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
          const createdAt = timestamp();
          await addDoc(collection(projectFirestore, "images"), {
            url,
            createdAt,
          });
          setUrl(url);
        });
      }
    );
  }, [file]);

  return { progress, url, error };
}
