CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE exercises (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE training_plan (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    exercise_id INT REFERENCES exercises(id) ON DELETE CASCADE,
    day_of_week VARCHAR(15) NOT NULL,
    sets INT NOT NULL CHECK (sets > 0),
    reps TEXT NOT NULL,
    weight INT DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE
);

CREATE TABLE training_history (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    exercise_id INT REFERENCES exercises(id) ON DELETE CASCADE,
    day_of_week VARCHAR(15) NOT NULL,
    sets INT NOT NULL,
    reps TEXT NOT NULL,
    weight INT,
    completed_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO users (username) VALUES ('Иван');

INSERT INTO exercises (name, description) VALUES 
('Жим лёжа', 'Базовое упражнение для грудных мышц'),
('Приседания', 'Базовое упражнение для ног'),
('Тяга в наклоне', 'Упражнение для спины');

INSERT INTO training_plan (user_id, exercise_id, day_of_week, sets, reps, weight) VALUES
(1, 1, 'Понедельник', 4, '10,8,8,6', 80),
(1, 2, 'Понедельник', 3, '10,10,8', 100),
(1, 3, 'Среда', 3, '12,10,10', 60);

INSERT INTO training_history (user_id, exercise_id, day_of_week, sets, reps, weight) VALUES
(1, 1, 'Понедельник', 4, '10,8,8,6', 80),
(1, 2, 'Понедельник', 3, '10,10,8', 100);