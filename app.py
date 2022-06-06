from winreg import QueryInfoKey
from flask import Flask, request, redirect, url_for
# from db import DatabaseHandler
import json
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

@app.route('/')
def root():
    print("Root")
    return "Root"

# def createDB(config: dict) -> None:
#     db = db.DatabaseHandler(config["uri"], config["user"], config["password"])
#     db.test_connection()

@app.route('/query', methods=["GET"])
def createResponse():
    query = request.args.get("query")
    print("query = ", query)
    try:
        res = requests.get(createAPIRequest(query))
    except Exception as e:
        print(e)
        return "Server Error" # change error handling
    soup = BeautifulSoup(res.text, "xml")
    # print(soup.prettify())
    entries = soup.find_all("entry")
    print(entries)

    # return redirect(url_for("redirect", query = query))
    return res.text


def createAPIRequest(query: str, start: int = 0, numresult: int = 10) -> str:
    api_base = "http://export.arxiv.org/api/"
    method_name = "query"
    parameters = "search_query="
    api = api_base + method_name + "?" + parameters + query
    return api
    





# @app.route('/query/<query>')
# def redirect(query):
#     print("/query" + str(query))
#     return query


if __name__ == "__main__":
    app.run(debug=True)