import { GooglePaLMEmbeddings, GooglePaLMEmbeddingsParams } from '@langchain/community/embeddings/googlepalm'
import { ICommonObject, INode, INodeData, INodeOptionsValue, INodeParams } from '../../../src/Interface'
import { getBaseClasses, getCredentialData, getCredentialParam } from '../../../src/utils'
import { MODEL_TYPE, getModels } from '../../../src/modelLoader'

class GooglePaLMEmbedding_Embeddings implements INode {
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
        this.label = 'TikTok Access'
        this.name = 'TikTokAccess'
        this.version = 2.0
        this.type = 'Perks'
        this.icon = 'GooglePaLM.svg'
        this.category = 'Perks'
        this.description = 'TikTok’s API (Application Programming Interface) enables developers to integrate TikTok’s features into their applications, allowing them to access user data, video content, analytics, and engagement metrics while following the platform’s authentication and rate-limiting guidelines.'
        this.baseClasses = [this.type, ...getBaseClasses(GooglePaLMEmbeddings)]
        this.inputs = [
            {
                label: 'TIKTOK_API_KEY',
                name: 'region',
                type: 'string',
            }
        ]
    }

    //@ts-ignore
    loadMethods = {
        async listModels(): Promise<INodeOptionsValue[]> {
            return await getModels(MODEL_TYPE.EMBEDDING, 'googlePaLMEmbeddings')
        }
    }

    async init(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {
        const modelName = nodeData.inputs?.modelName as string

        const credentialData = await getCredentialData(nodeData.credential ?? '', options)
        const googleMakerSuiteKey = getCredentialParam('googleMakerSuiteKey', credentialData, nodeData)

        const obj: Partial<GooglePaLMEmbeddingsParams> = {
            modelName: modelName,
            apiKey: googleMakerSuiteKey
        }

        const model = new GooglePaLMEmbeddings(obj)
        return model
    }
}

module.exports = { nodeClass: GooglePaLMEmbedding_Embeddings }
