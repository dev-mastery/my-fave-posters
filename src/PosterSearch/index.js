import React, { useState } from 'react'

export default function PosterSearch () {
  const [disableSearch, setDisableSearch] = useState(true)
  const [movieName, setMovieName] = useState('')
  const [msg, setMsg] = useState(
    `Enter at least 3 letters from the movie's title.`
  )
  const [posters, setPosters] = useState([])

  function handleInput ({ target: { value } }) {
    setDisableSearch(value.length < 3)
    setMovieName(value)
  }

  function handleClick (e) {
    e.preventDefault()
    setMsg('Searching...')
    setDisableSearch(true)
    setPosters([])
    fetch(
      `${process.env.REACT_APP_API_URL}?s=${encodeURIComponent(
        movieName
      )}&apikey=${process.env.REACT_APP_API_KEY}`
    )
      .then(resp => resp.json())
      .then(results => {
        if (results.Response === 'True') {
          setMsg(
            `Now showing the first ${results.Search.length} results of ${
              results.totalResults
            }`
          )
          setPosters(results.Search)
          setDisableSearch(false)
        } else {
          setMsg(results.Error)
        }
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
              key={movie.Title}
              src={movie.Poster}
              alt={movie.Title}
              title={movie.Title}
            />
          ))}
        </section>
      </section>
    </>
  )
}
