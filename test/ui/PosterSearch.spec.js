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
    return page.goto('http://localhost:3000')
  })

  xit("doesn't let me search until I've typed at least 3 characters", () => {})
  xit("tells me when we're searching", () => {})
  xit('tells me when there are no results', () => {})
  xit('handles api errors', () => {})
  xit('handles network errors', () => {})
  xit('tells me how many results were found and how many are being displayed', () => {})
  xit('displays all results', () => {})
  xit('displays a placeholder when no poster is available', () => {})
})
