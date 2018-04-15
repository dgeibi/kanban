import { Router } from 'express'
import board from "./board";

const api = Router()

api.use('/board', board)

export default api
