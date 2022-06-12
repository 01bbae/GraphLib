"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _DatabaseHandler_session, _DatabaseHandler_driver;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseHandler = void 0;
const fs = require("fs");
const { parser } = require("stream-json/Parser");
const { pipeline } = require('node:stream');
const neo4j = require('neo4j-driver');
const secrets = require('../../secrets.json');
class DatabaseHandler {
    constructor(uri, user, password) {
        _DatabaseHandler_session.set(this, void 0); //TODO: Fix types
        _DatabaseHandler_driver.set(this, void 0);
        __classPrivateFieldSet(this, _DatabaseHandler_driver, neo4j.driver(uri, neo4j.auth.basic(user, password)), "f");
        __classPrivateFieldSet(this, _DatabaseHandler_session, __classPrivateFieldGet(this, _DatabaseHandler_driver, "f").session(), "f");
    }
    createDatabase(database) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield pipeline(fs.createReadStream(database), parser(), (data) => {
                    this.create_papers_node(data);
                });
                console.log("All database operations finished");
            }
            catch (_a) {
                console.log("error");
            }
        });
    }
    create_papers_node(paper) {
        return __awaiter(this, void 0, void 0, function* () {
            yield __classPrivateFieldGet(this, _DatabaseHandler_session, "f").run('CREATE p:Paper {id: $id, submitter: $submitter, authors: $author, title: $title, comments: $comments, journal_ref: $journal_ref, doi: $doi, report_no: $report_no, catagories: $catagories, license: $license, abstract: $abstract, versions: $versions, update_date: $update_date} RETURN p ', paper);
            for (let author in paper.authors_parsed) {
                this.create_authors_node(paper, author);
            }
            this.create_topic_node(paper, paper.categories);
        });
    }
    create_authors_node(paper, author) {
        __classPrivateFieldGet(this, _DatabaseHandler_session, "f").run('CREATE a:Author {name1: $n1, name2: $n2, name3: $n3} - [:AUTHOR_OF] -> p:Paper RETURN a ', { n1: author[0], n2: author[1], n3: author[2] });
    }
    create_topic_node(paper, catagory) {
        __classPrivateFieldGet(this, _DatabaseHandler_session, "f").run('CREATE c:Catagory {catagory: $topic} - [:Catagorizes] -> p:Paper RETURN c', { topic: catagory });
    }
    create_journal_node(paper, journal_ref) {
        __classPrivateFieldGet(this, _DatabaseHandler_session, "f").run('CREATE p:Paper - [:FEATURED_IN] -> j:Journal {journal_ref: $journal} RETURN j', { journal: journal_ref });
    }
}
exports.DatabaseHandler = DatabaseHandler;
_DatabaseHandler_session = new WeakMap(), _DatabaseHandler_driver = new WeakMap();
