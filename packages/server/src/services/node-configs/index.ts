import { StatusCodes } from 'http-status-codes'
import { findAvailableConfigs } from '../../utils'
import { IReactFlowNode } from '../../Interface'
import { getRunningExpressApp } from '../../utils/getRunningExpressApp'
import { InternalAgentForgeError } from '../../errors/internalAgentForgeError'
import { getErrorMessage } from '../../errors/utils'

const getAllNodeConfigs = async (requestBody: any) => {
    try {
        const appServer = getRunningExpressApp()
        const nodes = [{ data: requestBody }] as IReactFlowNode[]
        const dbResponse = findAvailableConfigs(nodes, appServer.nodesPool.componentCredentials)
        return dbResponse
    } catch (error) {
        throw new InternalAgentForgeError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            `Error: nodeConfigsService.getAllNodeConfigs - ${getErrorMessage(error)}`
        )
    }
}

export default {
    getAllNodeConfigs
}
