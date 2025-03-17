# Use an official base image
FROM mysql:9.2

# Environnement variables
ENV MYSQL_ROOT_PASSWORD=Hello78!4
ENV MYSQL_DATABASE=Epicerie
ENV MYSQL_USER=myuser
ENV MYSQL_PASSWORD=&fplop75

# Définir le répertoire de travail
WORKDIR /docker-entrypoint-initdb.d/

# Copy the database file into the container
COPY ../../schema.sql .

# Expose the port the app runs on
EXPOSE 3306