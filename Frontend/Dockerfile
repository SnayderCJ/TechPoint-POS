# Usamos una imagen de Node.js para construir la app
FROM node:22-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos las librerías
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto que usa Vite
EXPOSE 5173

# Comando para arrancar en modo desarrollo
CMD ["npm", "run", "dev", "--", "--host"]