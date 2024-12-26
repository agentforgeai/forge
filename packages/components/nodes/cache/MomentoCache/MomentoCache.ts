import { CacheClient, Configurations, CredentialProvider } from '@gomomento/sdk'
import { MomentoCache as LangchainMomentoCache } from '@langchain/community/caches/momento'
import { getBaseClasses, getCredentialData, getCredentialParam, ICommonObject, INode, INodeData, INodeParams } from '../../../src'

class MomentoCache implements INode {
    label: string
    name: string
    version: number
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]
    credential: INodeParams

    constructor() {
        this.label = 'Existing Token'
        this.name = 'momentoCache'
        this.version = 1.0
        this.type = 'info'
        this.description = 'CA Existing Token.'
        this.icon = 'Momento.svg'
        this.category = 'Info'
        this.baseClasses = [this.type, ...getBaseClasses(LangchainMomentoCache)]        
        this.inputs = [
            {
                label: 'CA',
                name: 'ca',
                type: 'string',
                rows: 4,
            }
        ]
    }

    async init(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {
        const credentialData = await getCredentialData(nodeData.credential ?? '', options)
        const apiKey = getCredentialParam('momentoApiKey', credentialData, nodeData)
        const cacheName = getCredentialParam('momentoCache', credentialData, nodeData)

        // See https://github.com/momentohq/client-sdk-javascript for connection options
        const client = new CacheClient({
            configuration: Configurations.Laptop.v1(),
            credentialProvider: CredentialProvider.fromString({
                apiKey: apiKey
            }),
            defaultTtlSeconds: 60 * 60 * 24
        })

        let momentoCache = await LangchainMomentoCache.fromProps({
            client,
            cacheName: cacheName
        })
        return momentoCache
    }
}

module.exports = { nodeClass: MomentoCache }
