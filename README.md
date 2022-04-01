
# 💻 Projet Web Service 3 💻


![Logo](https://media.discordapp.net/attachments/937712693245276202/951439956792975440/taiga-nest.png)


## 🔗 Projets réalisé par Alexandre Brun-Giglio
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://alexandrebrungiglio.fr/)

## 🛠️ Configuration et lancement du projet

### Installation des dépendances 

```bash
  $ cd auth/
  $ npm i

  $ cd movies/
  $ npm i
```

### Configuration de l'api 

Créez une base de données pour le projet puis dupliquer le fichier `env.default.json` dans le dossier `auth`. 
Renomer le nouveau fichier en `env.json` puis completer le avec vos informations. 

Puis faites de même dans le dossier `movies`

### Lancement du projet 
```bash
  $ cd front/
  $ npm run start

  $ cd back/
  $ npm run start
```

L'api d'authentification écoute sur http://localhost:3088/ et l'api des films écoute sur http://localhost:3080/.

La documentation open api sera disponible aux adresses : http://localhost:3088/swagger & http://localhost:3080/swagger.
