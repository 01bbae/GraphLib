import express from 'express';
import tf = require('@tensorflow/tfjs');
import use = require('@tensorflow-models/universal-sentence-encoder');
import '@tensorflow/tfjs-node';
// const data = require('../../dataset/arxiv-metadata-oai-snapshot');
import fs = require('fs');
import { parentPort } from 'worker_threads';
// import readline = require('readline');
// import stream = require('stream');
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

    // not sure what type this is
    const pipeline: any = fs.createReadStream('../../dataset/arxiv-metadata-oai-snapshot').pipe(parser());
    pipeline.on('data', (data: any)  => { //replace with type Paper for later
        data.
    });
    pipeline.on('end', () => console.log("went through all objects"));


    use.load().then((model: use.UniversalSentenceEncoder) =>{
        const text: Array<string> = [query, "bot"]
        model.embed(text).then((embeddings: tf.Tensor2D)=> {
            embeddings.print();
            res.send(embeddings);
        });
    });
    

    
})
