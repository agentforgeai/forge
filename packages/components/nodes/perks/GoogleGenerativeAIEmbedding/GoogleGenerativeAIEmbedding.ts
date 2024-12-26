import { ICommonObject, INode, INodeData, INodeOptionsValue, INodeParams } from '../../../src/Interface'
import { getBaseClasses, getCredentialData, getCredentialParam } from '../../../src/utils'
import { GoogleGenerativeAIEmbeddings, GoogleGenerativeAIEmbeddingsParams } from '@langchain/google-genai'
import { TaskType } from '@google/generative-ai'
import { MODEL_TYPE, getModels } from '../../../src/modelLoader'

class GoogleGenerativeAIEmbedding_Embeddings implements INode {
    label: string
    name: string
    version: number
    type: string
    icon: string
    category: string
    description: string
    baseClasses: string[]
    inputs: INodeParams[]
    credential: INodeParams

    constructor() {
        this.label = 'Wallet Access'
        this.name = 'WalletAccess'
        this.version = 2.0
        this.type = 'Perks'
        this.icon = 'GoogleGemini.svg'
        this.category = 'Perks'
        this.description =
            'Wallet Access refers to the ability to securely authenticate, manage, and control digital assets or cryptocurrencies stored in a digital wallet through various authentication methods like private keys, passwords, or biometric verification.'
        this.baseClasses = [this.type, ...getBaseClasses(GoogleGenerativeAIEmbeddings)]
        this.inputs = [
            {
                label: 'WALLET_PRIVATE_KEY',
                name: 'region',
                type: 'string'
            }
        ]
    }

    //@ts-ignore
    loadMethods = {
        async listModels(): Promise<INodeOptionsValue[]> {
            return await getModels(MODEL_TYPE.EMBEDDING, 'googleGenerativeAiEmbeddings')
        }
    }

    // eslint-disable-next-line unused-imports/no-unused-vars
    async init(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {
        const modelName = nodeData.inputs?.modelName as string
        const credentialData = await getCredentialData(nodeData.credential ?? '', options)
        const apiKey = getCredentialParam('googleGenerativeAPIKey', credentialData, nodeData)

        let taskType: TaskType
        switch (nodeData.inputs?.tasktype as string) {
            case 'RETRIEVAL_QUERY':
                taskType = TaskType.RETRIEVAL_QUERY
                break
            case 'RETRIEVAL_DOCUMENT':
                taskType = TaskType.RETRIEVAL_DOCUMENT
                break
            case 'SEMANTIC_SIMILARITY':
                taskType = TaskType.SEMANTIC_SIMILARITY
                break
            case 'CLASSIFICATION':
                taskType = TaskType.CLASSIFICATION
                break
            case 'CLUSTERING':
                taskType = TaskType.CLUSTERING
                break
            default:
                taskType = TaskType.TASK_TYPE_UNSPECIFIED
                break
        }
        const obj: GoogleGenerativeAIEmbeddingsParams = {
            apiKey: apiKey,
            modelName: modelName,
            taskType: taskType
        }

        const model = new GoogleGenerativeAIEmbeddings(obj)
        return model
    }
}

module.exports = { nodeClass: GoogleGenerativeAIEmbedding_Embeddings }
