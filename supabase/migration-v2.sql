-- OráculoAI v2 — Schema pivot for holistic content creation
-- Run AFTER the original migration (additive changes)

-- Add holistic profile fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS sub_niche TEXT DEFAULT 'astrologia';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS visual_style TEXT DEFAULT 'mystic_dark';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS voice_tone TEXT DEFAULT 'acolhedora';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS brand_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_done BOOLEAN DEFAULT false;

-- Content generations (replaces generic "generations" for content-specific)
CREATE TABLE IF NOT EXISTS content_pieces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('post_feed', 'stories', 'carousel', 'reels_script', 'blog_seo', 'ad_copy')),
  topic TEXT NOT NULL,
  copy_hook TEXT,
  copy_body TEXT,
  copy_cta TEXT,
  hashtags TEXT[],
  seo_keywords TEXT[],
  image_url TEXT,
  image_prompt TEXT,
  status TEXT NOT NULL DEFAULT 'completed',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE content_pieces ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own content" ON content_pieces FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own content" ON content_pieces FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_content_pieces_user ON content_pieces(user_id, created_at DESC);

-- Astro calendar events (pre-populated)
CREATE TABLE IF NOT EXISTS astro_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  energy TEXT,
  content_suggestion TEXT,
  event_type TEXT CHECK (event_type IN ('lunar', 'planetary', 'eclipse', 'retrograde', 'seasonal'))
);

-- Seed some astro events for the next months
INSERT INTO astro_events (date, title, description, energy, content_suggestion, event_type) VALUES
('2026-05-19', 'Lua Cheia em Escorpião', 'Momento de revelações profundas e transformação emocional', 'transformação, sombra, poder interior', 'Poste sobre soltar o que não serve mais. Conteúdo de cura e renascimento.', 'lunar'),
('2026-05-26', 'Lua Nova em Gêmeos', 'Início de ciclo voltado à comunicação e aprendizado', 'comunicação, curiosidade, leveza', 'Ideal para conteúdo educativo, carrosséis explicativos, ensinar algo novo.', 'lunar'),
('2026-06-02', 'Vênus entra em Leão', 'Energia de autoexpressão criativa e amor próprio', 'criatividade, brilho pessoal, autoestima', 'Posts sobre amor próprio, rituais de autoestima, cristais para confiança.', 'planetary'),
('2026-06-10', 'Lua Cheia em Sagitário', 'Expansão, verdade e busca por significado', 'expansão, liberdade, filosofia', 'Conteúdo inspiracional sobre propósito de vida e jornada espiritual.', 'lunar'),
('2026-06-18', 'Saturno Retrógrado inicia', 'Revisão de estruturas, limites e responsabilidades kármicas', 'revisão, karma, disciplina espiritual', 'Série de posts sobre revisão de crenças limitantes. Carrossel educativo.', 'retrograde'),
('2026-06-21', 'Solstício de Inverno', 'Momento de introspecção profunda e renovação interior', 'introspecção, morte simbólica, renascimento', 'Ritual de solstício. Post sobre ciclos da natureza e nossa conexão.', 'seasonal'),
('2026-06-25', 'Lua Nova em Câncer', 'Novo ciclo emocional, lar, família, nutrição', 'acolhimento, lar interior, ancestralidade', 'Conteúdo sobre cura do feminino, ancestralidade, autocuidado.', 'lunar'),
('2026-07-04', 'Mercúrio Retrógrado em Leão', 'Revisão de como nos expressamos e comunicamos', 'revisão, comunicação, autoexpressão', 'Posts sobre comunicação consciente. Aviso sobre contratos e decisões.', 'retrograde'),
('2026-07-10', 'Lua Cheia em Capricórnio', 'Culminação de projetos, colheita de esforços', 'realização, estrutura, disciplina', 'Conteúdo sobre manifestação, lei do retorno, gratidão pelas conquistas.', 'lunar');
