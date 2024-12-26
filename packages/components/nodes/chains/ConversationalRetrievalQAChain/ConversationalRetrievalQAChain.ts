import { applyPatch } from 'fast-json-patch'
import { DataSource } from 'typeorm'
import { BaseLanguageModel } from '@langchain/core/language_models/base'
import { BaseRetriever } from '@langchain/core/retrievers'
import { PromptTemplate, ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts'
import { Runnable, RunnableSequence, RunnableMap, RunnableBranch, RunnableLambda } from '@langchain/core/runnables'
import { BaseMessage, HumanMessage, AIMessage } from '@langchain/core/messages'
import { ConsoleCallbackHandler as LCConsoleCallbackHandler } from '@langchain/core/tracers/console'
import { StringOutputParser } from '@langchain/core/output_parsers'
import type { Document } from '@langchain/core/documents'
import { BufferMemoryInput } from 'langchain/memory'
import { ConversationalRetrievalQAChain } from 'langchain/chains'
import { getBaseClasses, mapChatMessageToBaseMessage } from '../../../src/utils'
import { ConsoleCallbackHandler, additionalCallbacks } from '../../../src/handler'
import {
    AgentForgeMemory,
    ICommonObject,
    IMessage,
    INode,
    INodeData,
    INodeParams,
    IDatabaseEntity,
    MemoryMethods,
    IServerSideEventStreamer
} from '../../../src/Interface'
import { QA_TEMPLATE, REPHRASE_TEMPLATE, RESPONSE_TEMPLATE } from './prompts'

type RetrievalChainInput = {
    chat_history: string
    question: string
}

const sourceRunnableName = 'FindDocs'

class ConversationalRetrievalQAChain_Chains implements INode {
    label: string
    name: string
    version: number
    type: string
    icon: string
    category: string
    baseClasses: string[]
    description: string
    inputs: INodeParams[]
    sessionId?: string

    constructor(fields?: { sessionId?: string }) {
        this.label = 'First Message'
        this.name = 'conversationalRetrievalQAChain'
        this.version = 3.0
        this.type = 'Personalities'
        this.icon = 'qa.svg'
        this.category = 'Personalities'
        this.description = 'First Message'
        this.baseClasses = [this.type, ...getBaseClasses(ConversationalRetrievalQAChain)]
        this.inputs = [
            {
                label: 'First Message',
                name: 'namespace',
                type: 'string',
                rows:3,
                description: 'This is your AI Agents age. Minimum age is 18.'
            }
        ]
        this.sessionId = fields?.sessionId
    }

    async init(nodeData: INodeData): Promise<any> {
        const model = nodeData.inputs?.model as BaseLanguageModel
        const vectorStoreRetriever = nodeData.inputs?.vectorStoreRetriever as BaseRetriever
        const systemMessagePrompt = nodeData.inputs?.systemMessagePrompt as string
        const rephrasePrompt = nodeData.inputs?.rephrasePrompt as string
        const responsePrompt = nodeData.inputs?.responsePrompt as string

        let customResponsePrompt = responsePrompt
        // If the deprecated systemMessagePrompt is still exists
        if (systemMessagePrompt) {
            customResponsePrompt = `${systemMessagePrompt}\n${QA_TEMPLATE}`
        }

        const answerChain = createChain(model, vectorStoreRetriever, rephrasePrompt, customResponsePrompt)
        return answerChain
    }

    async run(nodeData: INodeData, input: string, options: ICommonObject): Promise<string | ICommonObject> {
        const model = nodeData.inputs?.model as BaseLanguageModel
        const externalMemory = nodeData.inputs?.memory
        const vectorStoreRetriever = nodeData.inputs?.vectorStoreRetriever as BaseRetriever
        const systemMessagePrompt = nodeData.inputs?.systemMessagePrompt as string
        const rephrasePrompt = nodeData.inputs?.rephrasePrompt as string
        const responsePrompt = nodeData.inputs?.responsePrompt as string
        const returnSourceDocuments = nodeData.inputs?.returnSourceDocuments as boolean
        const prependMessages = options?.prependMessages

        const appDataSource = options.appDataSource as DataSource
        const databaseEntities = options.databaseEntities as IDatabaseEntity
        const chatflowid = options.chatflowid as string

        const shouldStreamResponse = options.shouldStreamResponse
        const sseStreamer: IServerSideEventStreamer = options.sseStreamer as IServerSideEventStreamer
        const chatId = options.chatId

        let customResponsePrompt = responsePrompt
        // If the deprecated systemMessagePrompt is still exists
        if (systemMessagePrompt) {
            customResponsePrompt = `${systemMessagePrompt}\n${QA_TEMPLATE}`
        }

        let memory: AgentForgeMemory | undefined = externalMemory
        // const moderations = nodeData.inputs?.inputModeration as Moderation[]
        if (!memory) {
            memory = new BufferMemory({
                returnMessages: true,
                memoryKey: 'chat_history',
                appDataSource,
                databaseEntities,
                chatflowid
            })
        }

        // if (moderations && moderations.length > 0) {
        //     try {
        //         // Use the output of the moderation chain as input for the Conversational Retrieval QA Chain
        //         input = await checkInputs(moderations, input)
        //     } catch (e) {
        //         await new Promise((resolve) => setTimeout(resolve, 500))
        //         if (options.shouldStreamResponse) {
        //             streamResponse(options.sseStreamer, options.chatId, e.message)
        //         }
        //         return formatResponse(e.message)
        //     }
        // }
        const answerChain = createChain(model, vectorStoreRetriever, rephrasePrompt, customResponsePrompt)

        const history = ((await memory.getChatMessages(this.sessionId, false, prependMessages)) as IMessage[]) ?? []

        const loggerHandler = new ConsoleCallbackHandler(options.logger)
        const additionalCallback = await additionalCallbacks(nodeData, options)

        let callbacks = [loggerHandler, ...additionalCallback]

        if (process.env.DEBUG === 'true') {
            callbacks.push(new LCConsoleCallbackHandler())
        }

        const stream = answerChain.streamLog(
            { question: input, chat_history: history },
            { callbacks },
            {
                includeNames: [sourceRunnableName]
            }
        )

        let streamedResponse: Record<string, any> = {}
        let sourceDocuments: ICommonObject[] = []
        let text = ''
        let isStreamingStarted = false

        for await (const chunk of stream) {
            streamedResponse = applyPatch(streamedResponse, chunk.ops).newDocument

            if (streamedResponse.final_output) {
                text = streamedResponse.final_output?.output
                if (Array.isArray(streamedResponse?.logs?.[sourceRunnableName]?.final_output?.output)) {
                    sourceDocuments = streamedResponse?.logs?.[sourceRunnableName]?.final_output?.output
                    if (shouldStreamResponse && returnSourceDocuments) {
                        if (sseStreamer) {
                            sseStreamer.streamSourceDocumentsEvent(chatId, sourceDocuments)
                        }
                    }
                }
                if (shouldStreamResponse && sseStreamer) {
                    sseStreamer.streamEndEvent(chatId)
                }
            }

            if (
                Array.isArray(streamedResponse?.streamed_output) &&
                streamedResponse?.streamed_output.length &&
                !streamedResponse.final_output
            ) {
                const token = streamedResponse.streamed_output[streamedResponse.streamed_output.length - 1]

                if (!isStreamingStarted) {
                    isStreamingStarted = true
                    if (shouldStreamResponse) {
                        if (sseStreamer) {
                            sseStreamer.streamStartEvent(chatId, token)
                        }
                    }
                }
                if (shouldStreamResponse) {
                    if (sseStreamer) {
                        sseStreamer.streamTokenEvent(chatId, token)
                    }
                }
            }
        }

        await memory.addChatMessages(
            [
                {
                    text: input,
                    type: 'userMessage'
                },
                {
                    text: text,
                    type: 'apiMessage'
                }
            ],
            this.sessionId
        )

        if (returnSourceDocuments) return { text, sourceDocuments }
        else return { text }
    }
}

const createRetrieverChain = (llm: BaseLanguageModel, retriever: Runnable, rephrasePrompt: string) => {
    // Small speed/accuracy optimization: no need to rephrase the first question
    // since there shouldn't be any meta-references to prior chat history
    const CONDENSE_QUESTION_PROMPT = PromptTemplate.fromTemplate(rephrasePrompt)
    const condenseQuestionChain = RunnableSequence.from([CONDENSE_QUESTION_PROMPT, llm, new StringOutputParser()]).withConfig({
        runName: 'CondenseQuestion'
    })

    const hasHistoryCheckFn = RunnableLambda.from((input: RetrievalChainInput) => input.chat_history.length > 0).withConfig({
        runName: 'HasChatHistoryCheck'
    })

    const conversationChain = condenseQuestionChain.pipe(retriever).withConfig({
        runName: 'RetrievalChainWithHistory'
    })

    const basicRetrievalChain = RunnableLambda.from((input: RetrievalChainInput) => input.question)
        .withConfig({
            runName: 'Itemgetter:question'
        })
        .pipe(retriever)
        .withConfig({ runName: 'RetrievalChainWithNoHistory' })

    return RunnableBranch.from([[hasHistoryCheckFn, conversationChain], basicRetrievalChain]).withConfig({ runName: sourceRunnableName })
}

const formatDocs = (docs: Document[]) => {
    return docs.map((doc, i) => `<doc id='${i}'>${doc.pageContent}</doc>`).join('\n')
}

const formatChatHistoryAsString = (history: BaseMessage[]) => {
    return history.map((message) => `${message._getType()}: ${message.content}`).join('\n')
}

const serializeHistory = (input: any) => {
    const chatHistory: IMessage[] = input.chat_history || []
    const convertedChatHistory = []
    for (const message of chatHistory) {
        if (message.type === 'userMessage') {
            convertedChatHistory.push(new HumanMessage({ content: message.message }))
        }
        if (message.type === 'apiMessage') {
            convertedChatHistory.push(new AIMessage({ content: message.message }))
        }
    }
    return convertedChatHistory
}

const createChain = (
    llm: BaseLanguageModel,
    retriever: Runnable,
    rephrasePrompt = REPHRASE_TEMPLATE,
    responsePrompt = RESPONSE_TEMPLATE
) => {
    const retrieverChain = createRetrieverChain(llm, retriever, rephrasePrompt)

    const context = RunnableMap.from({
        context: RunnableSequence.from([
            ({ question, chat_history }) => ({
                question,
                chat_history: formatChatHistoryAsString(chat_history)
            }),
            retrieverChain,
            RunnableLambda.from(formatDocs).withConfig({
                runName: 'FormatDocumentChunks'
            })
        ]),
        question: RunnableLambda.from((input: RetrievalChainInput) => input.question).withConfig({
            runName: 'Itemgetter:question'
        }),
        chat_history: RunnableLambda.from((input: RetrievalChainInput) => input.chat_history).withConfig({
            runName: 'Itemgetter:chat_history'
        })
    }).withConfig({ tags: ['RetrieveDocs'] })

    const prompt = ChatPromptTemplate.fromMessages([
        ['system', responsePrompt],
        new MessagesPlaceholder('chat_history'),
        ['human', `{question}`]
    ])

    const responseSynthesizerChain = RunnableSequence.from([prompt, llm, new StringOutputParser()]).withConfig({
        tags: ['GenerateResponse']
    })

    const conversationalQAChain = RunnableSequence.from([
        {
            question: RunnableLambda.from((input: RetrievalChainInput) => input.question).withConfig({
                runName: 'Itemgetter:question'
            }),
            chat_history: RunnableLambda.from(serializeHistory).withConfig({
                runName: 'SerializeHistory'
            })
        },
        context,
        responseSynthesizerChain
    ])

    return conversationalQAChain
}

interface BufferMemoryExtendedInput {
    appDataSource: DataSource
    databaseEntities: IDatabaseEntity
    chatflowid: string
}

class BufferMemory extends AgentForgeMemory implements MemoryMethods {
    appDataSource: DataSource
    databaseEntities: IDatabaseEntity
    chatflowid: string

    constructor(fields: BufferMemoryInput & BufferMemoryExtendedInput) {
        super(fields)
        this.appDataSource = fields.appDataSource
        this.databaseEntities = fields.databaseEntities
        this.chatflowid = fields.chatflowid
    }

    async getChatMessages(
        overrideSessionId = '',
        returnBaseMessages = false,
        prependMessages?: IMessage[]
    ): Promise<IMessage[] | BaseMessage[]> {
        if (!overrideSessionId) return []

        const chatMessage = await this.appDataSource.getRepository(this.databaseEntities['ChatMessage']).find({
            where: {
                sessionId: overrideSessionId,
                chatflowid: this.chatflowid
            },
            order: {
                createdDate: 'ASC'
            }
        })

        if (prependMessages?.length) {
            chatMessage.unshift(...prependMessages)
        }

        if (returnBaseMessages) {
            return await mapChatMessageToBaseMessage(chatMessage)
        }

        let returnIMessages: IMessage[] = []
        for (const m of chatMessage) {
            returnIMessages.push({
                message: m.content as string,
                type: m.role
            })
        }
        return returnIMessages
    }

    async addChatMessages(): Promise<void> {
        // adding chat messages is done on server level
        return
    }

    async clearChatMessages(): Promise<void> {
        // clearing chat messages is done on server level
        return
    }
}

module.exports = { nodeClass: ConversationalRetrievalQAChain_Chains }
