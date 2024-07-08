// Write your tests here
// Minimum 2 test per endpoint
/*
[POST] register
[POST] login
[GET] jokes

*/


const request = require('supertest')
const db = require('../data/dbConfig.js')
const server = require('./server.js')
const Joke = require('./jokes/jokes-model.js')


const joke1 = {joke: `I'm tired of following my dreams.`, punchline:`I'm just going to ask them where they are going and meet up with them later.`}
const joke2 = {joke: `Did you hear about the guy whose whole left side was cut off?`, punchline:`He's all right now.`}
const joke3 = {joke: `Why didn’t the skeleton cross the road?`, punchline:`Because he had no guts.`}

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

beforeEach(async ()=> {
  await db('users').truncate()
})

afterAll(async ()=> {
  await db.destroy()
})

test('[0]sanity', () => {
  expect(true).not.toBe(false)
})

test('[1]correct env var', () => {
    expect(process.env.NODE_ENV).toBe('testing')
})

describe('Jokes model functions', () => {
  describe('create joke', () => {
    it('adds joke to the db', async () => {
      let jokes
      await Joke.createJoke(joke1)
      jokes = await db('jokes')
      expect(jokes).toHaveLength(1)
      
      await Joke.createJoke(joke2)
      jokes = await db('jokes')
      expect(jokes).toHaveLength(2)
      
      await Joke.createJoke(joke3)
      jokes = await db('jokes')
      expect(jokes).toHaveLength(3)

    })
    it('inserted joke and punchline', async () => {
      const joke = await Joke.createJoke(joke1)
      expect(joke).toMatchObject({id:1,...joke})
    })
  })
})





/*
test('[2]' GET can get all jokes that exist in project, () => {

})

test('[3]' GET each joke matches its valid id, () => {

})

test('[4]' POST can create a new joke with valid id, () => {

})

test('[5]' POST will not create duplicate joke, () => {

})

test('[6]' POST check if username is correct , () => {

})

test('[7]' POST check if password entered matches hash password, () => {

})


*/