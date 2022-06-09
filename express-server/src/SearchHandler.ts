import tf = require("@tensorflow/tfjs");
import use = require("@tensorflow-models/universal-sentence-encoder");
import "@tensorflow/tfjs-node";
// const data = require('../../dataset/arxiv-metadata-oai-snapshot'); too big for importing
import fs = require("fs");
require("stream-json");
const { parser } = require("stream-json/Parser");

export async function databaseSearch(query: string) {
    const model: use.UniversalSentenceEncoder = await use.load();
    // not sure what type this is
    const pipeline: any = fs.createReadStream("../../dataset/arxiv-metadata-oai-snapshot").pipe(parser());
    const data: Paper = await pipeline.on("data", async (data: Paper) => {
        const text: Array<string> = [data.abstract, query];
        const embedding: tf.Tensor2D = await model.embed(text);
        const tensor: number[][] = await embedding.array()
        const abstractEmbedding: number[] = tensor[0];
        const queryEmbedding: number[] = tensor[1];
        
        /*
        *
        * Calculating cosine similarity score
        * 
        * 
        */
        const dotProd: tf.Tensor = tf.dot(abstractEmbedding, queryEmbedding);
        const lenAbstractEmbedding: tf.Tensor = tf.dot(abstractEmbedding, abstractEmbedding);
        const lenQueryEmbedding: tf.Tensor = tf.dot(queryEmbedding, queryEmbedding);
        const similarityScore: tf.Tensor = tf.div(dotProd, tf.mul(lenAbstractEmbedding,lenQueryEmbedding));


    });

  pipeline.on("end", () => console.log("went through all objects"));



  // declaring type
  type Paper = {
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
}
