import { useEffect, useState } from "react";

export default function useMovies(query, handelCloseMovie) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=b6cf7d02&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok) {
            throw new Error("Faild to load , try again later!");
          }

          const data = await res.json();
          if (data.Response === "False") {
            throw new Error("Movies not found");
          }
          setMovies(data.Search);
        } catch (error) {
          console.error(error.message + "⛔⛔");
          if (error.name !== "AbortError") setError(error.message);
        }

        setIsLoading(false);
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      handelCloseMovie();
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    // eslint-disable-next-line
    [query]
  );
  return { movies, error, isLoading };
}
