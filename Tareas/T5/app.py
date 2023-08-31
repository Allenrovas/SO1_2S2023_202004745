from flask import Flask, request
import os
import signal

app = Flask(__name__)

@app.route('/')
def hello():
    return'Hola mundo, 202004745.'



@app.route('/pid', methods=['GET'])
def pid():
    pid = os.getpid()
    return f'Proceso: {pid}'

@app.route('/pid', methods=['POST'])
def kill():
    data = request.json
    if 'pid' in data:
        try:
            pid = int(data['pid'])
            os.kill(pid, signal.SIGBUS)
            return f'Proceso {pid} eliminado.'
        except ValueError:
            return f'El PID debe ser un número entero.'
        except ProcessLookupError:
            return f'El proceso con PID {pid} no existe.'
        except Exception as e:
            return f'Error desconocido: {e}'
    else:
        return f'No se especificó el PID del proceso a eliminar.'



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
