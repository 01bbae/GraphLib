"use strict";
exports.__esModule = true;
var express = require("express");
var app = express();
var port = 5000;
app.listen(port, function () {
    console.log("listening on ".concat(port));
});
app.get('/', function (req, res) {
    console.log("in /");
});
app.get('/query', function (req, res) {
    console.log("in /query");
    console.log(req.query);
    if (typeof req.query["query"] !== "string") {
        throw new Error("Query is not a string");
    }
    var query = req.query["query"];
});
