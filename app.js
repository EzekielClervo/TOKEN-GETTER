const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('index'));

app.post('/login', async (req, res) => {
    const { user, pass, mode } = req.body;

    if (mode === '1') {
        // datr, fr, xs style cookie – currently mock only
        res.render('result', { 
            result: `Login (mode 1) not implemented yet`, 
            cookies: `-`, 
            token: `-` 
        });
    } else {
        try {
            const data = {
                adid: uuidv4(),
                format: 'json',
                device_id: uuidv4(),
                cpl: 'true',
                family_device_id: uuidv4(),
                credentials_type: 'device_based_login_password',
                source: 'device_based_login',
                email: user,
                password: pass,
                access_token: '350685531728|62f8ce9f74b12f84c123cc23437a4a32',
                generate_session_cookies: '1',
                method: 'auth.login',
                locale: 'en_US',
                fb_api_caller_class: 'com.facebook.account.login.protocol.Fb4aAuthHandler',
                fb_api_req_friendly_name: 'authenticate',
                api_key: '62f8ce9f74b12f84c123cc23437a4a32',
            };

            const headers = {
                'User-Agent': 'FBAN/FB4A;FBAV/300.0.0.34.108;',
                'Content-Type': 'application/x-www-form-urlencoded'
            };

            const resp = await axios.post("https://b-graph.facebook.com/auth/login", new URLSearchParams(data), { headers });
            const result = resp.data;

            if (result.session_key) {
                const cookie = result.session_cookies.map(i => `${i.name}=${i.value}`).join('; ');
                res.render('result', {
                    result: 'Login successful!',
                    cookies: `sb=${uuidv4().replace(/-/g, '')}; ${cookie}`,
                    token: result.access_token
                });
            } else {
                res.render('result', { result: 'Login failed', cookies: '-', token: '-' });
            }
        } catch (err) {
            res.render('result', { result: 'Error occurred', cookies: '-', token: '-' });
        }
    }
});

app.listen(process.env.PORT || 3000, () => console.log("Running on http://localhost:3000"));
