import { Paper } from "./SearchHandler";
import fs = require("fs");
const { parser } = require("stream-json/Parser");
const { pipeline } = require('node:stream');
const neo4j = require('neo4j-driver');
const secrets = require('../../secrets.json')

export class DatabaseHandler {
    #session: any; //TODO: Fix types
    #driver: any;
    constructor(uri: string, user: string, password:string){
        this.#driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
        this.#session = this.#driver.session()
    }

    createDatabase(database: string){
        try{
            await pipeline(
                fs.createReadStream(database),
                parser(), 
                async (data: Paper) => {
                    this.create_papers_node(data)
                }
            )
        }    
    }

    create_papers_node(this: any, paper: Paper){
        this.session.run(`CREATE p:Paper {
            id:$id,
            submitter:$submitter,
            authors: $author,
            title: $title,
            comments: $comments,
            journal_ref: $journal_ref,
            doi: $doi,
            report_no: $report_no,
            catagories: $catagories,
            license: $license,
            abstract: $abstract,
            versions: $versions,
            update_date: $update_date,
            authors_parsed: $authors_parsed
        } RETURN p `,
            
    )


    }

    create_authors_node(){

    }
}