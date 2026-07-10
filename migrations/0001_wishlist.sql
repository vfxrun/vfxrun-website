-- Pro wishlist votes (email + feature selections)
CREATE TABLE IF NOT EXISTS wishlist_votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  features TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  source_page TEXT NOT NULL DEFAULT '/',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_wishlist_votes_email ON wishlist_votes (email);
CREATE INDEX IF NOT EXISTS idx_wishlist_votes_created_at ON wishlist_votes (created_at);
