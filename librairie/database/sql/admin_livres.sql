-- Base SQL pour gerer les livres depuis un espace admin
-- Objectif: quand l'admin ajoute un livre dans la table books,
-- l'API peut lire les livres actifs et les afficher sur le site.
-- Type cible: MySQL / MariaDB

CREATE DATABASE IF NOT EXISTS librairie
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE librairie;

SET FOREIGN_KEY_CHECKS = 0;

DROP VIEW IF EXISTS api_books;
DROP TABLE IF EXISTS book_categories;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS authors;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','client') NOT NULL DEFAULT 'client',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE authors (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  bio TEXT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE categories (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(150) NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE books (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  author_id BIGINT UNSIGNED NULL,
  title VARCHAR(220) NOT NULL,
  slug VARCHAR(240) NOT NULL UNIQUE,
  isbn VARCHAR(30) NULL UNIQUE,
  description TEXT NULL,
  cover_image VARCHAR(500) NULL,
  cover_background VARCHAR(255) NULL DEFAULT 'linear-gradient(145deg,#2A5F8E,#1a3a5c)',
  cover_emoji VARCHAR(20) NULL DEFAULT '📘',
  format VARCHAR(80) NOT NULL DEFAULT 'Poche',
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  old_price DECIMAL(10,2) NULL,
  stock_quantity INT UNSIGNED NOT NULL DEFAULT 0,
  rating DECIMAL(2,1) NOT NULL DEFAULT 0.0,
  review_count INT UNSIGNED NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_books_active (is_active),
  INDEX idx_books_featured (is_featured),
  INDEX idx_books_title (title),
  CONSTRAINT fk_books_author FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE SET NULL,
  CONSTRAINT fk_books_admin FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE book_categories (
  book_id BIGINT UNSIGNED NOT NULL,
  category_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (book_id, category_id),
  CONSTRAINT fk_book_categories_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  CONSTRAINT fk_book_categories_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Vue a utiliser par l'API front: GET /api/books
-- Le JS du front attend des champs comme title, author, price, cover, bg, format.
CREATE VIEW api_books AS
SELECT
  b.id,
  b.title,
  b.slug,
  COALESCE(a.name, 'Auteur inconnu') AS author,
  b.format,
  b.price,
  b.old_price,
  b.stock_quantity AS stock,
  b.rating AS stars,
  b.review_count AS reviews,
  b.cover_emoji AS emoji,
  b.cover_image AS cover,
  b.cover_background AS bg,
  b.is_featured,
  b.created_at
FROM books b
LEFT JOIN authors a ON a.id = b.author_id
WHERE b.is_active = TRUE
ORDER BY b.is_featured DESC, b.created_at DESC;

-- Donnees de depart
INSERT INTO users (name, email, password, role) VALUES
('Administrateur', 'admin@chapitre.test', '$2y$12$example.hash.password', 'admin');

INSERT INTO authors (name, slug) VALUES
('Frank Herbert', 'frank-herbert'),
('George Orwell', 'george-orwell'),
('Antoine de Saint-Exupery', 'antoine-de-saint-exupery');

INSERT INTO categories (name, slug) VALUES
('Science-Fiction', 'science-fiction'),
('Litterature', 'litterature'),
('Jeunesse', 'jeunesse');

INSERT INTO books
(author_id, title, slug, isbn, description, cover_image, cover_background, cover_emoji, format, price, old_price, stock_quantity, rating, review_count, is_featured, created_by)
VALUES
(1, 'Dune', 'dune', '9780441172719', 'Un grand classique de la science-fiction.', 'https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg', 'linear-gradient(145deg,#2A5F8E,#1a3a5c)', '📘', 'Poche', 6250.00, 7900.00, 25, 5.0, 142, TRUE, 1),
(2, '1984', '1984', '9780451524935', 'Roman dystopique de George Orwell.', 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg', 'linear-gradient(145deg,#3D6B3A,#2A4A27)', '📗', 'Poche', 5200.00, 6550.00, 18, 5.0, 98, TRUE, 1),
(3, 'Le Petit Prince', 'le-petit-prince', '9780156012195', 'Conte poetique et philosophique.', 'https://covers.openlibrary.org/b/isbn/9780156012195-L.jpg', 'linear-gradient(145deg,#B8860B,#7A5C00)', '📙', 'Poche', 4250.00, 5600.00, 40, 5.0, 314, TRUE, 1);

INSERT INTO book_categories (book_id, category_id) VALUES
(1, 1),
(2, 2),
(3, 3);

-- Exemple: ajout d'un livre depuis admin.
-- Apres cet INSERT, l'API doit lire SELECT * FROM api_books;
-- et le livre apparaitra automatiquement sur le site.
/*
INSERT INTO authors (name, slug)
VALUES ('Nouvel Auteur', 'nouvel-auteur');

INSERT INTO books
(author_id, title, slug, isbn, description, cover_image, format, price, stock_quantity, is_featured, created_by)
VALUES
(LAST_INSERT_ID(), 'Nouveau Livre', 'nouveau-livre', '9780000000000', 'Description du livre.', 'https://covers.openlibrary.org/b/isbn/9780000000000-L.jpg', 'Broche', 10000.00, 10, TRUE, 1);
*/
