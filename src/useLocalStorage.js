import { useEffect, useState } from "react";

export default function useLocalStorage() {
  const [watched, setWatched] = useState(
    () => JSON.parse(localStorage.getItem("watched")) || []
  );

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );
  return { watched, setWatched };
}
