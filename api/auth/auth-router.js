const router = require('express').Router();
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Jokes = require('../jokes/jokes-data')

const BCRYPT_ROUNDS = 8; // 2^8 rounds
const JWT_SECRET = process.env.JWT_SECRET || 'shh'

router.post('/register', async (req, res) => {
  res.end('implement register, please!');
  try {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, BCRYPT_ROUNDS);
    const newUser = await Users.add({ username, password: hashedPassword });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: 'Error registering user' });
  }

});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findBy({ username }).first();
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ message: `Welcome ${username}`, token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

module.exports = router;
