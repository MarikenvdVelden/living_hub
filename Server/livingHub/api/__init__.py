
from flask import Flask
from flask_cors import CORS

from livingHub.api.common import MyJSONEncoder
from livingHub.api.query import app_query
from livingHub.api.users import app_users
from livingHub.api.index import app_index

app = Flask(__name__)
app.json_encoder = MyJSONEncoder
CORS(app)
app.register_blueprint(app_index)
app.register_blueprint(app_query)
app.register_blueprint(app_users)
