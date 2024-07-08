// Write your tests here
const request = require('supertest')
const db = require('../data/dbConfig.js')
const server = require('./server.js')


test('[0]sanity', () => {
  expect(true).not.toBe(false)
})

test('[1]correct env var', () => {
    expect(process.env.NODE_ENV).toBe('testing')
})

/*
test('[2]', () => {

})


*/