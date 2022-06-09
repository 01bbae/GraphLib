import express from 'express';
import tf = require('@tensorflow/tfjs');
import use = require('@tensorflow-models/universal-sentence-encoder');
import '@tensorflow/tfjs-node';
// const data = require('../../dataset/arxiv-metadata-oai-snapshot'); too big for importing
import fs = require('fs');
import { parentPort } from 'worker_threads';
require('stream-json');
const {parser} = require('stream-json/Parser');


const app = express();

const port:number = 5000;

app.listen(port,() => {
    console.log(`listening on ${port}`)  
});


app.get('/', (req, res) => {
    console.log("in /")
});

app.get('/query', (req, res) => {
    console.log("in /query")
    console.log(req.query)
    if ( typeof req.query["query"] !=="string"){
        throw new Error("Query is not a string");
    }
    const query: string = req.query["query"];

    // read data using stream
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
        authors_parsed: Array<Array<string>>
    }

    const model = use.load()

    // not sure what type this is
    const pipeline: any = fs.createReadStream('../../dataset/arxiv-metadata-oai-snapshot').pipe(parser());
    pipeline.on('data', (data: any)  => { //replace with type Paper for later
        const text: Array<string> = [data.abstract, query]
        model.then((usemodel: use.UniversalSentenceEncoder) =>{
            usemodel.embed(text).then((embeddings: tf.Tensor2D)=> {
                const abstractScore: number[] = embeddings.array().then((tensor: number[][]) => {
                    return tensor[0];
                });
                const queryScore: number[] = embeddings.array().then((tensor: number[][]) => {
                    return tensor[1];
                });
                const similarityScore = tf.dot(abstractScore, queryScore).div(tf.dot(abstractScore, abstractScore).mul(tf.dot(queryScore, queryScore)))
                res.send(embeddings);
            });
        });
    });
    pipeline.on('end', () => console.log("went through all objects"));


    

    
})
