from flask import Flask, request
import os
import signal

app = Flask(__name__)

@app.route('/')
def hello():
    return'Hola mundo, 202004745.'





if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
