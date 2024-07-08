const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')
const Joke = require('./jokes/jokes-model.js')

const joke1 = {joke: `I'm tired of following my dreams.`, punchline:`I'm just going to ask them where they are going and meet up with them later.`}
const joke2 = {joke: `Did you hear about the guy whose whole left side was cut off?`, punchline:`He's all right now.`}
const joke3 = {joke: `Why didn’t the skeleton cross the road?`, punchline:`Because he had no guts.`}

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db('users').truncate();
});

afterAll(async () => {
  await db.destroy();
});



test('sanity', () => {
  expect(true).not.toBe(false)
})

test('correct env var', () => {
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



describe('auth endpoints', () => {
  describe('[POST] /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(server)
        .post('/api/auth/register')
        .send({ username: 'testuser', password: 'password' });
      expect(res.status).toBe(201);
      expect(res.body.username).toBe('testuser');
    });

    it('should return error if username or password is missing', async () => {
      const res = await request(server)
        .post('/api/auth/register')
        .send({ username: 'testuser' });
      expect(res.status).toBe(500);
      expect(res.body.message).toBe('username and password required');
    });
  });

  describe('[POST] /api/auth/login', () => {
    beforeEach(async () => {
      await request(server)
        .post('/api/auth/register')
        .send({ username: 'testuser', password: 'password' });
    });

    it('should login a user with correct credentials', async () => {
      const res = await request(server)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'password' });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Welcome testuser');
      expect(res.body.token).toBeDefined();
    });

    it('should return error if credentials are invalid', async () => {
      const res = await request(server)
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'wrongpassword' });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid credentials');
    });
  });

  describe('[GET] /api/jokes', () => {
    it('should return jokes with valid token', async () => {
      // Register and login a user to get a token
      await request(server).post('/api/auth/register').send({ username: 'testuser', password: 'password' });
      const loginRes = await request(server).post('/api/auth/login').send({ username: 'testuser', password: 'password' });
      const token = loginRes.body.token;

      const res = await request(server).get('/api/jokes').set('Authorization', token);
      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
    });

    it('should return 401 if no token is provided', async () => {
      const res = await request(server).get('/api/jokes');
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('token required');
      
    });
  });
});

