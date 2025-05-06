# Dockerfile
FROM mysql:8.0

# Copy the SQL file to initialize the database
COPY sauvegarde.sql /docker-entrypoint-initdb.d/
COPY 1_schema.sql /docker-entrypoint-initdb.d/
COPY 2_ajout_data.sql /docker-entrypoint-initdb.d/

EXPOSE 3306