import { Request } from 'express'
import { StatusCodes } from 'http-status-codes'
import { upsertVector } from '../../utils/upsertVector'
import { InternalAgentForgeError } from '../../errors/internalAgentForgeError'
import { getErrorMessage } from '../../errors/utils'

const upsertVectorMiddleware = async (req: Request, isInternal: boolean = false) => {
    try {
        return await upsertVector(req, isInternal)
    } catch (error) {
        throw new InternalAgentForgeError(StatusCodes.INTERNAL_SERVER_ERROR, `Error: vectorsService.upsertVector - ${getErrorMessage(error)}`)
    }
}

export default {
    upsertVectorMiddleware
}
