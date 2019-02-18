import React from 'react'

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
              placeholder='enter the name of a movie'
            />
            <button id='search-button' className='searchButton'>
              Search
            </button>
            <br />
          </p>
          <p id='msg' />
        </main>
        <section id='poster-grid' className='PosterGrid' />
      </section>
    </>
  )
}
