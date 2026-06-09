const { PrismaClient } = require('@prisma/client');

// Di Hostinger shared hosting, Prisma binary Rust engine crash karena
// POSIX timer dibatasi. Solusi: set connection_limit=1 dan gunakan
// connect_timeout yang lebih pendek agar engine tidak hang.
const DATABASE_URL = process.env.DATABASE_URL || '';

// Tambahkan parameter connection_limit=1 jika production
function buildUrl(url) {
  if (!url) return url;
  try {
    const u = new URL(url);
    // Set pool kecil agar tidak overload shared hosting
    u.searchParams.set('connection_limit', '1');
    u.searchParams.set('connect_timeout', '10');
    u.searchParams.set('pool_timeout', '30');
    return u.toString();
  } catch {
    return url;
  }
}

const prisma = new PrismaClient({
  datasourceUrl: buildUrl(DATABASE_URL),
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'minimal',
});

module.exports = prisma;
