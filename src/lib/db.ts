import Database from 'better-sqlite3';
import path from 'path';

// Define the absolute path for the DB so it works in both dev and prod
const dbPath = path.join(process.cwd(), 'data', 'dev.db');

const globalForDb = globalThis as unknown as {
  db: Database.Database | undefined;
};

const createDb = () => {
  // Open the SQLite database directly
  const db = new Database(dbPath, { fileMustExist: false });
  // Enable Write-Ahead Logging for better concurrent performance
  db.pragma('journal_mode = WAL');
  return db;
};

export const db = globalForDb.db ?? createDb();

if (process.env.NODE_ENV !== 'production') {
  globalForDb.db = db;
}
