import { randomUUID } from 'node:crypto'
import { Database } from "./database.js"
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const tasks = database.select('tasks')

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      try {
        const { id } = req.params
        const { title, description } = req.body

        if (!title || !description) {
          return res.writeHead(500).end(JSON.stringify('Must have title and description'))
        }

        database.update('tasks', id, { title, description })

        return res.writeHead(204).end()
      } catch (error) {
        return res.writeHead(500).end(JSON.stringify(error.message))
      }
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      if (!title || !description) {
        return res.writeHead(500).end(JSON.stringify('Must have title and description'))
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      }

      database.insert('tasks', task)

      return res.end(JSON.stringify(task))
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      try {
        const { id } = req.params

        database.delete('tasks', id)

        return res.writeHead(204).end()
      } catch (error) {
        return res.writeHead(500).end(JSON.stringify(error.message))
      }
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      try {
        const { id } = req.params

        database.update('tasks', id, { completed_at: new Date() })

        return res.writeHead(204).end()
      } catch (error) {
        return res.writeHead(500).end(JSON.stringify(error.message))
      }
    }
  }
]