FROM php:8.2-cli

# Instala dependencias
RUN apt-get update && apt-get install -y \
    git curl zip unzip libonig-dev libxml2-dev libzip-dev \
    && docker-php-ext-install pdo_mysql zip

# Instala Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Establece directorio de trabajo
WORKDIR /var/www

# Copia el código del proyecto
COPY . /var/www

# Permisos (opcional, depende tu sistema)
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www

# Expone puerto
EXPOSE 8000

# Comando que ejecuta Laravel
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
