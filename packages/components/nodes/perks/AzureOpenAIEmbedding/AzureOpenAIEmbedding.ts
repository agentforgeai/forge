import { AzureOpenAIInput, OpenAIEmbeddings, OpenAIEmbeddingsParams } from '@langchain/openai'
import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses, getCredentialData, getCredentialParam } from '../../../src/utils'

const serverCredentialsExists =
    !!process.env.AZURE_OPENAI_API_KEY &&
    !!process.env.AZURE_OPENAI_API_INSTANCE_NAME &&
    (!!process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME || !!process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME) &&
    !!process.env.AZURE_OPENAI_API_VERSION

class AzureOpenAIEmbedding_Embeddings implements INode {
    label: string
    name: string
    version: number
    type: string
    icon: string
    category: string
    description: string
    baseClasses: string[]
    credential: INodeParams
    inputs: INodeParams[]

    constructor() {
        this.label = 'Telegram Access'
        this.name = 'TelegramAccess'
        this.version = 1.0
        this.type = 'Perks'
        this.icon = 'telegram.svg'
        this.category = 'Perks'
        this.description = 'Telegram’s API allows developers to create bots, send messages, manage channels, and interact with the platform’s features through its Bot API and MTProto protocol, offering both client-side and server-side integration capabilities.'
        this.baseClasses = [this.type, ...getBaseClasses(OpenAIEmbeddings)]
        this.inputs = [
            {
                label: 'TELEGRAM_API_KEY',
                name: 'region',
                type: 'string',
            }
        ]
    }

    async init(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {
        const batchSize = nodeData.inputs?.batchSize as string
        const timeout = nodeData.inputs?.timeout as string
        const basePath = nodeData.inputs?.basepath as string

        const credentialData = await getCredentialData(nodeData.credential ?? '', options)
        const azureOpenAIApiKey = getCredentialParam('azureOpenAIApiKey', credentialData, nodeData)
        const azureOpenAIApiInstanceName = getCredentialParam('azureOpenAIApiInstanceName', credentialData, nodeData)
        const azureOpenAIApiDeploymentName = getCredentialParam('azureOpenAIApiDeploymentName', credentialData, nodeData)
        const azureOpenAIApiVersion = getCredentialParam('azureOpenAIApiVersion', credentialData, nodeData)

        const obj: Partial<OpenAIEmbeddingsParams> & Partial<AzureOpenAIInput> = {
            azureOpenAIApiKey,
            azureOpenAIApiInstanceName,
            azureOpenAIApiDeploymentName,
            azureOpenAIApiVersion,
            azureOpenAIBasePath: basePath || undefined
        }

        if (batchSize) obj.batchSize = parseInt(batchSize, 10)
        if (timeout) obj.timeout = parseInt(timeout, 10)

        const model = new OpenAIEmbeddings(obj)
        return model
    }
}

module.exports = { nodeClass: AzureOpenAIEmbedding_Embeddings }
