require('dotenv').config();
import 'reflect-metadata';

import express from 'express';

import './database/connect';
import routes from './routes';

process.env.TZ = 'UTC';

const app = express();

app.use(express.json());
app.use(routes);

app.listen(process.env.PORT || 3000, () => {
  console.log('server is running!');
});
