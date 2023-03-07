import { type Request, type Response } from 'express'
import {
  type Controller,
  type HttpRequest
} from '../../../presentation/protocols'

type ExpressHandler = (req: Request, res: Response) => void

export const adaptRoute =
  (controller: Controller): ExpressHandler =>
    async (req: Request, res: Response): Promise<void> => {
      const httpRequest: HttpRequest = {
        body: req.body
      }
      const httpResponse = await controller.handle(httpRequest)
      res.status(httpResponse.statusCode).json(httpResponse.body)
    }
