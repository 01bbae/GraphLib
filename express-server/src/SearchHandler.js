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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.databaseSearch = exports.PaperScore = void 0;
var tf = require("@tensorflow/tfjs");
var use = require("@tensorflow-models/universal-sentence-encoder");
var tfnode = require('@tensorflow/tfjs-node');
var fs = require("fs");
require("stream-json");
var parser = require("stream-json/Parser").parser;
var PaperScore = /** @class */ (function () {
    function PaperScore(data, score) {
        this.data = data;
        this.score = score;
    }
    return PaperScore;
}());
exports.PaperScore = PaperScore;
function databaseSearch(query) {
    return __awaiter(this, void 0, void 0, function () {
        var model, pipeline, data;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, use.load()];
                case 1:
                    model = _a.sent();
                    pipeline = fs.createReadStream("../../dataset/arxiv-metadata-oai-snapshot").pipe(parser());
                    return [4 /*yield*/, pipeline.on("data", function (data) { return __awaiter(_this, void 0, void 0, function () {
                            var text, embedding, tensor, abstractEmbedding, queryEmbedding, listOfPapers, maxLength, cosineSimilarity, currentPaper;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        text = [data.abstract, query];
                                        return [4 /*yield*/, model.embed(text)];
                                    case 1:
                                        embedding = _a.sent();
                                        return [4 /*yield*/, embedding.array()];
                                    case 2:
                                        tensor = _a.sent();
                                        abstractEmbedding = tensor[0];
                                        queryEmbedding = tensor[1];
                                        listOfPapers = [];
                                        maxLength = 10;
                                        cosineSimilarity = calculateCosineSimilarity(abstractEmbedding, queryEmbedding);
                                        currentPaper = new PaperScore(data, cosineSimilarity);
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 2:
                    data = _a.sent();
                    pipeline.on("end", function () { return console.log("went through all objects"); });
                    return [2 /*return*/];
            }
        });
    });
}
exports.databaseSearch = databaseSearch;
function calculateCosineSimilarity(abstractEmbedding, queryEmbedding) {
    var dotProd = tf.dot(abstractEmbedding, queryEmbedding);
    var lenAbstractEmbedding = tf.dot(abstractEmbedding, abstractEmbedding);
    var lenQueryEmbedding = tf.dot(queryEmbedding, queryEmbedding);
    var similarityScore = tf.div(dotProd, tf.mul(lenAbstractEmbedding, lenQueryEmbedding));
    console.log(similarityScore);
    return similarityScore.arraySync(); // should this be type number ?
}