import tf = require("@tensorflow/tfjs");
import use = require("@tensorflow-models/universal-sentence-encoder");
import fs = require("fs");
require("stream-json");
require('@tensorflow/tfjs-node');
const { parser } = require("stream-json/Parser");
const { pipeline } = require('node:stream');
import { Paper } from "./Paper";

export class PaperScore {
    data: Paper;
    score: number; 
    constructor(data: Paper, score: number){
        this.data = data;
        this.score = score;
    }
    
}

// export async function databaseSearch(query: string, database: string) /*Promise<Array<PaperScore>>*/ {
//     try{
//         const model: use.UniversalSentenceEncoder = await use.load();
//         const relevantPapers: Array<PaperScore> = [];
//         const maxLength = 10;
//     }catch{
//         throw "couldnt resolve use";
//     }

    

//     // FIXME: figure out what type this is
//     try{
//         await pipeline(
//             fs.createReadStream(database),
//             parser(), 
//             async (data: Paper) => {
//                 const text: Array<string> = [data.abstract, query];
//                 let embedding: tf.Tensor2D;
//                 let tensor: number[][];
//                 try{
//                     embedding = await model.embed(text);
//                     tensor = await embedding.array()
//                     console.log(embedding)
//                 }catch{
//                     throw "Error getting embeddings";
    
//                 }
//             }
//         );
//         // return relevantPapers;
//     }catch{
//         throw "couldnt get relevant papers"
//     }
// }


// function calculateCosineSimilarity(abstractEmbedding: tf.Tensor1D | Array<number>, queryEmbedding: tf.Tensor1D | Array<number>): number{
//     try{
//         const dotProd: tf.Tensor = tf.dot(abstractEmbedding, queryEmbedding);
//         const lenAbstractEmbedding: tf.Tensor = tf.dot(abstractEmbedding, abstractEmbedding);
//         const lenQueryEmbedding: tf.Tensor = tf.dot(queryEmbedding, queryEmbedding);
//         const similarityScore: tf.Tensor = tf.div(dotProd, tf.mul(lenAbstractEmbedding,lenQueryEmbedding));
//         console.log(similarityScore)
//         return similarityScore.arraySync() as number; 
//     }catch{
//         throw "Error in calculating similarity score"
//     }
// }

