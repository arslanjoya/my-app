# Use lightweight Nginx image
FROM nginx:alpine

# Set working directory (optional, default in Nginx is /usr/share/nginx/html)
WORKDIR /usr/share/nginx/html

# Copy all files from the repo into Nginx html folder
COPY . .

# Expose port 80 to access the HTML page
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
