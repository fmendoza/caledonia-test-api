FROM node:18.16.0-alpine as base

# Add package file
COPY package.json ./
COPY yarn.lock ./
COPY scripts/dev.sh ./scripts/dev.sh

# Install deps
RUN yarn install

# Copy source
COPY src ./src
COPY tsconfig.json ./tsconfig.json
COPY openapi.yml ./openapi.yml

# Build dist
RUN yarn build

# Start production image build
FROM node:18.16.0-alpine

ENV NODE_ENV=production
ENV APP_NAME='Caledonia API'
ENV PARSE_DASHBOARD_MOUNT=/
ENV PARSE_API_MOUNT=/api
ENV PARSE_API_APP_ID=appId
ENV PARSE_API_MASTER_KEY=masterKey
ENV PARSE_API_SERVER_URL=http://localhost
ENV PARSE_API_PUBLIC_SERVER_URL=https://caledonia.quanlabs.com
ENV CLOUD_CODE_MAIN=/cloud/main.js

# Copy node modules and build directory
COPY --from=base ./node_modules ./node_modules
COPY --from=base /dist /dist

# Copy static files
COPY src/public dist/src/public

CMD ["dist/src/server.js"]
