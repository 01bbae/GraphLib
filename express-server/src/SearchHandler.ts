import tf = require("@tensorflow/tfjs");
import use = require("@tensorflow-models/universal-sentence-encoder");
import fs = require("fs");
require("stream-json");
require('@tensorflow/tfjs-node');
const { parser } = require("stream-json/Parser");
const { pipeline } = require('node:stream');

export class PaperScore {
    data: Paper;
    score: number; 
    constructor(data: Paper, score: number){
        this.data = data;
        this.score = score;
    }
    
}

export async function databaseSearch(query: string, database: string): Promise<Array<PaperScore>>/*Promise<Array<PaperScore>>*/ {
    const model: use.UniversalSentenceEncoder = await use.load();
    const relevantPapers: Array<PaperScore> = [];
    const maxLength = 10;

    

    // FIXME: figure out what type this is
    await pipeline(
        fs.createReadStream(database),
        parser(), 
        async (data: Paper) => {
            const text: Array<string> = [data.abstract, query];
            const embedding: tf.Tensor2D = await model.embed(text);
            const tensor: number[][] = await embedding.array()
            const abstractEmbedding: Array<number> = tensor[0];
            const queryEmbedding: Array<number> = tensor[1];
            

            const cosineSimilarity: number = calculateCosineSimilarity(abstractEmbedding, queryEmbedding);
            const currentPaper:PaperScore = new PaperScore(data, cosineSimilarity);

            let lowestScore: number = relevantPapers[relevantPapers.length-1].score;
            let highestScore: number = relevantPapers[0].score;

            if (highestScore < currentPaper.score){
                relevantPapers.unshift(currentPaper);
                relevantPapers.pop();
            }else if (highestScore > currentPaper.score && lowestScore < currentPaper.score){
                // find the first paper in array with lower score than current paper and insert
                for (let i = 0; i < relevantPapers.length; i++){
                    if (currentPaper.score > relevantPapers[i].score){
                        relevantPapers.splice(i,0,currentPaper);
                        if (relevantPapers.length > maxLength){
                            relevantPapers.pop();
                        }
                        break;
                    }
                }
            }
        }
    );
    return relevantPapers;
}


function calculateCosineSimilarity(abstractEmbedding: tf.Tensor1D | Array<number>, queryEmbedding: tf.Tensor1D | Array<number>): number{
    const dotProd: tf.Tensor = tf.dot(abstractEmbedding, queryEmbedding);
    const lenAbstractEmbedding: tf.Tensor = tf.dot(abstractEmbedding, abstractEmbedding);
    const lenQueryEmbedding: tf.Tensor = tf.dot(queryEmbedding, queryEmbedding);
    const similarityScore: tf.Tensor = tf.div(dotProd, tf.mul(lenAbstractEmbedding,lenQueryEmbedding));
    console.log(similarityScore)
    return similarityScore.arraySync() as number; 
}

// declaring type
export type Paper = {
    id: string;
    submitter: string;
    authors: string;
    title: string;
    comments: string;
    journal_ref: string;
    doi: string;
    report_no: string;
    categories: string;
    license?: string;
    abstract: string;
    versions: Array<{
        version: string;
        created: string;
    }>;
    update_date: string;
    authors_parsed: Array<Array<string>>;
    };
