import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { query, pool } from './db.js';
import {
  patchBenchSchema,
  createNoteSchema,
  updateNoteSchema,
  calendarQuerySchema,
  upsertCalendarSchema,
} from './validation.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);

const corsOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: corsOrigins.length > 0 ? corsOrigins : true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '1mb' }));

function requireWriteToken(req, res, next) {
  const configured = process.env.API_WRITE_TOKEN;
  if (!configured) return next();

  const auth = req.headers.authorization || '';
  const expected = `Bearer ${configured}`;
  if (auth !== expected) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}

function parseOr400(schema, payload, res) {
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
    return null;
  }

  return parsed.data;
}

app.get('/health', async (_req, res) => {
  await query('select 1');
  res.json({ ok: true });
});

app.get('/api/bench-status', async (_req, res) => {
  const { rows } = await query(
    'select knight_resting, hornet_resting from public.bench_status where id = 1 limit 1'
  );
  const row = rows[0] || { knight_resting: false, hornet_resting: false };

  res.json({
    Knight: !!row.knight_resting,
    Hornet: !!row.hornet_resting,
  });
});

app.patch('/api/bench-status', requireWriteToken, async (req, res) => {
  const body = parseOr400(patchBenchSchema, req.body, res);
  if (!body) return;

  const field = body.user === 'Knight' ? 'knight_resting' : 'hornet_resting';
  await query(
    `update public.bench_status
     set ${field} = $1,
         updated_at = now()
     where id = 1`,
    [body.resting]
  );

  res.status(204).send();
});

app.get('/api/notes', async (_req, res) => {
  const { rows } = await query(
    `select id, text, image_url, liked, timestamp_text, author, comments
     from public.notes
     order by created_at desc`
  );

  const notes = rows.map((item) => ({
    id: item.id,
    text: item.text,
    imageUrl: item.image_url ?? undefined,
    liked: item.liked,
    timestamp: item.timestamp_text,
    author: item.author,
    comments: item.comments ?? [],
  }));

  res.json(notes);
});

app.post('/api/notes', requireWriteToken, async (req, res) => {
  const body = parseOr400(createNoteSchema, req.body, res);
  if (!body) return;

  const timestamp = body.timestamp || new Date().toLocaleString();

  const { rows } = await query(
    `insert into public.notes (text, image_url, liked, timestamp_text, author, comments)
     values ($1, $2, false, $3, $4, '[]'::jsonb)
     returning id, text, image_url, liked, timestamp_text, author, comments`,
    [body.text, body.imageUrl || null, timestamp, body.author]
  );

  const created = rows[0];
  res.status(201).json({
    id: created.id,
    text: created.text,
    imageUrl: created.image_url ?? undefined,
    liked: created.liked,
    timestamp: created.timestamp_text,
    author: created.author,
    comments: created.comments ?? [],
  });
});

app.patch('/api/notes/:id', requireWriteToken, async (req, res) => {
  const body = parseOr400(updateNoteSchema, req.body, res);
  if (!body) return;

  const fields = [];
  const values = [];

  if (body.liked !== undefined) {
    values.push(body.liked);
    fields.push(`liked = $${values.length}`);
  }

  if (body.comments !== undefined) {
    values.push(JSON.stringify(body.comments));
    fields.push(`comments = $${values.length}::jsonb`);
  }

  values.push(req.params.id);
  await query(`update public.notes set ${fields.join(', ')} where id = $${values.length}`, values);

  res.status(204).send();
});

app.delete('/api/notes/:id', requireWriteToken, async (req, res) => {
  await query('delete from public.notes where id = $1', [req.params.id]);
  res.status(204).send();
});

app.get('/api/calendar-entries', async (req, res) => {
  const data = parseOr400(calendarQuerySchema, req.query, res);
  if (!data) return;

  const startDate = `${data.year}-01-01`;
  const endDate = `${data.year}-12-31`;

  const { rows } = await query(
    `select entry_date, mood, journal
     from public.calendar_entries
     where user_profile = $1
       and entry_date >= $2::date
       and entry_date <= $3::date`,
    [data.user, startDate, endDate]
  );

  const result = {};
  for (const row of rows) {
    const key = row.entry_date.toISOString().slice(0, 10);
    result[key] = {
      mood: row.mood ?? undefined,
      journal: row.journal ?? undefined,
    };
  }

  res.json(result);
});

app.put('/api/calendar-entries/:date', requireWriteToken, async (req, res) => {
  const data = parseOr400(upsertCalendarSchema, req.body, res);
  if (!data) return;

  const date = req.params.date;

  await query(
    `insert into public.calendar_entries (user_profile, entry_date, mood, journal)
     values ($1, $2::date, $3, $4)
     on conflict (user_profile, entry_date)
     do update set
       mood = excluded.mood,
       journal = excluded.journal,
       updated_at = now()`,
    [data.user, date, data.mood || null, data.journal || null]
  );

  res.status(204).send();
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const server = app.listen(port, () => {
  console.log(`API server listening on ${port}`);
});

async function shutdown() {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
