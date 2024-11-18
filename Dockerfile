# Build stage
FROM node:20-alpine AS build

# Create and change to the app directory
WORKDIR /app

# Copy application dependency manifests to the container image
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# Copying this separately prevents re-running npm install on every code change
COPY package*.json .

# Install dependencies
RUN npm ci

# Copy local code to the container image
COPY . .

# Build the app
RUN npm run build

# ---

# Production stage
FROM node:20-alpine AS production

# Add environment variables
ENV HUSKY=0

# Create and change to the app directory
WORKDIR /app

# Copy application dependency manifests to the container image
COPY package*.json .

# Copy the prisma schema and migrations
# Copying this is necessary to generate the prisma client
# Prisma will try to generate the client after installing @prisma/client
# If the schema is not present, the client will not be generated
# Migration is also necessary in case we need to run migration on the entrypoint
COPY --from=build /app/src/utils/prisma ./src/utils/prisma

# Install dependencies
RUN npm ci --production

# Copy the entrypoint script
COPY entrypoint.sh .

# Copy the build output to the image
COPY --from=build /app/build ./build

# Run the web service on container startup
ENTRYPOINT ["./entrypoint.sh"]

# Expose port for documentation, but this can be overriden if env variable PORT is set
EXPOSE 4000
