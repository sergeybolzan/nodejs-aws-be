const express = require('express');
require('dotenv').config();
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let cacheProducts;

app.get('/products', (req, res, next) => {
  if (cacheProducts) {
    res.send(cacheProducts);
  } else {
    res.sendResponse = res.send;
    res.send = (body) => {
      cacheProducts = JSON.parse(body);
      setTimeout(() => cacheProducts = null, 120000);
      res.sendResponse(body);
    }
    next();
  }
});

app.all('/*', async (req, res) => {
  console.log('originalUrl', req.originalUrl); // /products/1
  console.log('method', req.method);
  console.log('body', req.body);

  const recipient = req.originalUrl.split('/')[1];
  console.log('recipient', recipient);

  const recipientUrl = process.env[recipient];
  if (recipientUrl) {
    const axiosConfig = {
      method: req.method,
      url: recipientUrl + req.originalUrl,
      ...(Object.keys(req.body || {}).length > 0 && { data: req.body })
    };
    console.log(axiosConfig);

    try {
      const response = await axios(axiosConfig);
      console.log('response data', response.data);
      res.json(response.data);
    } catch (error) {
      console.log('error:', JSON.stringify(error));
      if (error.response) {
        const {status, data} = error.response;
        res.status(status).json(data);
      } else {
        res.status(500).json({error: error.message});
      }
    }
  } else {
    res.status(502).json({error: 'Cannot process request'});
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
