
-- ============================================================
--  FIFA World Cup 2026 Prediction Dashboard — PostgreSQL DDL
-- ============================================================

-- 1. Teams dimension table
CREATE TABLE teams (
    team_id          SERIAL PRIMARY KEY,
    team_name        VARCHAR(100) NOT NULL UNIQUE,
    country_code     CHAR(3),
    confederation    VARCHAR(20)
);

-- 2. Raw features table (training data)
CREATE TABLE team_features (
    feature_id               SERIAL PRIMARY KEY,
    team_id                  INT REFERENCES teams(team_id) ON DELETE CASCADE,
    split                    VARCHAR(10) DEFAULT 'train',  -- train / test
    fifa_rank                SMALLINT,
    fifa_points              NUMERIC(7,2),
    wins_last_10_matches     SMALLINT,
    losses_last_10_matches   SMALLINT,
    draws_last_10_matches    SMALLINT,
    win_rate_last_year       NUMERIC(5,4),
    goals_scored_avg         NUMERIC(5,3),
    goals_conceded_avg       NUMERIC(5,3),
    clean_sheets_last_10     SMALLINT,
    shots_per_game           NUMERIC(5,2),
    shots_on_target_ratio    NUMERIC(5,4),
    avg_player_rating        NUMERIC(5,2),
    star_players_count       SMALLINT,
    market_value_million_eur NUMERIC(8,2),
    experience_avg_caps      SMALLINT,
    coach_experience_years   SMALLINT,
    recent_form_score        NUMERIC(5,3),
    possession_avg           NUMERIC(5,2),
    passing_accuracy         NUMERIC(5,2),
    host_advantage           SMALLINT,
    travel_distance_avg      NUMERIC(6,2),
    climate_similarity_score NUMERIC(5,4),
    winner                   SMALLINT   -- 1 = winner, 0 = not winner, NULL for test
);

-- 3. Engineered features table
CREATE TABLE engineered_features (
    ef_id                  SERIAL PRIMARY KEY,
    team_id                INT REFERENCES teams(team_id),
    strength_index         NUMERIC(10,4),
    goal_efficiency        NUMERIC(8,4),
    attack_potency         NUMERIC(8,4),
    defensive_solidity     NUMERIC(8,4),
    squad_quality          NUMERIC(8,4),
    form_consistency       NUMERIC(8,4),
    possession_dominance   NUMERIC(8,4),
    star_power             NUMERIC(12,2),
    contextual_advantage   NUMERIC(8,4),
    goals_diff_avg         NUMERIC(6,4),
    consistency_score      SMALLINT,
    experience_rank        NUMERIC(10,4)
);

-- 4. Model predictions table
CREATE TABLE model_predictions (
    pred_id              SERIAL PRIMARY KEY,
    team_id              INT REFERENCES teams(team_id),
    model_name           VARCHAR(50),       -- XGBoost, LightGBM, RF, Ensemble
    win_probability      NUMERIC(8,6),
    created_at           TIMESTAMP DEFAULT NOW()
);

-- 5. Model metadata table
CREATE TABLE model_runs (
    run_id          SERIAL PRIMARY KEY,
    model_name      VARCHAR(50),
    val_auc         NUMERIC(6,4),
    val_accuracy    NUMERIC(6,4),
    cv_auc_mean     NUMERIC(6,4),
    cv_auc_std      NUMERIC(6,4),
    n_estimators    INT,
    hyperparams     JSONB,
    trained_at      TIMESTAMP DEFAULT NOW()
);

-- 6. Indexes for dashboard performance
CREATE INDEX idx_teams_confederation ON teams(confederation);
CREATE INDEX idx_features_team       ON team_features(team_id);
CREATE INDEX idx_predictions_model   ON model_predictions(model_name);
CREATE INDEX idx_predictions_team    ON model_predictions(team_id);

-- ============================================================
-- USEFUL DASHBOARD QUERIES
-- ============================================================

-- Q1: Top 10 predicted winners (ensemble)
-- SELECT t.team_name, t.confederation,
--        mp.win_probability
-- FROM model_predictions mp
-- JOIN teams t ON t.team_id = mp.team_id
-- WHERE mp.model_name = 'Ensemble'
-- ORDER BY mp.win_probability DESC
-- LIMIT 10;

-- Q2: Average win probability by confederation
-- SELECT t.confederation,
--        AVG(mp.win_probability)  AS avg_prob,
--        MAX(mp.win_probability)  AS best_team_prob,
--        COUNT(DISTINCT t.team_id) AS teams
-- FROM model_predictions mp
-- JOIN teams t ON t.team_id = mp.team_id
-- WHERE mp.model_name = 'Ensemble'
-- GROUP BY t.confederation
-- ORDER BY avg_prob DESC;

-- Q3: Model leaderboard
-- SELECT model_name, val_auc, val_accuracy, cv_auc_mean
-- FROM model_runs
-- ORDER BY val_auc DESC;

-- Q4: Correlation of market value with win probability
-- SELECT t.team_name,
--        tf.market_value_million_eur,
--        mp.win_probability
-- FROM model_predictions mp
-- JOIN teams t  ON t.team_id  = mp.team_id
-- JOIN team_features tf ON tf.team_id = mp.team_id
-- WHERE mp.model_name = 'Ensemble' AND tf.split = 'test'
-- ORDER BY mp.win_probability DESC;
