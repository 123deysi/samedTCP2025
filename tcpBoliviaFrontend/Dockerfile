FROM node:18

# Establece el directorio de trabajo
WORKDIR /app

# Copia y asegura instalación estable si hay package-lock.json
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copia el resto de la app
COPY . .

# Expone el puerto de desarrollo de React
EXPOSE 3000

# Comando para arrancar la app
CMD ["npm", "start"]
