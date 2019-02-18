import dummyPosters from '../fixtures/omdbapi/posters.json'
import apiErrorResponse from '../fixtures/omdbapi/error-response.json'
import noResults from '../fixtures/omdbapi/no-results.json'
import missingImages from '../fixtures/omdbapi/missing-images.json'

import dotenv from 'dotenv'
dotenv.config()
describe('Poster Search', () => {
  beforeAll(async () => {
    browser.on('disconnected', () => {
      browser.close()
    })
  })
  beforeEach(async () => {
    await jestPuppeteer.resetPage()
    const url =
      process.env.NODE_ENV === 'build'
        ? process.env.PROD_LOCALHOST
        : process.env.DEV_LOCALHOST || 'http://localhost:3000'
    return page.goto(url)
  })

  it("doesn't let me search until I've typed at least 3 characters", async () => {
    expect(await page.$eval('#search-button', btn => btn.disabled)).toBe(true)
    await expect(page).toFill('#movie-name', 'abc')
    return expect(await page.$eval('#search-button', btn => btn.disabled)).toBe(
      false
    )
  })

  it("tells me when we're searching", async done => {
    expect.assertions(3)
    await page.setRequestInterception(true)
    page.on('request', async req => {
      if (req.url().includes('omdbapi.com')) {
        const msg = await page.$('#msg')
        await expect(msg).toMatch('Searching...')

        await req.respond({
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify(dummyPosters),
          contentType: 'application/json'
        })

        done()
      }
    })
    await expect(page).toFill('#movie-name', 'star')
    await expect(page).toClick('#search-button')
  })

  it('tells me when there are no results', async done => {
    await page.setRequestInterception(true)
    page.on('request', async req => {
      if (req.url().includes('omdbapi.com')) {
        await req.respond({
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify(noResults),
          contentType: 'application/json'
        })
      }
    })
    page.on('response', async res => {
      if (res.url().includes('omdbapi.com')) {
        const msg = await page.$('#msg')
        await expect(msg).toMatch(
          `Sorry, we couldn't find that one. Please try again.`
        )
        await page.setRequestInterception(false)
        done()
      }
    })
    await expect(page).toFill('#movie-name', 'jklfHLKJEHLEKFHQWLEKFkjaflkj')
    await expect(page).toClick('#search-button')
  })
  it('handles api errors', async done => {
    await page.setRequestInterception(true)
    page.on('request', async req => {
      if (req.url().includes('omdbapi.com')) {
        await req.respond({
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify(apiErrorResponse),
          contentType: 'application/json'
        })
      }
    })
    page.on('response', async res => {
      if (res.url().includes('omdbapi.com')) {
        const msg = await page.$('#msg')
        await expect(msg).toMatch(apiErrorResponse.Error)
        await page.setRequestInterception(false)
        done()
      }
    })
    await expect(page).toFill('#movie-name', 'the')
    await expect(page).toClick('#search-button')
  })
  it('handles network errors', async done => {
    expect.assertions(3)
    await page.setRequestInterception(true)
    page.on('request', async req => {
      if (req.url().includes('omdbapi.com')) {
        await req.abort('failed')
        const msg = await page.$('#msg')
        await expect(msg).toMatch(
          'Something went wrong. Please try again later.'
        )
        await page.setRequestInterception(false)
        done()
      }
    })
    await expect(page).toFill('#movie-name', 'star')
    await expect(page).toClick('#search-button')
  })
  it('tells me how many results were found and how many are being displayed', async done => {
    expect.assertions(3)
    await page.setRequestInterception(true)
    page.on('request', async req => {
      if (req.url().includes('omdbapi.com')) {
        await req.respond({
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify(dummyPosters),
          contentType: 'application/json'
        })
      }
    })
    page.on('response', async res => {
      if (res.url().includes('omdbapi.com')) {
        const msg = await page.$('#msg')
        const json = await res.json()
        await expect(msg).toMatch(
          `Now showing the first ${json.Search.length} results of ${
            json.totalResults
          }`
        )
        await page.setRequestInterception(false)
        done()
      }
    })
    await expect(page).toFill('#movie-name', 'star')
    await expect(page).toClick('#search-button')
  })
  it('displays all results', async done => {
    expect.assertions(12)
    await page.setRequestInterception(true)
    page.on('request', async req => {
      if (req.url().includes('omdbapi.com')) {
        if (process.env.NODE_ENV === 'build') {
          await req.continue()
        } else {
          await req.respond({
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify(dummyPosters),
            contentType: 'application/json'
          })
        }
      }
    })
    page.on('response', async res => {
      if (res.url().includes('omdbapi.com')) {
        const results =
          process.env.NODE_ENV === 'build' ? await res.json() : dummyPosters
        await Promise.all(
          results.Search.map(movie =>
            expect(page).toMatchElement(`img[src="${movie.Poster}"]`)
          )
        ).then(async () => {
          await page.setRequestInterception(false)
          done()
        })
      }
    })
    await expect(page).toFill('#movie-name', 'star')
    await expect(page).toClick('#search-button')
  })
  it('displays a placeholder when no poster is available', async done => {
    expect.assertions(12)
    await page.setRequestInterception(true)
    page.on('request', async req => {
      if (req.url().includes('omdbapi.com')) {
        await req.respond({
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify(missingImages),
          contentType: 'application/json'
        })
      }
    })
    page.on('response', async res => {
      if (res.url().includes('omdbapi.com')) {
        await Promise.all(
          missingImages.Search.map(movie =>
            movie.Poster === 'N/A'
              ? expect(page).toMatchElement(
                `img[src="https://via.placeholder.com/300x468?text=${encodeURIComponent(
                  movie.Title
                )}"]`
              )
              : expect(page).toMatchElement(`img[src="${movie.Poster}"]`)
          )
        ).then(async () => {
          await page.setRequestInterception(false)
          done()
        })
      }
    })
    await expect(page).toFill('#movie-name', 'star')
    await expect(page).toClick('#search-button')
  })
})
