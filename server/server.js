var express = require("express");
var app = express();

app.use(express.json())

app.use('/', require('./src/routes'))

app.listen(3333, () => {
 console.log("Server running on port 3333");
});