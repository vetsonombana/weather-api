# Weather Api

A Simple weather API

# Usage

## Without Docker

### Installation and dev mode

To install the app without docker first create an env file

#### .env

```dosini
API_BASE_URL=https://api.weatherbit.io/v2.0
API_KEY=<YOUR_API_KEY>
REDIS_URL=<REDIS_URL>
PORT=8080
```

#### Commands

```bash
# install the dependencies
npm install
```

Next you will need to start in dev mod

```bash
# install the dependencies
npm run dev
```

### Production

In production you must add your env in your environments file  
After that you can directly run your project by using these commands

```bash
# Build the application
npm run build
# Start in production
npm start
```

## With Docker

With docker you need to create a .env.docker file

#### .env.docker

```dosini
API_BASE_URL=https://api.weatherbit.io/v2.0
API_KEY=<YOUR_API_KEY>
REDIS_URL=redis://cache:6379
PORT=8080
```

and run with this following command

```bash
# Run docker attached to the terminal
docker-compose up
# Run in detached
docker-compose up -d
```
