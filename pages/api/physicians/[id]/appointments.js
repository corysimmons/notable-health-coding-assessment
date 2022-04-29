process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

const creds = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
}

export default async function handler(req, res) {
  const { Pool } = require('pg')
  const pool = new Pool({
    ...creds,
    ssl: true,
  })

  const {rows: appointments} = await pool.query('SELECT * FROM appointments WHERE physician_id = $1;', [req.query.id])
  await pool.end()

  res.status(200).json(appointments)
}
