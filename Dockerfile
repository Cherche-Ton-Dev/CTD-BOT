FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package data
COPY package.json ./
COPY yarn.lock ./

# Install packages
RUN yarn install --frozen-lockfile

# Load code
COPY . .

# Build code
RUN yarn build


# Start the app
CMD [ "yarn", "start" ]
