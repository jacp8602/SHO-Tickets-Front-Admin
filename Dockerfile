# Utiliza una imagen ligera de Nginx como base para servir la aplicación Angular
FROM nginx:alpine

# Copia el archivo de configuración personalizado al contenedor
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia los archivos construidos de la aplicación desde el contenedor 'builder' al contenedor actual
COPY index.html /usr/share/nginx/html/

# Expone el puerto 80 para que pueda ser accesible desde el host
EXPOSE 80

# Comando para iniciar el servidor Nginx y servir la aplicación Angular
CMD ["nginx", "-g", "daemon off;"]
