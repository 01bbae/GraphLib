"use strict";
// import { Paper } from "../../express-server/src/Paper";
// import Parser from "stream-json/Parser.js";
// import { pipeline } from 'node:stream';
// import neo4j from 'neo4j-driver';
// import fetch from "node-fetch";
// import fs from "fs";
// import { readFileSync } from "node:fs";
// const parser = new Parser();
// const databasePath: string = "../dataset/arxiv-metadata-oai-snapshot.json";
// const databasePathEdited: string = "../dataset/arxiv-metadata-oai-snapshot-edited.json";
// const configPath: string = "./src/secrets.json"
// if (!fs.existsSync(configPath)){
//     throw "config path does not exist";
// }
// const secretsString = readFileSync(configPath, 'utf-8');
// const secrets = JSON.parse(secretsString);
// const user: string = secrets.user;
// const password: string = secrets.password;
// const uri: string = secrets.uri;
// let driver: any;
// let session: any;
// driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
// session = driver.session();
// try{
//     // const readDatabase:string = fs.readFileSync(databasePath, 'utf-8');
//     // const editedDatabase: string = readDatabase.substring(8);
//     // const writeDatabase: void  = fs.writeFileSync(databasePathEdited, editedDatabase, 'utf-8');
//     const ignoredChars: number = 7;
//     let numRead: number = 0;
//     pipeline(
//         fs.createReadStream(databasePath),
//         (data: any) => {
//             if (numRead < ignoredChars){
//                 numRead+=1;
//             }else{
//                 numRead+=1;
//                 return data;
//             }
//         },
//         parser,
//         (data: any) => {
//             create_papers_node(data);
//         }
//     );
//     // session.run("call apoc.load.json($path)", {path: databasePath});
//     createDatabase(databasePathEdited)
// }catch(err){
//     console.log("couldnt run command");
//     console.error(err);
// }
// async function createDatabase(database: string){
//     try{
//         await pipeline(
//             fs.createReadStream(database), 
//             parser, 
//             (data: any) => {
//                 // create_papers_node(data);
//                 console.log(data);
//             }
//         )
//     }catch(e){
//         console.log(e);
//     }
//     // const jsonstring = await readFile(databasePath, 'utf-8');
//     // JSON.parse(jsonstring);
// }
// async function create_papers_node(paper: Paper){
//     console.log(paper)
//     console.log("adding paper " + paper.id)
//     await session.run('MERGE (p:Paper {id: $id, submitter: $submitter, authors: $authors, title: $title, comments: $comments, journal_ref: $journal_ref, doi: $doi, report_no: $report_no, categories: $categories, license: $license, abstract: $abstract, versions: $versions, update_date: $update_date}) RETURN p ', {id: paper.id, submitter: paper.submitter, authors: paper.authors, title: paper.title, comments: paper.comments, journal_ref: paper.journal_ref, doi: paper.doi, report_no: paper.report_no, categories: paper.categories, license: paper.license, abstract: paper.abstract, versions: paper.versions, update_date: paper.update_date});
//     for (let author in paper.authors_parsed){
//         create_authors_node(paper,author);
//     }
//     create_topic_node(paper, paper.categories);
//     create_journal_node(paper, paper.journal_ref);
// }
// function create_authors_node(paper: Paper, author: string){
//     session.run('MERGE (a:Author {name1: $n1, name2: $n2, name3: $n3}) - [:AUTHOR_OF] -> (p:Paper) RETURN a ', {n1: author[0], n2: author[1], n3: author[2]});
// }
// function create_topic_node(paper: Paper, catagory: string){
//     session.run('MERGE (c:Catagory {catagory: $topic}) - [:Catagorizes] -> (p:Paper {}) RETURN c', {topic: catagory});
// }
// function create_journal_node(paper: Paper, journal_ref:string){
//     session.run('MERGE (p:Paper) - [:FEATURED_IN] -> (j:Journal {journal_ref: $journal}) RETURN j', {journal: journal_ref});
// }
// // FROM NEO4J website
// // function createDriver (virtualUri, user, password, addresses) {
// //     return neo4j.driver(virtualUri, neo4j.auth.basic(user, password), {
// //       resolver: address => addresses
// //     })
// //   }
// //   function addPerson (name) {
// //     const driver = createDriver('neo4j://x.acme.com', user, password, [
// //       'a.acme.com:7575',
// //       'b.acme.com:7676',
// //       'c.acme.com:8787'
// //     ])
// //     const session = driver.session({ defaultAccessMode: neo4j.WRITE })
// //     session
// //       .run('CREATE (n:Person { name: $name })', { name: name })
// //       .then(() => session.close())
// //       .then(() => driver.close())
// //   }
