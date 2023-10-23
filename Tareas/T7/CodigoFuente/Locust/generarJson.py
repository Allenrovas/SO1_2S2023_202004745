import json
import random


def generar_carnet():
    anio = random.choice([2019, 2020, 2021, 2022, 2023])
    numeros_aleatorios = random.randint(10000, 99999)
    carnet = f"{anio}{numeros_aleatorios}"
    return int(carnet)

def generar_nombre():
    nombres = ['Juan', 'Maria', 'Pedro', 'Luis', 'Ana', 'Laura', 'Carlos', 'Sofia']
    return random.choice(nombres)

def generar_curso():
    cursos = ['SO1', 'LFP', 'BD1', 'SA', 'AYD1']
    return random.choice(cursos)

def generar_nota():
    return random.choice([50, 60, 70, 80, 90, 100])

def generar_semestre():
    return random.choice(['1S', '2S'])

def generar_json():
    data = {
        "Carnet": generar_carnet(),
        "Nombre": generar_nombre(),
        "Curso": generar_curso(),
        "Nota": generar_nota(),
        "Semestre": generar_semestre(),
        "Year": 2023
    }
    return data

def generar_archivo_json(cantidad, nombre_archivo):
    jsons = []
    for _ in range(cantidad):
        jsons.append(generar_json())

    with open(nombre_archivo, 'w') as file:
        json.dump(jsons, file, indent=4)

# Llama a la función para generar 10 JSONs y guárdalos en un archivo llamado "datos.json"
generar_archivo_json(1000, "datos.json")
