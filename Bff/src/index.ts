import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

import opportunitiesRouter from './routes/opportunities.routes'
import contactsRouter from './routes/contacts.routes'
import accountRouter from './routes/account.routes'
import userRouter from './routes/user.routes'
import hyperNotesRouter from './routes/hyperNotes.routes'
import notesRouter from './routes/notes.routes'
import tasksRouter from './routes/tasks.routes'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/opportunities', opportunitiesRouter)
app.use('/api/contacts', contactsRouter)
app.use('/api/account-info', accountRouter)
app.use('/api/current-user', userRouter)
app.use('/api/hyper-notes', hyperNotesRouter)
app.use('/api/notes', notesRouter)
app.use('/api/tasks', tasksRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`BFF listening on http://localhost:${PORT}`)
})

export default app
