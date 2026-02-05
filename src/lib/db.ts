import { APIListing } from './types';

// Check if we're running on Vercel (serverless) - check multiple indicators
const isServerless =
  process.env.VERCEL === '1' ||
  process.env.VERCEL === 'true' ||
  !!process.env.VERCEL_URL ||
  !!process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.cwd().startsWith('/var/task');

interface Database {
  apis: APIListing[];
  lastUpdated: string;
}

// In-memory storage for serverless
let inMemoryDb: Database = { apis: [], lastUpdated: new Date().toISOString() };

// File-based storage for local development
function getFilePath(): string {
  const { join } = require('path');
  return join(process.cwd(), 'data', 'registry.json');
}

function ensureDbExists(): void {
  if (isServerless) return;

  const { existsSync, mkdirSync, writeFileSync } = require('fs');
  const { join } = require('path');

  const dataDir = join(process.cwd(), 'data');
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = getFilePath();
  if (!existsSync(dbPath)) {
    writeFileSync(dbPath, JSON.stringify({ apis: [], lastUpdated: new Date().toISOString() }, null, 2));
  }
}

export function readDb(): Database {
  if (isServerless) {
    return inMemoryDb;
  }

  ensureDbExists();
  const { readFileSync } = require('fs');
  const data = readFileSync(getFilePath(), 'utf-8');
  return JSON.parse(data);
}

export function writeDb(db: Database): void {
  db.lastUpdated = new Date().toISOString();

  if (isServerless) {
    inMemoryDb = db;
    return;
  }

  ensureDbExists();
  const { writeFileSync } = require('fs');
  writeFileSync(getFilePath(), JSON.stringify(db, null, 2));
}

export function getAllAPIs(): APIListing[] {
  return readDb().apis.filter(api => api.status === 'active');
}

export function getAPIById(id: string): APIListing | undefined {
  return readDb().apis.find(api => api.id === id);
}

export function saveAPI(api: APIListing): void {
  const db = readDb();
  const index = db.apis.findIndex(a => a.id === api.id);
  if (index >= 0) {
    db.apis[index] = api;
  } else {
    db.apis.push(api);
  }
  writeDb(db);
}

export function deleteAPI(id: string): boolean {
  const db = readDb();
  const index = db.apis.findIndex(a => a.id === id);
  if (index >= 0) {
    db.apis.splice(index, 1);
    writeDb(db);
    return true;
  }
  return false;
}

export function updateAPIMetrics(id: string, metrics: Partial<APIListing['metrics']>): void {
  const db = readDb();
  const api = db.apis.find(a => a.id === id);
  if (api) {
    api.metrics = { ...api.metrics, ...metrics };
    api.updatedAt = new Date().toISOString();
    writeDb(db);
  }
}
