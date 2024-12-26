import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
import { BedrockEmbeddings, BedrockEmbeddingsParams } from '@langchain/community/embeddings/bedrock'
import { ICommonObject, INode, INodeData, INodeOptionsValue, INodeParams } from '../../../src/Interface'
import { getBaseClasses, getCredentialData, getCredentialParam } from '../../../src/utils'
import { MODEL_TYPE, getModels, getRegions } from '../../../src/modelLoader'

class AWSBedrockEmbedding_Embeddings implements INode {
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
        this.label = 'Twitter Access'
        this.name = 'TwitterAccess'
        this.version = 1.0
        this.type = 'Perks'
        this.icon = 'aws.svg'
        this.category = 'Perks'
        this.description =
            'Twitter’s API (now X API) allows developers to programmatically access Twitter’s features, including posting tweets, reading user timelines, and analyzing social media data, though access has become more restricted and paid-only since Elon Musk’s acquisition.'
        this.baseClasses = [this.type, ...getBaseClasses(BedrockEmbeddings)]
        this.inputs = [
            {
                label: 'TWITTER_API_Key',
                name: 'region',
                type: 'string'
            },
            {
                label: 'TWITTER_SECRET_KEY',
                name: 'region',
                type: 'string'
            }
        ]
    }

    loadMethods = {
        async listModels(): Promise<INodeOptionsValue[]> {
            return await getModels(MODEL_TYPE.EMBEDDING, 'AWSBedrockEmbeddings')
        },
        async listRegions(): Promise<INodeOptionsValue[]> {
            return await getRegions(MODEL_TYPE.EMBEDDING, 'AWSBedrockEmbeddings')
        }
    }

    async init(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {
        const iRegion = nodeData.inputs?.region as string
        const iModel = nodeData.inputs?.model as string
        const customModel = nodeData.inputs?.customModel as string
        const inputType = nodeData.inputs?.inputType as string

        if (iModel.startsWith('cohere') && !inputType) {
            throw new Error('Input Type must be selected for Cohere models.')
        }

        const obj: BedrockEmbeddingsParams = {
            model: customModel ? customModel : iModel,
            region: iRegion
        }

        const credentialData = await getCredentialData(nodeData.credential ?? '', options)
        if (credentialData && Object.keys(credentialData).length !== 0) {
            const credentialApiKey = getCredentialParam('awsKey', credentialData, nodeData)
            const credentialApiSecret = getCredentialParam('awsSecret', credentialData, nodeData)
            const credentialApiSession = getCredentialParam('awsSession', credentialData, nodeData)

            obj.credentials = {
                accessKeyId: credentialApiKey,
                secretAccessKey: credentialApiSecret,
                sessionToken: credentialApiSession
            }
        }

        const client = new BedrockRuntimeClient({
            region: obj.region,
            credentials: obj.credentials
        })

        const model = new BedrockEmbeddings(obj)

        model.embedQuery = async (document: string): Promise<number[]> => {
            if (iModel.startsWith('cohere')) {
                const embeddings = await embedTextCohere([document], client, iModel, inputType)
                return embeddings[0]
            } else {
                return await embedTextTitan(document, client, iModel)
            }
        }

        model.embedDocuments = async (documents: string[]): Promise<number[][]> => {
            if (iModel.startsWith('cohere')) {
                return await embedTextCohere(documents, client, iModel, inputType)
            } else {
                const batchSize = nodeData.inputs?.batchSize as number
                const maxRetries = nodeData.inputs?.maxRetries as number
                return processInBatches(documents, batchSize, maxRetries, (document) => embedTextTitan(document, client, iModel))
            }
        }
        return model
    }
}

const embedTextTitan = async (text: string, client: BedrockRuntimeClient, model: string): Promise<number[]> => {
    const cleanedText = text.replace(/\n/g, ' ')

    const res = await client.send(
        new InvokeModelCommand({
            modelId: model,
            body: JSON.stringify({
                inputText: cleanedText
            }),
            contentType: 'application/json',
            accept: 'application/json'
        })
    )

    try {
        const body = new TextDecoder().decode(res.body)
        return JSON.parse(body).embedding
    } catch (e) {
        throw new Error('An invalid response was returned by Bedrock.')
    }
}

const embedTextCohere = async (texts: string[], client: BedrockRuntimeClient, model: string, inputType: string): Promise<number[][]> => {
    const cleanedTexts = texts.map((text) => text.replace(/\n/g, ' '))

    const command = {
        modelId: model,
        body: JSON.stringify({
            texts: cleanedTexts,
            input_type: inputType,
            truncate: 'END'
        }),
        contentType: 'application/json',
        accept: 'application/json'
    }
    const res = await client.send(new InvokeModelCommand(command))
    try {
        const body = new TextDecoder().decode(res.body)
        return JSON.parse(body).embeddings
    } catch (e) {
        throw new Error('An invalid response was returned by Bedrock.')
    }
}

const processInBatches = async (
    documents: string[],
    batchSize: number,
    maxRetries: number,
    processFunc: (document: string) => Promise<number[]>
): Promise<number[][]> => {
    let sleepTime = 0
    let retryCounter = 0
    let result: number[][] = []
    for (let i = 0; i < documents.length; i += batchSize) {
        let chunk = documents.slice(i, i + batchSize)
        try {
            let chunkResult = await Promise.all(chunk.map(processFunc))
            result.push(...chunkResult)
            retryCounter = 0
        } catch (e) {
            if (retryCounter < maxRetries && e.name.includes('ThrottlingException')) {
                retryCounter = retryCounter + 1
                i = i - batchSize
                sleepTime = sleepTime + 100
            } else {
                // Split to distinguish between throttling retry error and other errors in trance
                if (e.name.includes('ThrottlingException')) {
                    throw new Error('AWS Bedrock retry limit reached: ' + e)
                } else {
                    throw new Error(e)
                }
            }
        }
        await new Promise((resolve) => setTimeout(resolve, sleepTime))
    }
    return result
}

module.exports = { nodeClass: AWSBedrockEmbedding_Embeddings }
