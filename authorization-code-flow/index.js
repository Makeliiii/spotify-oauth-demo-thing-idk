const express = require('express')
const axios = require('axios')
const querystring = require('querystring')
const port = 8000

const app = express()
require('dotenv').config()

let redirect_uri = 'http://localhost:8000/callback'

app.get('/login', (req, res) => {
    res.redirect('https://accounts.spotify.com/authorize?' + querystring.stringify({
        response_type: 'code',
        client_id: process.env.CLIENT_ID,
        scope: 'user-top-read',
        redirect_uri
    }))
})

app.get('/callback', (req, res) => {
    let code = req.query.code || null

    const headers = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
            username: process.env.CLIENT_ID,
            password: process.env.CLIENT_SECRET
        }
    }

    const data = {
        code,
        redirect_uri,
        grant_type: 'authorization_code'
    }

    axios.post('https://accounts.spotify.com/api/token', querystring.stringify(data), headers)
        .then(response => {
            console.log(response.data)
            return response.data.access_token
        })
        .catch(err => console.log(err))
})

app.listen(port, () => console.log('App listening on port 8000'))