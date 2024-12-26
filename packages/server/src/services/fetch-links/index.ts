import { webCrawl, xmlScrape } from 'AgentForge-components'
import { StatusCodes } from 'http-status-codes'
import { InternalAgentForgeError } from '../../errors/internalAgentForgeError'
import { getErrorMessage } from '../../errors/utils'

const getAllLinks = async (requestUrl: string, relativeLinksMethod: string, queryLimit: string): Promise<any> => {
    try {
        const url = decodeURIComponent(requestUrl)
        if (!relativeLinksMethod) {
            throw new InternalAgentForgeError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                `Please choose a Relative Links Method in Additional Parameters!`
            )
        }
        const limit = parseInt(queryLimit)
        if (process.env.DEBUG === 'true') console.info(`Start ${relativeLinksMethod}`)
        const links: string[] = relativeLinksMethod === 'webCrawl' ? await webCrawl(url, limit) : await xmlScrape(url, limit)
        if (process.env.DEBUG === 'true') console.info(`Finish ${relativeLinksMethod}`)
        const dbResponse = {
            status: 'OK',
            links
        }
        return dbResponse
    } catch (error) {
        throw new InternalAgentForgeError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            `Error: fetchLinksService.getAllLinks - ${getErrorMessage(error)}`
        )
    }
}

export default {
    getAllLinks
}
