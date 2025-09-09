from flask import Flask
from flask_cors import CORS
import qcodes   # lowercase file name is better

app = Flask(__name__)
CORS(app)

# register blueprint
app.register_blueprint(qcodes.bp)

if __name__ == "__main__":
    app.run(debug=True, port=5001)
