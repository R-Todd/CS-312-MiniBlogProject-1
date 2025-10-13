CREATE TABLE users (
	user_id VARCHAR(255) PRIMARY KEY,
	password VARCHAR(255) NOT NULL,
	name VARCHAR(255) NOT NULL
);

CREATE TABLE blogs (
	blog_id SERIAL PRIMARY KEY,
	creator_name VARCHAR(255),
	creator_user_id VARCHAR(255) REFERENCES users(user_id),
	title VARCHAR(255),
	body TEXT,
	date_created TIMESTAMP DEFAULT NOW()
)