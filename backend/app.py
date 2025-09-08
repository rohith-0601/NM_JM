from flask import Flask
from flask_cors import CORS
import Qcodes   # import directly since it's in same folder

app = Flask(__name__)
CORS(app)

# register blueprint from qcodes
app.register_blueprint(Qcodes.bp)

if __name__ == "__main__":
    app.run(debug=True)
