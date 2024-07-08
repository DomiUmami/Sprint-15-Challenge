const db = require('../../data/dbConfig.js')

async function createJoke(joke){
    const [id] = await db('jokes').insert(joke)
    return db('jokes').where('id', id).first()
}

module.exports = {
    createJoke
}