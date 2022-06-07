from neo4j import GraphDatabase
from neo4j.exceptions import ServiceUnavailable
from typing import List


class DatabaseHandler:
    def init(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

    def create_author_node(self, name: List[str]):
        # add person
        self.run("CREATE (a:Author {name: $name})", name = name)

    def create_paper_node(self, paper: dict[str, str], org):
        # add paper
        id = paper["id"]
        submitter = paper["submitter"]
        title = paper["title"]
        comments = paper["comments"]
        journal_ref = paper["journal-ref"]
        doi = paper["doi"]
        report_no = paper["report-no"]
        catagories = paper["catagories"]
        self.run("CREATE (a:Paper {paper: $paper, org = $pap})", paper = paper, org = org)
        for authors in paper["authors_parsed"]:
            self.create_author_node(authors)
    

