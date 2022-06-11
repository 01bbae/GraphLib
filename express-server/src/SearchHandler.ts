import tf = require("@tensorflow/tfjs");
import use = require("@tensorflow-models/universal-sentence-encoder");
import "@tensorflow/tfjs-node";
import fs = require("fs");
require("stream-json");
const { parser } = require("stream-json/Parser");

export class PaperScore {
    data: Paper;
    score: number;
    constructor(data: Paper, score: number){
        this.data = data;
        this.score = score;
    }
    
}

export async function databaseSearch(query: string) {
    const model: use.UniversalSentenceEncoder = await use.load();

    // FIXME: figure out what type this is
    const pipeline: any = fs.createReadStream("../../dataset/arxiv-metadata-oai-snapshot").pipe(parser());
    const data: Paper = await pipeline.on("data", async (data: Paper) => {
        const text: Array<string> = [data.abstract, query];
        const embedding: tf.Tensor2D = await model.embed(text);
        const tensor: number[][] = await embedding.array()
        const abstractEmbedding: Array<number> = tensor[0];
        const queryEmbedding: Array<number> = tensor[1];
        
        const listOfPapers: Array<PaperScore> = []
        const maxLength = 10

        const cosineSimilarity: number = calculateCosineSimilarity(abstractEmbedding, queryEmbedding);
        const currentPaper:PaperScore = new PaperScore(data, cosineSimilarity);
        if (listOfPapers.length > maxLength){
            let lowestScore = listOfPapers[maxLength-1].score;
            let highestScore = listOfPapers[0].score;
            if (cosineSimilarity > highestScore){
                listOfPapers.unshift(currentPaper)
            }else if (cosineSimilarity < highestScore && cosineSimilarity > lowestScore){
                // find index in between using binary search
                let low: number = 0;
                let high: number = maxLength - 1;
                let mid: number = 0;
                while (low <= high){
                    mid = Math.floor((low + high) / 2);
                    if (listOfPapers[mid].score < currentPaper.score){
                        low = mid + 1;
                    }else if (listOfPapers[mid].score > currentPaper.score){
                        high = mid - 1;
                    }
                }
                if (listOfPapers[mid].score > currentPaper.score){
                    listOfPapers.pop()
                    const tmp = listOfPapers.splice(mid, 0, currentPaper)
                    listOfPapers.
                }else{

                }
                
            }
        }else{
            listOfPapers.push(new PaperScore(data, cosineSimilarity))
        }




    });

  pipeline.on("end", () => console.log("went through all objects"));

}

function calculateCosineSimilarity(abstractEmbedding: tf.Tensor | Array<number>, queryEmbedding: tf.Tensor | Array<number>): number{
    const dotProd: tf.Tensor = tf.dot(abstractEmbedding, queryEmbedding);
    const lenAbstractEmbedding: tf.Tensor = tf.dot(abstractEmbedding, abstractEmbedding);
    const lenQueryEmbedding: tf.Tensor = tf.dot(queryEmbedding, queryEmbedding);
    const similarityScore: tf.Tensor = tf.div(dotProd, tf.mul(lenAbstractEmbedding,lenQueryEmbedding));
    return similarityScore
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
