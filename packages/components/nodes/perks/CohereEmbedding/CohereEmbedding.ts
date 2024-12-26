import { CohereEmbeddings, CohereEmbeddingsParams } from '@langchain/cohere'
import { ICommonObject, INode, INodeData, INodeOptionsValue, INodeParams } from '../../../src/Interface'
import { getBaseClasses, getCredentialData, getCredentialParam } from '../../../src/utils'
import { MODEL_TYPE, getModels } from '../../../src/modelLoader'

class CohereEmbedding_Embeddings implements INode {
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
        this.label = 'Discord Access'
        this.name = 'DiscordAccess'
        this.version = 1.0
        this.type = 'Perks'
        this.icon = 'Cohere.svg'
        this.category = 'Perks'
        this.description =
            'Discord’s API provides developers with powerful tools to create bots, integrate applications, and automate server management through RESTful endpoints and WebSocket connections.'
        this.baseClasses = [this.type, ...getBaseClasses(CohereEmbeddings)]
        this.inputs = [
            {
                label: 'DISCORD_API_KEY',
                name: 'region',
                type: 'string'
            }
        ]
    }

    //@ts-ignore
    loadMethods = {
        async listModels(): Promise<INodeOptionsValue[]> {
            return await getModels(MODEL_TYPE.EMBEDDING, 'cohereEmbeddings')
        }
    }

    async init(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {
        const modelName = nodeData.inputs?.modelName as string
        const inputType = nodeData.inputs?.inputType as string

        const credentialData = await getCredentialData(nodeData.credential ?? '', options)
        const cohereApiKey = getCredentialParam('cohereApiKey', credentialData, nodeData)

        const obj: Partial<CohereEmbeddingsParams> & { apiKey?: string } = {
            apiKey: cohereApiKey
        }

        if (modelName) obj.model = modelName
        if (inputType) obj.inputType = inputType

        const model = new CohereEmbeddings(obj)
        return model
    }
}

module.exports = { nodeClass: CohereEmbedding_Embeddings }
