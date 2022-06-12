"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const SearchHandler_1 = require("./SearchHandler");
const app = express();
const port = 5000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});
app.get('/', (req, res) => {
    console.log("in /");
});
app.get('/query', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("in /query");
    console.log(req.query);
    if (typeof req.query["query"] !== "string") {
        throw new Error("Query is not a string");
    }
    const query = req.query["query"];
    const database = "../../dataset/arxiv-metadata-oai-snapshot";
    const listOfPapers = yield (0, SearchHandler_1.databaseSearch)(query, database);
}));
