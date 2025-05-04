import { useEffect, useRef, useState } from "react";
import StarRating from "./starRating";
import useMovies from "./useMovies";
import useLocalStorage from "./useLocalStorage";
import useKey from "./useKey";

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];

// const average = (arr) =>
//   arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const average = (arr) => {
  const validNumbers = arr.filter(
    (num) => typeof num === "number" && !isNaN(num)
  );
  if (validNumbers.length === 0) {
    return 0;
  }
  return validNumbers.reduce((acc, cur) => acc + cur, 0) / validNumbers.length;
};
export default function App() {
  // const [movies, setMovies] = useState([]);
  // const [watched, setWatched] = useState([]);
  // const [watched, setWatched] = useState(() =>
  //   JSON.parse(localStorage.getItem("watched"))
  // );
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handelMovieSelection(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }
  function handelCloseMovie() {
    setSelectedId(null);
  }

  function handelAddWatch(movie) {
    setWatched((watched) => [...watched, movie]);

    // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }

  function handelDeleteWatched(id) {
    setWatched(watched.filter((el) => el.imdbID !== id));
  }

  const { watched, setWatched } = useLocalStorage();
  // useEffect(
  //   function () {
  //     localStorage.setItem("watched", JSON.stringify(watched));
  //   },
  //   [watched]
  // );

  // useEffect(
  //   function () {
  //     const controller = new AbortController();

  //     async function fetchMovies() {
  //       try {
  //         setIsLoading(true);
  //         setError("");
  //         const res = await fetch(
  //           `http://www.omdbapi.com/?apikey=b6cf7d02&s=${query}`,
  //           { signal: controller.signal }
  //         );
  //         if (!res.ok) {
  //           throw new Error("Faild to load , try again later!");
  //         }

  //         const data = await res.json();
  //         if (data.Response === "False") {
  //           throw new Error("Movies not found");
  //         }
  //         setMovies(data.Search);
  //       } catch (error) {
  //         console.error(error.message + "⛔⛔");
  //         if (error.name !== "AbortError") setError(error.message);
  //       }

  //       setIsLoading(false);
  //     }
  //     if (query.length < 3) {
  //       setMovies([]);
  //       setError("");
  //       return;
  //     }
  //     handelCloseMovie();
  //     fetchMovies();

  //     return function () {
  //       controller.abort();
  //     };
  //   },
  //   [query]
  // );
  const { error, movies, isLoading } = useMovies(query, handelCloseMovie);
  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />}</Box> */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelect={handelMovieSelection} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <SelectedMovie
              onClose={handelCloseMovie}
              selectedId={selectedId}
              OnAdd={handelAddWatch}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDelete={handelDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Search({ query, setQuery }) {
  const inputElement = useRef(null);

  useEffect(function () {
    inputElement.current.focus();

    function callback(e) {
      if (e.key === "Enter") inputElement.current.focus();
    }
    document.addEventListener("keydown", callback);
  }, []);

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputElement}
    />
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>I Watched</h1>
    </div>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function MovieList({ movies, onSelect }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} onSelect={onSelect} key={movie.imdbID} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelect }) {
  return (
    <li onClick={() => onSelect(movie.imdbID)} key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function SelectedMovie({ selectedId, onClose, OnAdd, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const isWatched = watched.map((el) => el.imdbID).includes(selectedId);
  const watchedElmenetRating = watched.find(
    (el) => el.imdbID === selectedId
  )?.userRating;
  function handelAddToTheBox() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
      imdbRating: Number(movie.imdbRating),
      runtime: Number(movie.Runtime.split(" ")[0]),
      userRating,
    };

    OnAdd(newWatchedMovie);
    onClose();
  }

  useEffect(
    function () {
      document.title = movie.Title || "";

      return function () {
        document.title = "I Watched";
      };
    },
    [movie.Title]
  );

  useEffect(
    function () {
      async function fetchMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=b6cf7d02&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        console.log(data);
        setIsLoading(false);
      }
      fetchMovieDetails();
    },
    [selectedId]
  );

  useKey(onClose);
  // useEffect(
  //   function () {
  //     document.addEventListener("keydown", function (e) {
  //       if (e.code === "Escape") {
  //         onClose();
  //       }
  //     });

  //     return function () {
  //       document.removeEventListener("keydown", function (e) {
  //         if (e.code === "Escape") {
  //           onClose();
  //         }
  //       });
  //     };
  //   },
  //   [onClose]
  // );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onClose}>
              &larr;
            </button>
            <img src={movie.Poster} alt={movie.imdbID} />
            <div className="details-overview">
              <h2>{movie.Title}</h2>
              <p>
                {movie.Released} &bull; {movie.Runtime}
              </p>
              <p>⭐ {movie.imdbRating} IMDB Rating</p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating onSetRating={setUserRating} />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handelAddToTheBox}>
                      +Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>You rated the movie {watchedElmenetRating} ⭐</p>
              )}
            </div>
            <p>
              <em>{movie.Plot}</em>
            </p>
            <p>Starring: {movie.Actors}</p>
            <p>Directedby: {movie.Director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{Math.ceil(avgRuntime)} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovieList({ watched, onDelete }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovieItem
          movie={movie}
          onDelete={onDelete}
          key={movie.imdbID}
        />
      ))}
    </ul>
  );
}

function WatchedMovieItem({ movie, onDelete }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating.toFixed(2) || 0}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime || 0} min</span>
        </p>
        <button className="btn-delete" onClick={() => onDelete(movie.imdbID)}>
          X
        </button>
      </div>
    </li>
  );
}

function Loader() {
  return <p className="loader"> ⌛Loading..⌛</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔{message}⛔</span>
    </p>
  );
}
