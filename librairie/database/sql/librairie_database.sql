-- Base de donnees du projet Chapitre / Librairie
-- Type cible: MySQL 8+
-- Import possible: phpMyAdmin, MySQL Workbench, Adminer ou ligne de commande.

CREATE DATABASE IF NOT EXISTS librairie
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE librairie;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS book_categories;
DROP TABLE IF EXISTS book_formats;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS authors;
DROP TABLE IF EXISTS publishers;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS headers;
DROP TABLE IF EXISTS advertisements;
DROP TABLE IF EXISTS password_reset_codes;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  phone VARCHAR(40) NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('client','admin') NOT NULL DEFAULT 'client',
  email_verified_at TIMESTAMP NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  remember_token VARCHAR(100) NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE addresses (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  label VARCHAR(80) NOT NULL DEFAULT 'Adresse principale',
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(40) NULL,
  address_line VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  postal_code VARCHAR(30) NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'Cote d Ivoire',
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_addresses_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE authors (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  bio TEXT NULL,
  avatar VARCHAR(255) NULL,
  birth_year SMALLINT NULL,
  death_year SMALLINT NULL,
  nationality VARCHAR(120) NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE publishers (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE categories (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(150) NOT NULL UNIQUE,
  icon VARCHAR(30) NULL,
  description TEXT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE books (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  author_id BIGINT UNSIGNED NULL,
  publisher_id BIGINT UNSIGNED NULL,
  title VARCHAR(220) NOT NULL,
  slug VARCHAR(240) NOT NULL UNIQUE,
  isbn VARCHAR(30) NULL UNIQUE,
  synopsis TEXT NULL,
  cover_image VARCHAR(255) NULL,
  cover_emoji VARCHAR(20) NULL,
  cover_background VARCHAR(255) NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  old_price DECIMAL(10,2) NULL,
  stock_quantity INT UNSIGNED NOT NULL DEFAULT 0,
  rating DECIMAL(2,1) NOT NULL DEFAULT 0.0,
  review_count INT UNSIGNED NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_new BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  published_at DATE NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_books_active_featured (is_active, is_featured),
  INDEX idx_books_title (title),
  CONSTRAINT fk_books_author FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE SET NULL,
  CONSTRAINT fk_books_publisher FOREIGN KEY (publisher_id) REFERENCES publishers(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE book_formats (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  book_id BIGINT UNSIGNED NOT NULL,
  format VARCHAR(80) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_book_format (book_id, format),
  CONSTRAINT fk_book_formats_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE book_categories (
  book_id BIGINT UNSIGNED NOT NULL,
  category_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (book_id, category_id),
  CONSTRAINT fk_book_categories_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  CONSTRAINT fk_book_categories_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE reviews (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NULL,
  book_id BIGINT UNSIGNED NOT NULL,
  rating TINYINT UNSIGNED NOT NULL,
  comment TEXT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_reviews_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE carts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NULL,
  session_id VARCHAR(120) NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_carts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE cart_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cart_id BIGINT UNSIGNED NOT NULL,
  book_id BIGINT UNSIGNED NOT NULL,
  format VARCHAR(80) NOT NULL DEFAULT 'Broche',
  quantity INT UNSIGNED NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_cart_book_format (cart_id, book_id, format),
  CONSTRAINT fk_cart_items_cart FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
  CONSTRAINT fk_cart_items_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE orders (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NULL,
  order_number VARCHAR(40) NOT NULL UNIQUE,
  customer_name VARCHAR(160) NOT NULL,
  customer_email VARCHAR(180) NOT NULL,
  customer_phone VARCHAR(40) NULL,
  shipping_address VARCHAR(255) NOT NULL,
  shipping_city VARCHAR(100) NOT NULL,
  shipping_country VARCHAR(100) NOT NULL DEFAULT 'Cote d Ivoire',
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  shipping_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status ENUM('pending','paid','preparing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
  tracking_code VARCHAR(80) NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE order_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  book_id BIGINT UNSIGNED NULL,
  title VARCHAR(220) NOT NULL,
  author_name VARCHAR(180) NULL,
  format VARCHAR(80) NOT NULL,
  quantity INT UNSIGNED NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE payments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  provider VARCHAR(80) NOT NULL,
  method VARCHAR(80) NOT NULL,
  transaction_reference VARCHAR(120) NULL UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'XOF',
  status ENUM('pending','success','failed','refunded') NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE headers (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  logo_name VARCHAR(120) NOT NULL DEFAULT 'Chapitre',
  logo_icon TEXT NULL,
  search_placeholder VARCHAR(180) NOT NULL DEFAULT 'Rechercher un livre, un auteur...',
  nav_items JSON NULL,
  hero_eyebrow VARCHAR(180) NULL,
  hero_title VARCHAR(220) NULL,
  hero_title_emphasis VARCHAR(160) NULL,
  hero_subtitle VARCHAR(220) NULL,
  hero_promo VARCHAR(220) NULL,
  hero_cta_label VARCHAR(120) NULL,
  hero_cta_page VARCHAR(80) NOT NULL DEFAULT 'catalogue',
  hero_main_book_page VARCHAR(80) NOT NULL DEFAULT 'product',
  hero_main_book_bg VARCHAR(255) NULL,
  hero_small_books JSON NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_headers_active_order (is_active, sort_order)
) ENGINE=InnoDB;

CREATE TABLE advertisements (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  subtitle VARCHAR(255) NULL,
  brand VARCHAR(120) NULL,
  placement ENUM('home_banner','home_card','catalogue_sidebar','sticky_bottom') NOT NULL,
  image_url VARCHAR(255) NULL,
  background VARCHAR(255) NULL,
  cta_label VARCHAR(120) NULL,
  cta_url VARCHAR(255) NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  starts_at TIMESTAMP NULL,
  ends_at TIMESTAMP NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE password_reset_codes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(180) NOT NULL,
  code VARCHAR(20) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_password_reset_email (email)
) ENGINE=InnoDB;

INSERT INTO categories (id, name, slug, icon, sort_order) VALUES
(1, 'Science-Fiction', 'science-fiction', 'rocket', 1),
(2, 'Litterature', 'litterature', 'book', 2),
(3, 'Thriller', 'thriller', 'knife', 3),
(4, 'Histoire', 'histoire', 'temple', 4),
(5, 'Developpement perso', 'developpement-perso', 'leaf', 5),
(6, 'Jeunesse', 'jeunesse', 'child', 6),
(7, 'BD et Mangas', 'bd-mangas', 'comic', 7);

INSERT INTO authors (id, name, slug) VALUES
(1, 'Frank Herbert', 'frank-herbert'),
(2, 'George Orwell', 'george-orwell'),
(3, 'Antoine de Saint-Exupery', 'antoine-de-saint-exupery'),
(4, 'Paulo Coelho', 'paulo-coelho'),
(5, 'Isaac Asimov', 'isaac-asimov'),
(6, 'Herve Le Tellier', 'herve-le-tellier'),
(7, 'Victor Hugo', 'victor-hugo'),
(8, 'Yuval Noah Harari', 'yuval-noah-harari'),
(9, 'Sally Rooney', 'sally-rooney'),
(10, 'Emmanuel Carrere', 'emmanuel-carrere'),
(11, 'Samantha Harvey', 'samantha-harvey'),
(12, 'Percival Everett', 'percival-everett');

INSERT INTO publishers (id, name, slug) VALUES
(1, 'Chapitre Editions', 'chapitre-editions');

INSERT INTO books
(id, author_id, publisher_id, title, slug, price, stock_quantity, rating, review_count, cover_emoji, cover_background, is_featured, is_new)
VALUES
(1, 1, 1, 'Dune', 'dune', 6250.00, 50, 5.0, 142, 'book-blue', 'linear-gradient(145deg,#2A5F8E,#1a3a5c)', TRUE, FALSE),
(2, 2, 1, '1984', '1984', 5200.00, 40, 5.0, 98, 'book-green', 'linear-gradient(145deg,#3D6B3A,#2A4A27)', TRUE, FALSE),
(3, 3, 1, 'Le Petit Prince', 'le-petit-prince', 4250.00, 80, 5.0, 314, 'book-orange', 'linear-gradient(145deg,#B8860B,#7A5C00)', TRUE, FALSE),
(4, 4, 1, 'L Alchimiste', 'l-alchimiste', 5400.00, 35, 4.0, 211, 'book-red', 'linear-gradient(145deg,#8B3A3A,#5C2020)', TRUE, FALSE),
(5, 5, 1, 'Fondation', 'fondation', 7200.00, 28, 5.0, 88, 'book-purple', 'linear-gradient(145deg,#5B3A8B,#3A1F5C)', TRUE, FALSE),
(6, 6, 1, 'L Anomalie', 'l-anomalie', 5900.00, 31, 4.0, 176, 'book-cyan', 'linear-gradient(145deg,#1A6B6B,#0D4040)', FALSE, TRUE),
(7, 7, 1, 'Les Miserables', 'les-miserables', 8200.00, 22, 5.0, 423, 'book-navy', 'linear-gradient(145deg,#2E4A7A,#182A50)', FALSE, TRUE),
(8, 8, 1, 'Sapiens', 'sapiens', 9100.00, 45, 5.0, 567, 'books', 'linear-gradient(145deg,#4A3B2A,#2E2010)', FALSE, TRUE),
(9, 9, 1, 'Intermezzo', 'intermezzo', 14450.00, 18, 4.0, 34, 'book-blue', 'linear-gradient(145deg,#456789,#2A3D50)', FALSE, TRUE),
(10, 10, 1, 'Le Royaume', 'le-royaume', 6700.00, 26, 4.0, 52, 'book-green', 'linear-gradient(145deg,#3A6B3A,#1E3E1E)', FALSE, TRUE),
(11, 11, 1, 'Orbital', 'orbital', 13100.00, 14, 5.0, 18, 'book-orange', 'linear-gradient(145deg,#5A4A7B,#362955)', FALSE, TRUE),
(12, 12, 1, 'James', 'james', 14100.00, 16, 5.0, 29, 'book-red', 'linear-gradient(145deg,#7B3A3A,#4E1E1E)', FALSE, TRUE);

INSERT INTO book_formats (book_id, format, price, stock_quantity)
SELECT id, CASE WHEN id IN (5,8,9,11,12) THEN 'Broche' ELSE 'Poche' END, price, stock_quantity
FROM books;

INSERT INTO book_categories (book_id, category_id) VALUES
(1,1),(2,2),(3,6),(4,2),(5,1),(6,2),(7,2),(8,4),(9,2),(10,2),(11,1),(12,2);

INSERT INTO headers
(logo_name, search_placeholder, nav_items, hero_eyebrow, hero_title, hero_title_emphasis, hero_subtitle, hero_promo, hero_cta_label, hero_cta_page, hero_main_book_page, hero_main_book_bg, hero_small_books)
VALUES
(
  'Chapitre',
  'Rechercher un livre, un auteur...',
  JSON_ARRAY(
    JSON_OBJECT('label','Tous les livres','page','catalogue','active',true),
    JSON_OBJECT('label','Science-Fiction','page','catalogue'),
    JSON_OBJECT('label','Litterature','page','catalogue'),
    JSON_OBJECT('label','Thriller','page','catalogue'),
    JSON_OBJECT('label','Histoire','page','catalogue'),
    JSON_OBJECT('label','Developpement perso','page','catalogue'),
    JSON_OBJECT('label','Jeunesse','page','catalogue'),
    JSON_OBJECT('label','BD et Mangas','page','catalogue'),
    JSON_OBJECT('label','Promos','page','catalogue')
  ),
  'Livre du mois - Juillet 2025',
  'La Carte et le',
  'Territoire',
  'Prix Goncourt 2010 - Michel Houellebecq',
  'Livraison gratuite des 35 000 FCFA - Retours sous 14 jours',
  'Decouvrir la selection',
  'catalogue',
  'product',
  'linear-gradient(145deg,#2A5F8E,#1a3a5c)',
  JSON_ARRAY(
    JSON_OBJECT('background','linear-gradient(145deg,#3D6B3A,#2A4A27)','icon','book-green'),
    JSON_OBJECT('background','linear-gradient(145deg,#7B3F6E,#4E2647)','icon','book-red')
  )
);

INSERT INTO advertisements (title, subtitle, brand, placement, background, cta_label, cta_url) VALUES
('Kindle Unlimited - 3 mois offerts', 'Accedez a plus d un million de livres et magazines.', 'Amazon', 'home_banner', 'linear-gradient(135deg,#1A2744 0%,#2C4A8C 100%)', 'Essayer gratuitement', '#'),
('Vos livres preferes en audio', 'Un credit offert par mois. Ecoutez partout.', 'Audible', 'home_card', 'linear-gradient(135deg,#FF6B35,#F7931E)', '1 mois gratuit', '#'),
('Babelio Plus', 'Critiques exclusives et alertes nouveautes.', 'Babelio', 'catalogue_sidebar', 'linear-gradient(135deg,#2D6A4F,#52B788)', 'En savoir plus', '#'),
('Fnac+ - Livraison illimitee offerte', 'Commandez autant que vous voulez, sans frais de port.', 'Fnac', 'sticky_bottom', '#0F1F3D', 'Decouvrir l offre', '#');
