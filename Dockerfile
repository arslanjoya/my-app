# Use lightweight Nginx image
FROM nginx:alpine

# Set working directory (default Nginx folder)
WORKDIR /usr/share/nginx/html

# Copy all repo files into Nginx html folder
COPY . .

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
