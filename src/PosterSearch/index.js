import React, { useState } from 'react'
import findMovies from './find-movies'

export default function PosterSearch () {
  const minMovieTitleLength = 3
  const [disableSearch, setDisableSearch] = useState(true)
  const [movieName, setMovieName] = useState('')
  const [msg, setMsg] = useState(
    `Enter at least ${minMovieTitleLength} letters from the movie's title.`
  )
  const [posters, setPosters] = useState([])

  function handleInput ({ target: { value, minLength } }) {
    setDisableSearch(value.length < minLength)
    setMovieName(value)
  }

  function handleClick (e) {
    e.preventDefault()
    setMsg('Searching...')
    setDisableSearch(true)
    setPosters([])
    findMovies({ movieTitle: movieName })
      .then(results => {
        console.log(results)
        if (results.error) {
          setMsg(results.error)
        } else if (results.movies.length === 0) {
          setMsg(`Sorry, we couldn't find that one. Please try again.`)
        } else {
          setMsg(
            `Now showing the first ${results.movies.length} results of ${
              results.total
            }`
          )
          setPosters(results.movies)
          setDisableSearch(false)
        }
      })
      .catch(e => {
        setMsg('Something went wrong. Please try again later.')
      })
  }

  return (
    <>
      <section className='PosterSearch'>
        <header className='header'>
          <h1>Posterz</h1>
          <h3>Find your favourite movie posters.</h3>
        </header>
        <main>
          <p>
            <label className='label' htmlFor='movie-name'>
              Movie title:
            </label>{' '}
            <input
              className='searchBox'
              type='search'
              id='movie-name'
              name='movie-name'
              value={movieName}
              onChange={handleInput}
              minLength={minMovieTitleLength}
              placeholder='enter the name of a movie'
            />
            <button
              id='search-button'
              className='searchButton'
              disabled={disableSearch}
              onClick={handleClick}
            >
              Search
            </button>
            <br />
          </p>
          <p id='msg'>{msg}</p>
        </main>
        <section id='poster-grid' className='PosterGrid'>
          {posters.map(movie => (
            <img
              key={movie.title}
              src={
                movie.poster == null
                  ? `https://via.placeholder.com/300x468?text=${encodeURIComponent(
                    movie.title
                  )}`
                  : movie.poster
              }
              alt={movie.title}
              title={movie.title}
            />
          ))}
        </section>
      </section>
    </>
  )
}
