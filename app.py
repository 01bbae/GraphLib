from flask import Flask, request, redirect, url_for
# from db import DatabaseHandler
import json
import bs4

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
    createAPIRequest(query)

    # return redirect(url_for("redirect", query = query))
    return json.dumps({})


def createAPIRequest(query: str, numresult = 10: int, ):



# @app.route('/query/<query>')
# def redirect(query):
#     print("/query" + str(query))
#     return query


if __name__ == "__main__":
    app.run(debug=True)