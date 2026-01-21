const express = require('express');
require('dotenv').config()
const app = express();
const PORT = process.env.PORT;
const cors = require('cors');
const indexRouter = require('./src/routers/index.route')
const { connectRedis } = require('./src/utils/redis.util');
const { notFound, errorHandler } = require('./src/middlewares/error.middleware');
const cookieParser = require("cookie-parser");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : true}));
app.use(cookieParser()); 

app.get('/health-check', (req, res) => {
    res.send('server is up and running');
})

app.use('/api/v1', indexRouter);

app.use(notFound);
app.use(errorHandler);


app.listen(PORT, async () => {
    console.log(`server is listening on port http://www.localhost:${PORT}/`);
    await connectRedis();
})
