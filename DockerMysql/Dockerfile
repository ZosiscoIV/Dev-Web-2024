# Dockerfile
FROM mysql:8.0

# Copy the SQL file to initialize the database
COPY sauvegarde.sql /docker-entrypoint-initdb.d/

EXPOSE 3306
