# --- Stage 1: Build the React Application ---
FROM node:20 as build

# Set the working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build the app
COPY . .
# Assuming 'npm run build' generates static files into a 'dist' directory
RUN npm run build 

# --- Stage 2: Serve the Static Output with Nginx ---
FROM nginx:alpine

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom Nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# IMPORTANT: Copy the static build output from the build stage (Stage 1)
# The built files are located at /usr/src/app/dist inside the 'build' stage.
COPY --from=build /usr/src/app/dist /usr/share/nginx/html/frontend

# CRITICAL FIX: Ensure the files are owned by the Nginx user (default is 'nginx')
# This resolves permission issues that prevent Nginx from reading static files.
RUN chown -R nginx:nginx /usr/share/nginx/html

# Expose the default HTTP port (80)
EXPOSE 80

# The default CMD of nginx:alpine is to start Nginx
CMD ["nginx", "-g", "daemon off;"]