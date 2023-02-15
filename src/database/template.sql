-- Active: 1673873325786@@127.0.0.1@3306

CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL
);

INSERT INTO users (id, name, email, password, role)
VALUES
	("u001", "Fulano", "fulano@email.com", "fulano123", "NORMAL"),
	("u002", "Beltrana", "beltrana@email.com", "beltrana00", "NORMAL"),
	("u003", "Astrodev", "astrodev@email.com", "astrodev99", "ADMIN");

CREATE TABLE playlists (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    name TEXT NOT NULL,
    likes INTEGER DEFAULT (0) NOT NULL,
    dislikes INTEGER DEFAULT (0) NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    updated_at TEXT DEFAULT (DATETIME()) NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users (id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

INSERT INTO playlists (id, creator_id, name)
VALUES
    ("p001", "u001", "RAP"),
    ("p002", "u001", "R&B"),
    ("p003", "u002", "Treino em casa");
    
CREATE TABLE likes_dislikes (
    user_id TEXT NOT NULL,
    playlist_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (playlist_id) REFERENCES playlists (id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

INSERT INTO likes_dislikes (user_id, playlist_id, like)
VALUES
    ("u002", "p001", 1),
    ("u003", "p001", 1),
    ("u002", "p002", 1),
    ("u003", "p002", 1),
    ("u001", "p003", 1),
    ("u003", "p003", 0);

    SELECT * FROM users;
    SELECT * FROM playlists;
    SELECT * FROM likes_dislikes;

    DROP TABLE users;
    DROP TABLE playlists;
    DROP TABLE likes_dislikes;

    UPDATE playlists
    SET likes = 1
    WHERE id = "p003";

    UPDATE playlists
    SET dislikes = 1
    WHERE id = "p003"