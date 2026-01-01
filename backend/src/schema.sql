
-- 1. Références de base
CREATE TABLE classifications (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL -- ex: 'Général', 'Montagne', 'Points'
);

-- 2. La Course
CREATE TABLE races (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    start_date DATE,
    n_stages INTEGER DEFAULT 1
);

-- 3. Les Étapes
CREATE TABLE stages (
    id SERIAL PRIMARY KEY,
    race_id INTEGER REFERENCES races(id) ON DELETE CASCADE,
    stage_number INTEGER NOT NULL,
    distance DECIMAL(6,2),
    stage_type VARCHAR(20) -- ex: 'plaine', 'clm', 'montagne'
);

-- 4. Les Coureurs
CREATE TABLE racers (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    team_name VARCHAR(100)
);

-- 5. Inscriptions (Lien Coureur <-> Course avec Dossard)
CREATE TABLE race_registrations (
    race_id INTEGER REFERENCES races(id),
    racer_id INTEGER REFERENCES racers(id),
    bib INTEGER NOT NULL, -- Le 'bib' utilisé dans ton code front
    PRIMARY KEY (race_id, racer_id)
);

-- 6. Résultats par Étape (Le cœur du RankingManager)
CREATE TABLE results (
    id SERIAL PRIMARY KEY,
    stage_id INTEGER REFERENCES stages(id),
    bib INTEGER NOT NULL,
    position INTEGER, -- null si DNF/DNS
    time_seconds INTEGER, -- temps stocké en secondes pour calculs faciles
    time_milliseconds INTEGER,
    status VARCHAR(10) DEFAULT 'done', -- 'done', 'dnf', 'dns', 'abs', 'unknown'
    UNIQUE(stage_id, bib)
);

-- 7. Classements Annexes
CREATE TABLE annex_rankings (
    id SERIAL PRIMARY KEY,
    race_id INTEGER REFERENCES races(id),
    stage_id INTEGER REFERENCES stages(id),
    classification_id INTEGER REFERENCES classifications(id),
    bib INTEGER NOT NULL,
    points INTEGER DEFAULT 0
);
