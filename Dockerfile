FROM node:20-alpine

# Add environment variables
ENV HUSKY=0
ENV NODE_ENV=production

# Create and change to the app directory.
WORKDIR /app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

# Install dependencies.
RUN npm ci --production

# Copy local code to the container image.
COPY . ./

# Generate prisma client
RUN npm run db:generate

# Run the web service on container startup.
ENTRYPOINT ["./entrypoint.sh"]

# Expose port for documentation, but this can be overriden if env variable PORT is set
EXPOSE 4000
