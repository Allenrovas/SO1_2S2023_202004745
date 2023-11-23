# Utiliza la imagen de Python en Alpine como base
FROM python:3.9-alpine

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el archivo de requisitos (requirements.txt) a la imagen
COPY requirements.txt .

# Instala las dependencias de la aplicación
RUN pip install -r requirements.txt

# Copia el contenido de tu aplicación al directorio de trabajo en la imagen
COPY . .

# Expone el puerto en el que se ejecuta la aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["python", "apiRedis.py"]
