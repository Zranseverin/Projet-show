# Déploiement SSH

Le workflow `.github/workflows/deploy.yml` déploie ce dépôt Laravel après un
push sur `master`, ou manuellement depuis GitHub Actions. Le job utilise
l'environnement GitHub `production`.

## Configuration GitHub

Créer ces secrets dans le dépôt (Settings > Secrets and variables > Actions)
ou dans l'environnement `production` :

| Secret | Valeur |
| --- | --- |
| SSH_HOST | Adresse du serveur |
| SSH_USER | Utilisateur SSH de déploiement |
| SSH_PRIVATE_KEY | Clé privée dédiée, avec passphrase ; clé publique dans authorized_keys |
| SSH_PASSPHRASE | Passphrase qui déverrouille la clé SSH_PRIVATE_KEY |
| ENV_FILE | Contenu complet du .env de production, requis au premier deploiement |
| DEPLOY_PATH | Chemin absolu du dossier contenant artisan, sans espaces, par exemple /home/user/application |

Chaque dépôt possède ses propres secrets et son propre DEPLOY_PATH.

## Préparation du serveur

- Installer PHP 8.4 avec les extensions exigées par composer.lock, Bash et rsync.
- Configurer ENV_FILE pour le premier deploiement. Le dossier est cree
  automatiquement et un fichier .env existant est conserve.
- Donner à l'utilisateur SSH les droits d'écriture dans le projet et permettre
  au processus PHP du serveur d'écrire dans storage et bootstrap/cache.
- Configurer le serveur web pour servir le dossier `public` de l'application.
- Autoriser les connexions SSH depuis les runners GitHub.

## Fonctionnement

GitHub installe les dépendances PHP sans les outils de développement et compile
les assets avec Node 22. Le backoffice utilise npm install tant qu'il ne possède
pas de package-lock.json ; ajouter ce fichier au dépôt permet d'utiliser npm ci.

Le transfert rsync préserve le .env du serveur, storage et public/storage.
Il n'utilise pas --delete : les fichiers retirés du dépôt restent donc sur le
serveur. Les migrations sont exécutées avec --force, puis le lien de stockage,
les caches Laravel et le signal de redémarrage des workers sont mis à jour.

Ce déploiement met à jour le dossier en place : il n'est pas atomique et ne
fournit pas de retour arrière automatique. Sauvegarder la base avant les
migrations. Aucun déploiement n'est lancé depuis cette configuration locale.


## D?p?ts imbriqu?s

Les commandes de build et le transfert utilisent le dossier `librairie/`.
Si le checkout du d?p?t parent ne contient pas l?application, le workflow
r?cup?re la branche master de `Zranseverin/Projet-show` dans ce dossier.
Pour un d?p?t applicatif priv? distinct, ajouter le secret `APP_REPO_TOKEN`
avec un acc?s en lecture au contenu de ce d?p?t.
Les changements de l?application doivent ?tre commit?s et pouss?s dans son
propre d?p?t avant de d?clencher le d?ploiement du d?p?t parent.

La clé publique du serveur est récupérée automatiquement avec ssh-keyscan.
Aucun secret SSH_KNOWN_HOSTS n’est requis ; cette récupération ne vérifie pas
l’identité du serveur auprès d’une source de confiance.

## Tests avant deploiement

Le workflow installe les dependances de developpement, compile les assets,
puis execute `php artisan test` avec SQLite en memoire et une cle temporaire.
Un echec bloque le transfert SSH. Apres les tests, les dependances de
developpement sont retirees avant le deploiement.

## Premier deploiement sur un dossier absent

Le workflow cree DEPLOY_PATH et les dossiers Laravel, puis installe le .env
a partir du secret ENV_FILE si aucun .env n'existe. Un .env existant est conserve.
ENV_FILE doit contenir APP_ENV=production, APP_DEBUG=false, APP_KEY (cle Laravel
valide), APP_URL et les identifiants de la base de donnees de production.
La base MySQL/PostgreSQL et son utilisateur doivent etre crees au prealable.
Le serveur doit deja disposer de PHP 8.4, de ses extensions, de rsync et de Bash.
L'utilisateur SSH doit pouvoir creer le chemin DEPLOY_PATH ; configurer le
serveur web vers DEPLOY_PATH/public et les permissions du processus PHP.
Les migrations creent les tables apres le transfert du code.

Le port SSH utilise le secret optionnel `SSH_PORT` (22 par defaut).

## Diagnostic d'un timeout SSH

`ssh: connect to host ... port ...: Connection timed out` indique un echec
avant l'authentification : verifier l'adresse SSH fournie par l'hebergeur,
le port, l'activation de SSH et les regles du pare-feu pour les runners GitHub.
Si une etape SSH precedente a reussi, verifier aussi un blocage temporaire
ou une limite de connexions cote hebergeur.

Le workflow limite l'attente de connexion et verifie l'acces SSH avant les
commandes distantes. Ces controles ne debloquent pas le reseau du serveur.
Un secret ENV_FILE vide est accepte si le serveur possede deja son .env.

Les etapes SSH et rsync reutilisent une connexion via ControlMaster et
ControlPersist (10 minutes). Cela reduit les nouvelles connexions si
l'hebergeur applique une limitation. La connexion est fermee en fin de job.
Si le timeout persiste, faire verifier les restrictions SSH par l'hebergeur.

La connexion persistante est maintenant ouverte explicitement avant toute
commande distante, avec 5 tentatives espacees de 20, 40, 60 et 80 secondes.
Seule l'ouverture de connexion est repetee ; les migrations et les autres
commandes de deploiement ne sont pas rejouees automatiquement.
La recuperation des cles du serveur dispose aussi de 3 tentatives.
Le secret optionnel SSH_KNOWN_HOSTS permet de fournir les cles du serveur
verifiees aupres de l'hebergeur et d'eviter ssh-keyscan.
Un filtrage permanent exige une intervention de l'hebergeur ; si les IP
des runners sont filtrees, utiliser un runner avec une IP fixe autorisee.
