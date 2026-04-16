import { createServer } from 'node:http'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataDir = path.join(__dirname, 'data')
const dataFile = path.join(dataDir, 'registrations.json')
const port = Number(process.env.PORT || 3001)

async function readEntries() {
  try {
    const raw = await readFile(dataFile, 'utf8')
    const parsed = JSON.parse(raw)

    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    if (error.code === 'ENOENT') {
      await mkdir(dataDir, { recursive: true })
      await writeFile(dataFile, '[]\n', 'utf8')
      return []
    }

    throw error
  }
}

async function saveEntries(entries) {
  await mkdir(dataDir, { recursive: true })
  await writeFile(dataFile, `${JSON.stringify(entries, null, 2)}\n`, 'utf8')
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
  response.end(JSON.stringify(payload))
}

function normalizeText(value) {
  return String(value || '').trim()
}

function buildError(message, statusCode = 400) {
  return { statusCode, body: { error: message } }
}

const server = createServer(async (request, response) => {
  const requestUrl = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`)

  if (request.method === 'OPTIONS') {
    sendJson(response, 204, {})
    return
  }

  if (requestUrl.pathname === '/api/health') {
    sendJson(response, 200, {
      ok: true,
      service: 'iste-connections-backend',
      timestamp: new Date().toISOString(),
    })
    return
  }

  if (requestUrl.pathname === '/api/registrations' && request.method === 'GET') {
    const entries = await readEntries()
    sendJson(response, 200, { entries, total: entries.length })
    return
  }

  if (requestUrl.pathname === '/api/registrations' && request.method === 'POST') {
    const chunks = []

    for await (const chunk of request) {
      chunks.push(chunk)
    }

    let body = {}
    try {
      const raw = Buffer.concat(chunks).toString('utf8')
      body = raw ? JSON.parse(raw) : {}
    } catch {
      const error = buildError('Request body must be valid JSON.')
      sendJson(response, error.statusCode, error.body)
      return
    }

    const usn = normalizeText(body.usn).toUpperCase()
    const fullName = normalizeText(body.fullName)

    if (!usn) {
      const error = buildError('University seat number is required.')
      sendJson(response, error.statusCode, error.body)
      return
    }

    if (!fullName) {
      const error = buildError('Full name is required.')
      sendJson(response, error.statusCode, error.body)
      return
    }

    const entries = await readEntries()
    const duplicate = entries.find((entry) => entry.usn === usn)

    if (duplicate) {
      const error = buildError('That USN has already been registered.', 409)
      sendJson(response, error.statusCode, error.body)
      return
    }

    const entry = {
      id: randomUUID(),
      usn,
      fullName,
      createdAt: new Date().toISOString(),
    }

    const nextEntries = [entry, ...entries]
    await saveEntries(nextEntries)

    sendJson(response, 201, {
      message: 'Registration stored successfully.',
      entry,
    })
    return
  }

  sendJson(response, 404, { error: 'Route not found.' })
})

server.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`)
})