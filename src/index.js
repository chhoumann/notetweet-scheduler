const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path')
require('dotenv').config();

const middlewares = require('./middlewares');

const app = express();
app.use(morgan('common'));
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/index.html'));
    res.json("{message: '📔🐦 at work.'}");
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

const port = process.env.PORT || 2020;
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});