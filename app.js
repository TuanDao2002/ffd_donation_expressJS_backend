require("dotenv").config();
require("express-async-errors");
// express

const express = require("express");
const app = express();
const cors = require("cors");

// middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

const googleSheetRouter = require("./routes/googleSheetRoute");

app.use(express.json());
app.use(cors());

// routes
app.use("/api/googleSheet", googleSheetRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 8080;

const start = async () => {
    try {
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();
