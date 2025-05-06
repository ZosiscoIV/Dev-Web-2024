# Étape 1 : Build de l'app Next.js
FROM node:18 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build  # Cest suffisant maintenant !

# Étape 2 : Serveur Nginx pour servir les fichiers statiques
FROM nginx:alpine
COPY --from=builder /app/out /usr/share/nginx/html

# Optionnel : ajoute ta config nginx perso
COPY nginx.conf /etc/nginx/nginx.conf

COPY default.conf /etc/nginx/conf.d/default.conf