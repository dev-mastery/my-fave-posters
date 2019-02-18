import React, { useState } from 'react'

export default function PosterSearch () {
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
              src={
                movie.Poster === 'N/A'
                  ? `https://via.placeholder.com/300x468?text=${encodeURIComponent(
                    movie.Title
                  )}`
                  : movie.Poster
              }
              alt={movie.Title}
              title={movie.Title}
            />
          ))}
        </section>
      </section>
    </>
  )
}
