from flask import Flask, request, jsonify
import simplejson as json
import redis
from flask_cors import CORS
import mysql.connector
from dotenv import load_dotenv
import os


app = Flask(__name__)
CORS(app)
load_dotenv()
configMySQL = {
    'user': os.getenv("MYSQL_USER"),
    'password': os.getenv("MYSQL_PASSWORD"),
    'host': os.getenv("MYSQL_HOST"),
    'database': os.getenv("MYSQL_DATABASE")
}

configRedis = {
    'host': os.getenv("REDIS_HOST"),
    'db': os.getenv("REDIS_DB")
}

port = os.getenv("PORT")

redis_client = redis.StrictRedis(host=configRedis['host'], port=6379, db=configRedis['db'])
pool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name = "pynative_pool",
    host = configMySQL['host'],
    database = configMySQL['database'],
    user = configMySQL['user'],
    password = configMySQL['password'],
    pool_size = 25,
    port = 3306
)


class Nota:
    def __init__(self, carnet,nombre,curso,nota,semestre,year):
        self.carnet = carnet
        self.nombre = nombre
        self.curso = curso
        self.nota = nota
        self.semestre = semestre
        self.year = year


def obtenerConexion():
    return pool.get_connection()

@app.route('/', methods=['GET'])
def index():
    return 'Hello World'

@app.route('/insert',methods=['POST'])
def insertar():
    data = request.json
    nota = Nota(
        data['carnet'],
        data['nombre'],
        data['curso'],
        data['nota'],
        data['semestre'],
        data['year']
    )
    print(data['carnet'],data['nombre'],data['curso'],data['nota'],data['semestre'],data['year'])

    #Voto en redis
    json_nota = {
            "carnet": nota.carnet,
            "nombre": nota.nombre,
            "curso": nota.curso,
            "nota": nota.nota,
            "semestre": nota.semestre,
            "year": nota.year
        }
    
    contador = redis_client.incr("contador_votos")
    key = f"nota{contador}"
    json_nota_str = json.dumps(json_nota)
    redis_client.hset("notas",key, json_nota_str)

    conexion = obtenerConexion()
    cursor = conexion.cursor()
    insert_query = "INSERT INTO nota (carnet, nombre, curso, nota, semestre, anio) VALUES (%s, %s, %s, %s, %s, %s)"
    insert_data = (nota.carnet, nota.nombre, nota.curso, nota.nota, nota.semestre, nota.year)
    cursor.execute(insert_query, insert_data)
    conexion.commit()
    cursor.close()
    conexion.close()

    print("Nota Registrada en redis y MySQL: ",nota.carnet)
    return f"¡Gracias por votar! ({contador} votos registrados)", 200



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)