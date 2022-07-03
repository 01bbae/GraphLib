import { Paper } from "../../express-server/src/Paper";
import Parser from "stream-json/Parser.js";
import neo4j from 'neo4j-driver';
import { readFileSync } from "node:fs";
import fs from 'fs';

const configPath: string = "./src/secrets.json"
const dataPath: string = '../dataset/test/test.json';

let driver: any;
let session: any;

populateDatabase(dataPath, configPath)
async function populateDatabase(dataPath: string, configPath: string){
    try{
        if (!fs.existsSync(configPath)){
            throw "config path does not exist";
        }
        if (!fs.existsSync(dataPath)){
            throw "data path does not exist"
        }

        const data = readFileSync(dataPath, 'utf-8');
        const parsedjson: any = JSON.parse(data);
        parsedjson["journal_ref"] = parsedjson["journal-ref"];
        parsedjson["report_no"] = parsedjson["report-no"];
        delete parsedjson["journal-ref"];
        delete parsedjson["report-no"];
        if (parsedjson["license"] == null){
            // resolves merge conflicts with neo4j cypher dealing with null values
            parsedjson["license"] = '';
        }
        parsedjson as Paper

        const secretsString = readFileSync(configPath, 'utf-8');
        const secrets = JSON.parse(secretsString);
        const user: string = secrets.user;
        const password: string = secrets.password;
        const uri: string = secrets.uri;

        await createDatabase(parsedjson, uri, user, password)
        await closeSession(session);
    }catch(err){
        console.log("couldnt run command");
        console.error(err);
    }
}

async function createDatabase(database: Paper, uri: string, user: string, password: string){
    console.log('creating a database')
    try{
        driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
        await driver.verifyConnectivity()
        createSession(driver)
        console.log('database created')
        await create_papers_node(database)
    }catch(error){
        console.log(`connection failed ${error}`);
    }
}

async function createSession(driver: any){
    session = driver.session();
}

async function closeSession(session: any){
    await session.close();
    console.log('database session is closed')
}

async function create_papers_node(paper: Paper){
    console.log(paper)
    console.log("adding paper " + paper.id)


    await session.run(
        'MERGE (p:Paper {id: $id, submitter: $submitter, authors: $authors, title: $title, comments: $comments, journal_ref: $journal_ref, doi: $doi, report_no: $report_no, categories: $categories, license: $license, abstract: $abstract, update_date: $update_date}) RETURN p ', 
        {id: paper.id, submitter: paper.submitter, authors: paper.authors, title: paper.title, comments: paper.comments, journal_ref: paper.journal_ref, doi: paper.doi, report_no: paper.report_no, categories: paper.categories, license: paper.license, abstract: paper.abstract, update_date: paper.update_date}
    );
    // removed (versions: paper.versions) from Merge because Neo4j cant store list of objects
    for (let i=0; i<paper.authors_parsed.length; ++i){
        await create_authors_node(paper,paper.authors_parsed[i]);
    }
    await create_topic_node(paper, paper.categories);
    await create_journal_node(paper, paper.journal_ref);
}

function create_authors_node(paper: Paper, author: string[]){
    console.log('adding author: ' + author)
    return session.run(
        'MATCH (p:Paper) WHERE p.title = $title '
        + 'MERGE (a:Author {name1: $n1, name2: $n2, name3: $n3}) '
        + 'MERGE (a) - [:AUTHOR_OF] -> (p)', 
        {n1: author[0], n2: author[1], n3: author[2], title: paper.title}
    );
}

function create_topic_node(paper: Paper, catagory: string){
    console.log('adding topic: ' + catagory)
    return session.run(
        'MATCH (p:Paper) WHERE p.title = $title '
        + 'MERGE (c:Category {category: $categories}) '
        + 'MERGE (c) - [:Categorizes] -> (p)', 
        {categories: paper.categories, title: paper.title}
    );
}

function create_journal_node(paper: Paper, journal_ref:string){
    console.log('adding journal: ' + journal_ref)
    return session.run(
        'MATCH (p:Paper) WHERE p.title = $title '
        + 'MERGE (j:Journal {journal_ref: $journal}) '
        + 'MERGE (p) - [:FEATURED_IN] -> (j)', 
        {journal: journal_ref, title: paper.title}
    );
}

