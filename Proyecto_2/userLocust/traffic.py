from locust import HttpUser, between, task
from random import randrange
import json

class readFile():
    def __init__(self):
        self.calificaciones = []

    def getData(self):
        size = len(self.calificaciones)
        if size > 0:
            index = randrange(0, size - 1) if size > 1 else 0
            return self.calificaciones.pop(index)
        else:
            print("size -> 0")
            return None

    def loadFile(self):
        try:
            with open("datos.json", 'r', encoding='utf-8') as file:
                self.calificaciones = json.loads(file.read())
        except Exception as e:
            print(f'Error: {e}')

class trafficData(HttpUser):
    wait_time = between(0.2, 0.9) # Tiempo de espera entre registros
    reader = readFile()
    reader.loadFile()

    def on_start(self):
        print("On Start")

    @task
    def sendMessage(self):
        data = self.reader.getData() # Registro obtenido de la lista
        if data is not None:
            res = self.client.post("/insert", json=data)
            response = res.json()
            print(response)
        else:
            print("Empty") # No hay más datos por enviar
            self.stop(True)
