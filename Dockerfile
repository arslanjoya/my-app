# Base image: 
FROM nginx:alpine

# project code (HTML/CSS/JS) 
COPY . /usr/share/nginx/html

# Nginx server port expose
EXPOSE 80

# Nginx start command
CMD ["nginx", "-g", "daemon off;"]
