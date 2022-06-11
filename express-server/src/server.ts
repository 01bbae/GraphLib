import express = require('express');
import { databaseSearch } from './SearchHandler';
import { Paper } from './SearchHandler';


const app = express();

const port:number = 5000;

app.listen(port,() => {
    console.log(`listening on ${port}`)  
});


app.get('/', (req, res) => {
    console.log("in /")
});

app.get('/query', async (req, res) => {
    console.log("in /query")
    console.log(req.query)
    if ( typeof req.query["query"] !=="string"){
        throw new Error("Query is not a string");
    }
    const query: string = req.query["query"];
    const listOfPapers: /*Array<Paper>*/ any = await databaseSearch(query);


    
})
