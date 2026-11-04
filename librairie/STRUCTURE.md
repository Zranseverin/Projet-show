# Structure du projet Librairie

Ce projet est organisé pour que chaque partie importante soit facile à retrouver.

## Vue principale

- `resources/views/welcome.blade.php`
  - Point d'entrée de la page.
  - Charge le layout `layouts.app`.

- `resources/views/layouts/app.blade.php`
  - Structure HTML globale.
  - Charge le CSS, le header, le contenu, le footer et le JavaScript.

## Partial communs

- `resources/views/partial/header.blade.php`
  - Header global.
  - Navbar.
  - Hero affiché sur tout le projet.

- `resources/views/partial/footer.blade.php`
  - Footer global.

## Configuration front API

- `config/api.php`
  - Adresse du projet API externe.
  - Active ou desactive les appels API du front.
  - Liste les endpoints utilises par JavaScript.

- `resources/views/configuration/api.blade.php`
  - Transforme `config/api.php` en variable JavaScript `window.LIBRAIRIE_API`.
  - Ce fichier est appele dans `layouts/app.blade.php` avant `librairie.js`.

- `.env.example`
  - Contient les variables `FRONT_API_*` a recopier dans `.env` quand l'API est prete.

## Base de donnees

- `database/sql/librairie_database.sql`
  - Script SQL complet pour creer la base MySQL du projet.
  - Contient les tables livres, auteurs, categories, panier, commandes, paiements, header et publicites.
  - Contient aussi des donnees de depart reprises du front.

- `database/migrations/*_create_headers_table.php`
  - Cree la table `headers` pour rendre le header, la navbar et le hero administrables.

- `app/Models/Header.php`
  - Modele Laravel lie a la table `headers`.

## Pages

Toutes les pages sont dans `resources/views/pages`.

- `index.blade.php`
  - Liste les pages avec des `@include`.
  - Sert de sommaire.

- `accueil.blade.php`
  - Page d'accueil.

- `catalogue.blade.php`
  - Catalogue, filtres, grille de livres et carrousel catalogue.

- `produit.blade.php`
  - Page détail livre.

- `mon-panier.blade.php`
  - Page Mon panier.

- `authenfication.blade.php`
  - Page de connexion.

- `inscription.blade.php`
  - Formulaire inscription inclus dans la page authentification.

- `commande.blade.php`
  - Checkout / commande.

- `confirmation.blade.php`
  - Confirmation de commande.

- `compte.blade.php`
  - Espace compte client.

- `suivi-commande.blade.php`
  - Suivi de livraison.

- `recherche.blade.php`
  - Page de recherche.

- `auteur.blade.php`
  - Page auteur.

- `navigation-mobile.blade.php`
  - Barre de navigation mobile.

- `recu.blade.php`
  - Reçu / facture.

- `mot-de-passe-oublie.blade.php`
  - Mot de passe oublié.

- `publicite-sticky.blade.php`
  - Publicité flottante.

- `modal-qr-paiement.blade.php`
  - Modal de paiement QR code.

## Assets

- `public/css/librairie.css`
  - Tous les styles.

- `public/js/librairie.js`
  - Toute la logique JavaScript.
  - Charge les livres depuis l'API si `FRONT_API_ENABLED=true`.
  - Garde les livres demo si l'API n'est pas disponible.

## Routes

- `routes/web.php`
  - Les URLs Laravel pointent vers `welcome`.
  - Le JavaScript affiche ensuite la bonne page interne.


