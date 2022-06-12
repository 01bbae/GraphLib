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
exports.databaseSearch = exports.PaperScore = void 0;
const tf = require("@tensorflow/tfjs");
const use = require("@tensorflow-models/universal-sentence-encoder");
const fs = require("fs");
require("stream-json");
require('@tensorflow/tfjs-node');
const { parser } = require("stream-json/Parser");
const { pipeline } = require('node:stream');
class PaperScore {
    constructor(data, score) {
        this.data = data;
        this.score = score;
    }
}
exports.PaperScore = PaperScore;
function databaseSearch(query, database) {
    return __awaiter(this, void 0, void 0, function* () {
        const model = yield use.load();
        const relevantPapers = [];
        const maxLength = 10;
        // FIXME: figure out what type this is
        yield pipeline(fs.createReadStream(database), parser(), (data) => __awaiter(this, void 0, void 0, function* () {
            const text = [data.abstract, query];
            const embedding = yield model.embed(text);
            const tensor = yield embedding.array();
            const abstractEmbedding = tensor[0];
            const queryEmbedding = tensor[1];
            const cosineSimilarity = calculateCosineSimilarity(abstractEmbedding, queryEmbedding);
            const currentPaper = new PaperScore(data, cosineSimilarity);
            let lowestScore = relevantPapers[relevantPapers.length - 1].score;
            let highestScore = relevantPapers[0].score;
            if (highestScore < currentPaper.score) {
                relevantPapers.unshift(currentPaper);
                relevantPapers.pop();
            }
            else if (highestScore > currentPaper.score && lowestScore < currentPaper.score) {
                // find the first paper in array with lower score than current paper and insert
                for (let i = 0; i < relevantPapers.length; i++) {
                    if (currentPaper.score > relevantPapers[i].score) {
                        relevantPapers.splice(i, 0, currentPaper);
                        if (relevantPapers.length > maxLength) {
                            relevantPapers.pop();
                        }
                        break;
                    }
                }
            }
        }));
        return relevantPapers;
    });
}
exports.databaseSearch = databaseSearch;
function calculateCosineSimilarity(abstractEmbedding, queryEmbedding) {
    const dotProd = tf.dot(abstractEmbedding, queryEmbedding);
    const lenAbstractEmbedding = tf.dot(abstractEmbedding, abstractEmbedding);
    const lenQueryEmbedding = tf.dot(queryEmbedding, queryEmbedding);
    const similarityScore = tf.div(dotProd, tf.mul(lenAbstractEmbedding, lenQueryEmbedding));
    console.log(similarityScore);
    return similarityScore.arraySync();
}
