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

    async createDatabase(database: string){
        try{
            await pipeline(
                fs.createReadStream(database),
                parser(), 
                (data: Paper) => {
                    this.create_papers_node(data)
                }
            )
            console.log("All database operations finished")
        }catch{
            console.log("error")
        }
    }

    async create_papers_node(this: any, paper: Paper){
        await this.#session.run('CREATE p:Paper {id: $id, submitter: $submitter, authors: $author, title: $title, comments: $comments, journal_ref: $journal_ref, doi: $doi, report_no: $report_no, catagories: $catagories, license: $license, abstract: $abstract, versions: $versions, update_date: $update_date} RETURN p ', paper);
        for (let author in paper.authors_parsed){
            this.create_authors_node(paper,author);
        }
        this.create_topic_node(paper, paper.categories);
        this.create_journal_node(paper, paper.journal_ref);
    }

    create_authors_node(paper: Paper, author: Array<string>){
        this.#session.run('CREATE a:Author {name1: $n1, name2: $n2, name3: $n3} - [:AUTHOR_OF] -> p:Paper RETURN a ', {n1: author[0], n2: author[1], n3: author[2]});
    }

    create_topic_node(paper: Paper, catagory: string){
        this.#session.run('CREATE c:Catagory {catagory: $topic} - [:Catagorizes] -> p:Paper RETURN c', {topic: catagory});
    }
    
    create_journal_node(paper: Paper, journal_ref:string){
        this.#session.run('CREATE p:Paper - [:FEATURED_IN] -> j:Journal {journal_ref: $journal} RETURN j', {journal: journal_ref});
    }
}