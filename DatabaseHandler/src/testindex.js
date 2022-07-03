var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import neo4j from 'neo4j-driver';
import { readFileSync } from "node:fs";
import fs from 'fs';
const configPath = "./src/secrets.json";
const dataPath = '../dataset/test/test.json';
let driver;
let session;
populateDatabase(dataPath, configPath);
function populateDatabase(dataPath, configPath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!fs.existsSync(configPath)) {
                throw "config path does not exist";
            }
            if (!fs.existsSync(dataPath)) {
                throw "data path does not exist";
            }
            const data = readFileSync(dataPath, 'utf-8');
            const parsedjson = JSON.parse(data);
            parsedjson["journal_ref"] = parsedjson["journal-ref"];
            parsedjson["report_no"] = parsedjson["report-no"];
            delete parsedjson["journal-ref"];
            delete parsedjson["report-no"];
            if (parsedjson["license"] == null) {
                // resolves merge conflicts with neo4j cypher dealing with null values
                parsedjson["license"] = '';
            }
            parsedjson;
            const secretsString = readFileSync(configPath, 'utf-8');
            const secrets = JSON.parse(secretsString);
            const user = secrets.user;
            const password = secrets.password;
            const uri = secrets.uri;
            yield createDatabase(parsedjson, uri, user, password);
            yield closeSession(session);
        }
        catch (err) {
            console.log("couldnt run command");
            console.error(err);
        }
    });
}
function createDatabase(database, uri, user, password) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('creating a database');
        try {
            driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
            yield driver.verifyConnectivity();
            createSession(driver);
            console.log('database created');
            yield create_papers_node(database);
        }
        catch (error) {
            console.log(`connection failed ${error}`);
        }
    });
}
function createSession(driver) {
    return __awaiter(this, void 0, void 0, function* () {
        session = driver.session();
    });
}
function closeSession(session) {
    return __awaiter(this, void 0, void 0, function* () {
        yield session.close();
        console.log('database session is closed');
    });
}
function create_papers_node(paper) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(paper);
        console.log("adding paper " + paper.id);
        yield session.run('MERGE (p:Paper {id: $id, submitter: $submitter, authors: $authors, title: $title, comments: $comments, journal_ref: $journal_ref, doi: $doi, report_no: $report_no, categories: $categories, license: $license, abstract: $abstract, update_date: $update_date}) RETURN p ', { id: paper.id, submitter: paper.submitter, authors: paper.authors, title: paper.title, comments: paper.comments, journal_ref: paper.journal_ref, doi: paper.doi, report_no: paper.report_no, categories: paper.categories, license: paper.license, abstract: paper.abstract, update_date: paper.update_date });
        // removed (versions: paper.versions) from Merge because Neo4j cant store list of objects
        for (let i = 0; i < paper.authors_parsed.length; ++i) {
            yield create_authors_node(paper, paper.authors_parsed[i]);
        }
        yield create_topic_node(paper, paper.categories);
        yield create_journal_node(paper, paper.journal_ref);
    });
}
function create_authors_node(paper, author) {
    console.log('adding author: ' + author);
    return session.run('MATCH (p:Paper) WHERE p.title = $title '
        + 'MERGE (a:Author {name1: $n1, name2: $n2, name3: $n3}) '
        + 'MERGE (a) - [:AUTHOR_OF] -> (p)', { n1: author[0], n2: author[1], n3: author[2], title: paper.title });
}
function create_topic_node(paper, catagory) {
    console.log('adding topic: ' + catagory);
    return session.run('MATCH (p:Paper) WHERE p.title = $title '
        + 'MERGE (c:Category {category: $categories}) '
        + 'MERGE (c) - [:Categorizes] -> (p)', { categories: paper.categories, title: paper.title });
}
function create_journal_node(paper, journal_ref) {
    console.log('adding journal: ' + journal_ref);
    return session.run('MATCH (p:Paper) WHERE p.title = $title '
        + 'MERGE (j:Journal {journal_ref: $journal}) '
        + 'MERGE (p) - [:FEATURED_IN] -> (j)', { journal: journal_ref, title: paper.title });
}
