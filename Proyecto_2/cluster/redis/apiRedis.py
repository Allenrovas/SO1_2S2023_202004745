from flask import Flask, request, jsonify
import simplejson as json
import redis
from flask_cors import CORS
import mysql.connector


app = Flask(__name__)
CORS(app)
redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)
mysql_connection = mysql.connector.connect(
    host='localhost',
    user='root',
    password='secret',
    database='so1_pr2'
)

class Nota:
    def __init__(self, Carnet,Nombre,Curso,Nota,Semestre,Year):
        self.Carnet = Carnet
        self.Nombre = Nombre
        self.Curso = Curso
        self.Nota = Nota
        self.Semestre = Semestre
        self.Year = Year


@app.route('/', methods=['GET'])
def index():
    return 'Hello World'

@app.route('/insert',methods=['POST'])
def insertar():
    data = request.json
    nota = Nota(
        data['Carnet'],
        data['Nombre'],
        data['Curso'],
        data['Nota'],
        data['Semestre'],
        data['Year']
    )

    #Voto en redis
    json_nota = {
            "Carnet": nota.Carnet,
            "Nombre": nota.Nombre,
            "Curso": nota.Curso,
            "Nota": nota.Nota,
            "Semestre": nota.Semestre,
            "Year": nota.Year
        }
    
    contador = redis_client.incr("contador_votos")
    key = f"nota{contador}"
    json_nota_str = json.dumps(json_nota)
    redis_client.set(key, json_nota_str)

    cursor = mysql_connection.cursor()
    insert_query = "INSERT INTO nota (Carnet, Nombre, Curso, Nota, Semestre, Year) VALUES (%s, %s, %s, %s, %s, %s)"
    insert_data = (nota.Carnet, nota.Nombre, nota.Curso, nota.Nota, nota.Semestre, nota.Year)
    cursor.execute(insert_query, insert_data)
    mysql_connection.commit()
    cursor.close()

    print("Nota Registrada en redis y MySQL: ",nota.Carnet)
    return f"¡Gracias por votar! ({contador} votos registrados)", 200



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3300, debug=True)