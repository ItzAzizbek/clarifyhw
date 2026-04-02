require('dotenv').config();

const express = require('express');
const cors = require('cors');
const explainRouter = require('./routes/explain');

const app = express();
const environment = (process.env.ENVIRONMENT || 'DEVELOPMENT').trim().toUpperCase();
const selectedEnvironment = environment === 'PRODUCTION' ? 'PRODUCTION' : 'DEVELOPMENT';
const clientUrl =
  selectedEnvironment === 'PRODUCTION'
    ? process.env.CLIENT_URL_PRODUCTION?.trim()
    : process.env.CLIENT_URL_DEVELOPMENT?.trim();
const apiUrl =
  selectedEnvironment === 'PRODUCTION'
    ? process.env.API_URL_PRODUCTION?.trim()
    : process.env.API_URL_DEVELOPMENT?.trim();
const PORT = Number(process.env.PORT) || 3001;

app.use(
  cors({
    origin: clientUrl,
  })
);
app.use(express.json());

app.use('/api/explain', explainRouter);

app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(500).json({
    message: 'Something went wrong while processing the request.',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${selectedEnvironment}`);
  console.log(`Client URL: ${clientUrl}`);
  console.log(`API URL: ${apiUrl}`);
});
