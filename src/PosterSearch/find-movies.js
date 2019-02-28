import axios from 'axios'

export default function findMovies ({ movieTitle }) {
  const query = buildMovieQuery({ movieTitle })
  return axios(query)
    .then(response => normalizeMovieResults(response.data))
    .catch(e => {
      console.log(e)
      throw new Error('Something went wrong. See log for details.')
    })
}

export function buildMovieQuery ({ movieTitle }) {
  return {
    method: 'GET',
    url: 'https://omdbapi.com/',
    params: {
      s: movieTitle,
      apikey: process.env.REACT_APP_API_KEY
    }
  }
}

export function normalizeMovieResults (results) {
  if (results.Error === 'Movie not found!') {
    return {
      total: 0,
      movies: []
    }
  }

  if (results.Response === 'False') {
    return { error: results.Error }
  }

  return {
    total: results.totalResults,
    movies: results.Search.map(movie => ({
      title: movie.Title,
      year: movie.Year,
      type: movie.Type,
      poster: movie.Poster === 'N/A' ? null : movie.Poster,
      id: movie.imdbID
    }))
  }
}
