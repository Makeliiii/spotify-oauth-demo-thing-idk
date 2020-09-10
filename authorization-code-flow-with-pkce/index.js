const express = require('express')
const axios = require('axios')
const cryptoRandomString = require('crypto-random-string')
const crypto = require('crypto')
const querystring = require('querystring')
const port = 8000

const app = express()
require('dotenv').config()

let redirect_uri = 'http://localhost:8000/callback'
let codeVerifier

app.get('/login', (req, res) => {
    let random = Math.floor(Math.random() * (128 - 43 + 1)) + 43
    codeVerifier = cryptoRandomString({length: random}).trim()
    let codeChallenge = crypto.createHash('sha256').update(codeVerifier, 'utf8').digest('base64')

    res.redirect('https://accounts.spotify.com/authorize?' + querystring.stringify({
        client_id: process.env.CLIENT_ID,
        response_type: 'code',
        redirect_uri,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        scope: 'user-top-read'
    }))

    console.log(codeVerifier + '\n' + codeChallenge)
})

app.get('/callback', (req, res) => {
    let code = req.query.code

    console.log(codeVerifier)

    const headers = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }

    const data = {
        client_id: process.env.CLIENT_ID,
        grant_type: 'authorization_code',
        code,
        redirect_uri,
        code_verifier: codeVerifier
    }

    axios.post('https://accounts.spotify.com/api/token', querystring.stringify(data), headers)
    .then(response => {
        console.log(response.data)
        return response.data.access_token
    })
    .catch(err => console.log(err))
})

app.listen(port, () => console.log(`Server running on port: ${port}`))