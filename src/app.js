import express from 'express'

const app = express()

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


// routes
import userRouter from './routes/user.routes.js'

// routes declaration
app.use('/api/users', userRouter)

export default app