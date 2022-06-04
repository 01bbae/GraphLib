from flask import Flask, request, redirect, url_for
from db import DatabaseHandler
import json
import bs4

app = Flask(__name__)

@app.route('/')
def root():
    print("Root")
    return "Root"

def createDB(config: dict) -> None:
    db = db.DatabaseHandler(config["uri"], config["user"], config["password"])
    db.test_connection()

@app.route('/query', methods=["GET"])
def query():
    query = request.form["query"]
    config = json.load(open("dbconfig.json","r"))

    print("/query")
    return redirect(url_for("redirect", query = query))

@app.route('/query/<query>')
def redirect(query):
    print("/query" + str(query))
    return query


if __name__ == "__main__":
    app.run(debug=True)