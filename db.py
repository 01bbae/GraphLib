from neo4j import GraphDatabase
from neo4j.exceptions import ServiceUnavailable


class DatabaseHandler:
    def init(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

    # def test_connection(self):
    #     # self.driver.
    
    # def create_author_node(self, name, org):
    #     # add person
    #     self.run("CREATE (a:Author {name: $name, org = $org})", name = name, org = org)
    
