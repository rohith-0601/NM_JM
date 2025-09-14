from flask import Flask
from flask_cors import CORS
import qcodes

app = Flask(__name__)
CORS(app)  # allow all origins for development

app.register_blueprint(qcodes.bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True, port=5001)
