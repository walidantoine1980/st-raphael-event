# Stage 1: Build de l'application React avec Node 20
FROM node:20-alpine AS builder

WORKDIR /app

# Copie des fichiers de dépendances
COPY package.json package-lock.json* ./

# Installation propre des dépendances
RUN npm install

# Copie du code source
COPY . .

# Build de l'application Vite
RUN npm run build

# Stage 2: Serveur web ultra-léger (Nginx) pour servir les fichiers statiques
FROM nginx:alpine

# Copier la configuration Nginx personnalisée pour React (gestion du routage)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers construits depuis le builder vers le dossier Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Exposer le port 80 pour Dokploy
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
