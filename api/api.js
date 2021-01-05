const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const routes = require('./src/routes/data');

const PORT = 8502;

const app = express();

app.use(cors());
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

app.use(bodyParser.json())
app.use("/data", routes);
app.listen(process.env.PORT || PORT, function () {
    console.log("API is running on PORT: ", PORT)
})