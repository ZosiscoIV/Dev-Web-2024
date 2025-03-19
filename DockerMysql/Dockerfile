# Dockerfile
FROM mysql:9.2

# Copy the SQL file to initialize the database
COPY schema.sql /docker-entrypoint-initdb.d/
COPY ajout_data.sql /docker-entrypoint-initdb.d/

EXPOSE 3306