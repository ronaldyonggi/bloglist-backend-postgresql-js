CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author TEXT,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  likes INTEGER DEFAULT 0
);

insert into blogs (author, url, title) values ('Mr. Jenkins', 'www.cijenkins.com', 'CI using Jenkins');
insert into blogs (author, url, title) values ('CEO of GitHub Actions', 'www.github.com', 'Action!');