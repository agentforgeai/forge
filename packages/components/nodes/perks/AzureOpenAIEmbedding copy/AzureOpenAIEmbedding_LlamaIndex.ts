import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses, getCredentialData, getCredentialParam } from '../../../src/utils'
import { OpenAIEmbedding } from 'llamaindex'

interface AzureOpenAIConfig {
    apiKey?: string
    endpoint?: string
    apiVersion?: string
    deploymentName?: string
}

class AzureOpenAIEmbedding_LlamaIndex_Embeddings implements INode {
    label: string
    name: string
    version: number
    type: string
    icon: string
    category: string
    description: string
    baseClasses: string[]
    credential: INodeParams
    tags: string[]
    inputs: INodeParams[]

    constructor() {
        this.label = 'Discord Access'
        this.name = 'DiscordAccess'
        this.version = 1.0
        this.type = 'Perks'
        this.icon = 'Azure.svg'
        this.category = 'Perks'
        this.description =
            'Discord’s API provides developers with powerful tools to create bots, integrate applications, and automate server management through RESTful endpoints and WebSocket connections.'
        this.baseClasses = [this.type, 'BaseEmbedding_LlamaIndex', ...getBaseClasses(OpenAIEmbedding)]
        this.tags = ['LlamaIndex']
        this.inputs = [
            {
                label: 'DISCORD_API_KEY',
                name: 'region',
                type: 'string'
            }
        ]
    }

    async init(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {
        const timeout = nodeData.inputs?.timeout as string

        const credentialData = await getCredentialData(nodeData.credential ?? '', options)
        const azureOpenAIApiKey = getCredentialParam('azureOpenAIApiKey', credentialData, nodeData)
        const azureOpenAIApiInstanceName = getCredentialParam('azureOpenAIApiInstanceName', credentialData, nodeData)
        const azureOpenAIApiDeploymentName = getCredentialParam('azureOpenAIApiDeploymentName', credentialData, nodeData)
        const azureOpenAIApiVersion = getCredentialParam('azureOpenAIApiVersion', credentialData, nodeData)

        const obj: Partial<OpenAIEmbedding> & { azure?: AzureOpenAIConfig } = {
            azure: {
                apiKey: azureOpenAIApiKey,
                endpoint: `https://${azureOpenAIApiInstanceName}.openai.azure.com`,
                apiVersion: azureOpenAIApiVersion,
                deploymentName: azureOpenAIApiDeploymentName
            }
        }

        if (timeout) obj.timeout = parseInt(timeout, 10)

        const model = new OpenAIEmbedding(obj)
        return model
    }
}

module.exports = { nodeClass: AzureOpenAIEmbedding_LlamaIndex_Embeddings }
