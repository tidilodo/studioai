-- OraculoAI v5 - Zernio publishing queue
-- Run after migration-v4-security-rls.sql

ALTER TABLE content_pieces ADD COLUMN IF NOT EXISTS publish_status TEXT NOT NULL DEFAULT 'draft'
  CHECK (publish_status IN ('draft', 'queued', 'scheduled', 'published', 'failed'));
ALTER TABLE content_pieces ADD COLUMN IF NOT EXISTS platforms TEXT[] DEFAULT '{}';
ALTER TABLE content_pieces ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;
ALTER TABLE content_pieces ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
ALTER TABLE content_pieces ADD COLUMN IF NOT EXISTS zernio_publication_id TEXT;
ALTER TABLE content_pieces ADD COLUMN IF NOT EXISTS zernio_payload JSONB;
ALTER TABLE content_pieces ADD COLUMN IF NOT EXISTS zernio_error TEXT;

CREATE INDEX IF NOT EXISTS idx_content_pieces_publish_status ON content_pieces(user_id, publish_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_pieces_scheduled_at ON content_pieces(scheduled_at) WHERE scheduled_at IS NOT NULL;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS connected_platforms TEXT[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS zernio_workspace_id TEXT;
