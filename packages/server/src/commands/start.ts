import { Command, Flags } from '@oclif/core'
import path from 'path'
import * as Server from '../index'
import * as DataSource from '../DataSource'
import dotenv from 'dotenv'
import logger from '../utils/logger'

dotenv.config({ path: path.join(__dirname, '..', '..', '.env'), override: true })

enum EXIT_CODE {
    SUCCESS = 0,
    FAILED = 1
}
let processExitCode = EXIT_CODE.SUCCESS

export default class Start extends Command {
    static args = []
    static flags = {
        AgentForge_USERNAME: Flags.string(),
        AgentForge_PASSWORD: Flags.string(),
        AgentForge_FILE_SIZE_LIMIT: Flags.string(),
        PORT: Flags.string(),
        CORS_ORIGINS: Flags.string(),
        IFRAME_ORIGINS: Flags.string(),
        DEBUG: Flags.string(),
        BLOB_STORAGE_PATH: Flags.string(),
        APIKEY_STORAGE_TYPE: Flags.string(),
        APIKEY_PATH: Flags.string(),
        SECRETKEY_PATH: Flags.string(),
        AgentForge_SECRETKEY_OVERWRITE: Flags.string(),
        LOG_PATH: Flags.string(),
        LOG_LEVEL: Flags.string(),
        TOOL_FUNCTION_BUILTIN_DEP: Flags.string(),
        TOOL_FUNCTION_EXTERNAL_DEP: Flags.string(),
        NUMBER_OF_PROXIES: Flags.string(),
        DISABLE_CHATFLOW_REUSE: Flags.string(),
        DATABASE_TYPE: Flags.string(),
        DATABASE_PATH: Flags.string(),
        DATABASE_PORT: Flags.string(),
        DATABASE_HOST: Flags.string(),
        DATABASE_NAME: Flags.string(),
        DATABASE_USER: Flags.string(),
        DATABASE_PASSWORD: Flags.string(),
        DATABASE_SSL: Flags.string(),
        DATABASE_SSL_KEY_BASE64: Flags.string(),
        LANGCHAIN_TRACING_V2: Flags.string(),
        LANGCHAIN_ENDPOINT: Flags.string(),
        LANGCHAIN_API_KEY: Flags.string(),
        LANGCHAIN_PROJECT: Flags.string(),
        DISABLE_AgentForge_TELEMETRY: Flags.string(),
        MODEL_LIST_CONFIG_JSON: Flags.string(),
        STORAGE_TYPE: Flags.string(),
        S3_STORAGE_BUCKET_NAME: Flags.string(),
        S3_STORAGE_ACCESS_KEY_ID: Flags.string(),
        S3_STORAGE_SECRET_ACCESS_KEY: Flags.string(),
        S3_STORAGE_REGION: Flags.string(),
        S3_ENDPOINT_URL: Flags.string(),
        S3_FORCE_PATH_STYLE: Flags.string(),
        SHOW_COMMUNITY_NODES: Flags.string()
    }

    async stopProcess() {
        logger.info('Shutting down AgentForge...')
        try {
            // Shut down the app after timeout if it ever stuck removing pools
            setTimeout(() => {
                logger.info('AgentForge was forced to shut down after 30 secs')
                process.exit(processExitCode)
            }, 30000)

            // Removing pools
            const serverApp = Server.getInstance()
            if (serverApp) await serverApp.stopApp()
        } catch (error) {
            logger.error('There was an error shutting down AgentForge...', error)
        }
        process.exit(processExitCode)
    }

    async run(): Promise<void> {
        process.on('SIGTERM', this.stopProcess)
        process.on('SIGINT', this.stopProcess)

        // Prevent throw new Error from crashing the app
        // TODO: Get rid of this and send proper error message to ui
        process.on('uncaughtException', (err) => {
            logger.error('uncaughtException: ', err)
        })

        process.on('unhandledRejection', (err) => {
            logger.error('unhandledRejection: ', err)
        })

        const { flags } = await this.parse(Start)

        if (flags.PORT) process.env.PORT = flags.PORT
        if (flags.CORS_ORIGINS) process.env.CORS_ORIGINS = flags.CORS_ORIGINS
        if (flags.IFRAME_ORIGINS) process.env.IFRAME_ORIGINS = flags.IFRAME_ORIGINS
        if (flags.DEBUG) process.env.DEBUG = flags.DEBUG
        if (flags.NUMBER_OF_PROXIES) process.env.NUMBER_OF_PROXIES = flags.NUMBER_OF_PROXIES
        if (flags.DISABLE_CHATFLOW_REUSE) process.env.DISABLE_CHATFLOW_REUSE = flags.DISABLE_CHATFLOW_REUSE
        if (flags.SHOW_COMMUNITY_NODES) process.env.SHOW_COMMUNITY_NODES = flags.SHOW_COMMUNITY_NODES

        // Authorization
        if (flags.AgentForge_USERNAME) process.env.AgentForge_USERNAME = flags.AgentForge_USERNAME
        if (flags.AgentForge_PASSWORD) process.env.AgentForge_PASSWORD = flags.AgentForge_PASSWORD
        if (flags.APIKEY_STORAGE_TYPE) process.env.APIKEY_STORAGE_TYPE = flags.APIKEY_STORAGE_TYPE
        if (flags.APIKEY_PATH) process.env.APIKEY_PATH = flags.APIKEY_PATH

        // API Configuration
        if (flags.AgentForge_FILE_SIZE_LIMIT) process.env.AgentForge_FILE_SIZE_LIMIT = flags.AgentForge_FILE_SIZE_LIMIT

        // Credentials
        if (flags.SECRETKEY_PATH) process.env.SECRETKEY_PATH = flags.SECRETKEY_PATH
        if (flags.AgentForge_SECRETKEY_OVERWRITE) process.env.AgentForge_SECRETKEY_OVERWRITE = flags.AgentForge_SECRETKEY_OVERWRITE

        // Logs
        if (flags.LOG_PATH) process.env.LOG_PATH = flags.LOG_PATH
        if (flags.LOG_LEVEL) process.env.LOG_LEVEL = flags.LOG_LEVEL

        // Tool functions
        if (flags.TOOL_FUNCTION_BUILTIN_DEP) process.env.TOOL_FUNCTION_BUILTIN_DEP = flags.TOOL_FUNCTION_BUILTIN_DEP
        if (flags.TOOL_FUNCTION_EXTERNAL_DEP) process.env.TOOL_FUNCTION_EXTERNAL_DEP = flags.TOOL_FUNCTION_EXTERNAL_DEP

        // Database config
        if (flags.DATABASE_TYPE) process.env.DATABASE_TYPE = flags.DATABASE_TYPE
        if (flags.DATABASE_PATH) process.env.DATABASE_PATH = flags.DATABASE_PATH
        if (flags.DATABASE_PORT) process.env.DATABASE_PORT = flags.DATABASE_PORT
        if (flags.DATABASE_HOST) process.env.DATABASE_HOST = flags.DATABASE_HOST
        if (flags.DATABASE_NAME) process.env.DATABASE_NAME = flags.DATABASE_NAME
        if (flags.DATABASE_USER) process.env.DATABASE_USER = flags.DATABASE_USER
        if (flags.DATABASE_PASSWORD) process.env.DATABASE_PASSWORD = flags.DATABASE_PASSWORD
        if (flags.DATABASE_SSL) process.env.DATABASE_SSL = flags.DATABASE_SSL
        if (flags.DATABASE_SSL_KEY_BASE64) process.env.DATABASE_SSL_KEY_BASE64 = flags.DATABASE_SSL_KEY_BASE64

        // Langsmith tracing
        if (flags.LANGCHAIN_TRACING_V2) process.env.LANGCHAIN_TRACING_V2 = flags.LANGCHAIN_TRACING_V2
        if (flags.LANGCHAIN_ENDPOINT) process.env.LANGCHAIN_ENDPOINT = flags.LANGCHAIN_ENDPOINT
        if (flags.LANGCHAIN_API_KEY) process.env.LANGCHAIN_API_KEY = flags.LANGCHAIN_API_KEY
        if (flags.LANGCHAIN_PROJECT) process.env.LANGCHAIN_PROJECT = flags.LANGCHAIN_PROJECT

        // Telemetry
        if (flags.DISABLE_AgentForge_TELEMETRY) process.env.DISABLE_AgentForge_TELEMETRY = flags.DISABLE_AgentForge_TELEMETRY

        // Model list config
        if (flags.MODEL_LIST_CONFIG_JSON) process.env.MODEL_LIST_CONFIG_JSON = flags.MODEL_LIST_CONFIG_JSON

        // Storage
        if (flags.STORAGE_TYPE) process.env.STORAGE_TYPE = flags.STORAGE_TYPE
        if (flags.BLOB_STORAGE_PATH) process.env.BLOB_STORAGE_PATH = flags.BLOB_STORAGE_PATH
        if (flags.S3_STORAGE_BUCKET_NAME) process.env.S3_STORAGE_BUCKET_NAME = flags.S3_STORAGE_BUCKET_NAME
        if (flags.S3_STORAGE_ACCESS_KEY_ID) process.env.S3_STORAGE_ACCESS_KEY_ID = flags.S3_STORAGE_ACCESS_KEY_ID
        if (flags.S3_STORAGE_SECRET_ACCESS_KEY) process.env.S3_STORAGE_SECRET_ACCESS_KEY = flags.S3_STORAGE_SECRET_ACCESS_KEY
        if (flags.S3_STORAGE_REGION) process.env.S3_STORAGE_REGION = flags.S3_STORAGE_REGION
        if (flags.S3_ENDPOINT_URL) process.env.S3_ENDPOINT_URL = flags.S3_ENDPOINT_URL
        if (flags.S3_FORCE_PATH_STYLE) process.env.S3_FORCE_PATH_STYLE = flags.S3_FORCE_PATH_STYLE

        await (async () => {
            try {
                logger.info('Starting AgentForge...')
                await DataSource.init()
                await Server.start()
            } catch (error) {
                logger.error('There was an error starting AgentForge...', error)
                processExitCode = EXIT_CODE.FAILED
                // @ts-ignore
                process.emit('SIGINT')
            }
        })()
    }
}
