# Usa una imagen ligera de Node
FROM node:18

# Establece directorio de trabajo
WORKDIR /app

# Copia archivos de dependencias
COPY package*.json ./

# Instala dependencias
RUN npm install

# Instala "serve" para servir archivos estáticos
RUN npm install -g serve

# Copia el resto del proyecto
COPY . .

# Construye la aplicación para producción
RUN npm run build

# Expone el puerto en el que se sirve la app
EXPOSE 3000

# Usa "serve" para mostrar la app desde el directorio de build
CMD ["serve", "-s", "build", "-l", "3000"]
