# AgentForge Docker Hub Image

Starts AgentForge from [DockerHub Image](https://hub.docker.com/r/AgentForgeai/AgentForge)

## Usage

1. Create `.env` file and specify the `PORT` (refer to `.env.example`)
2. `docker compose up -d`
3. Open [http://localhost:3000](http://localhost:3000)
4. You can bring the containers down by `docker compose stop`

## 🔒 Authentication

1. Create `.env` file and specify the `PORT`, `AgentForge_USERNAME`, and `AgentForge_PASSWORD` (refer to `.env.example`)
2. Pass `AgentForge_USERNAME` and `AgentForge_PASSWORD` to the `docker-compose.yml` file:
    ```
    environment:
        - PORT=${PORT}
        - AgentForge_USERNAME=${AgentForge_USERNAME}
        - AgentForge_PASSWORD=${AgentForge_PASSWORD}
    ```
3. `docker compose up -d`
4. Open [http://localhost:3000](http://localhost:3000)
5. You can bring the containers down by `docker compose stop`

## 🌱 Env Variables

If you like to persist your data (flows, logs, apikeys, credentials), set these variables in the `.env` file inside `docker` folder:

-   DATABASE_PATH=/root/.AgentForge
-   APIKEY_PATH=/root/.AgentForge
-   LOG_PATH=/root/.AgentForge/logs
-   SECRETKEY_PATH=/root/.AgentForge
-   BLOB_STORAGE_PATH=/root/.AgentForge/storage

AgentForge also support different environment variables to configure your instance. Read [more](https://docs.AgentForgeai.com/environment-variables)
