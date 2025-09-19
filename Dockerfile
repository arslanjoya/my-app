# Use official nginx image
FROM nginx:alpine

# Copy static files into nginx html folder
COPY public/ /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
