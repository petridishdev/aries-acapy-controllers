import express, { NextFunction, Request, Response } from 'express'
const router = express.Router()

router.post('/topic/:topic', handleWebHookPost)

async function handleWebHookPost (req: Request & { errors?: any }, res: Response, next: NextFunction): Promise<void> {
//   console.log('WEBHOOK RECEIVED', req.body)
  res.send(201)
}

export default router
