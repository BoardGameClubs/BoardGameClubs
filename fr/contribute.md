---
layout: default
title: "Ajoute ton club de jeux de société à notre annuaire"
description: "Inscris ton club de jeux de société sur Board Game Clubs. Notre annuaire gratuit, maintenu par la communauté, aide les gens à trouver des clubs de jeux de société près de chez eux dans toute l'Europe."
permalink: /fr/contribute/
---

<div class="content-page" markdown="1">

# Ajouter un club de jeux de société

Board Game Clubs est maintenu par la communauté et hébergé sur GitHub. N'importe qui peut ajouter un nouveau club ou mettre à jour des informations existantes.

## Soumettre via notre formulaire

Le moyen le plus simple d'ajouter ton club est notre formulaire sur GitHub. Aucune compétence technique n'est requise — remplis simplement les détails, on s'occupe du reste.

<div class="contribute-actions">
  <a href="https://github.com/BoardGameClubs/BoardGameClubs/issues/new?template=add-club.yml" class="contribute-btn contribute-btn--primary">+ Ajouter un club</a>
  <a href="https://github.com/BoardGameClubs/BoardGameClubs/issues/new?template=edit-club.yml" class="contribute-btn contribute-btn--secondary">Modifier un club</a>
</div>

## Ajouter un club par pull request

Si tu es à l'aise avec GitHub, tu peux ajouter un club directement :

### 1. Créer un nouveau fichier

[Crée un nouveau fichier](https://github.com/BoardGameClubs/BoardGameClubs/new/main/_clubs) dans le dossier `_clubs/<pays>/` sur GitHub, où `<pays>` est le code ISO 3166-1 alpha-2 en minuscules (`gb`, `de`, `at`, `ch`, `nl`, `be`, `it`, `pl`, `fr`, `dk`, `es`). Nomme le fichier selon le schéma `nom-de-ton-club.md` (minuscules, tirets à la place des espaces). Pour les noms avec caractères spéciaux, utilise leur équivalent ASCII : `à→a`, `é→e`, `î→i`, `ô→o`, `ç→c` etc. (par ex. `cafe-jeux-lyon.md`).

### 2. Copier le modèle

Colle ce qui suit dans ton nouveau fichier et remplis les détails. Règle `country` et `permalink` pour qu'ils correspondent au dossier.

```yaml
---
country: "FR"          # ISO 3166-1 alpha-2: GB, DE, AT, CH, NL, BE, IT, PL, FR, DK, ES
permalink: /fr/clubs/nom-de-ton-club/   # Pour GB : /clubs/nom-de-ton-club/
name: "Nom de ton club"
type: ["Board Games"]
days: ["Thursday"]
time: "19:00 - 22:00"
frequency: "Weekly"
location:
  name: "Lieu"
  address: "Adresse complète, code postal, ville"
  lat: 48.8566
  lng: 2.3522
cost: "Free"
age_restriction: ""
image: ""
website: ""
meetup: ""
facebook: ""
discord: ""
bgg: ""
description: >-
  Une courte description de ton club. À quoi jouez-vous ?
  Les nouveaux sont-ils les bienvenus ? Toute autre info utile.
---
```

Les clubs britanniques utilisent `permalink: /clubs/nom-de-ton-club/`. Les clubs de tous les autres pays utilisent `/<pays>/clubs/nom-de-ton-club/`, par exemple `/fr/clubs/...`, `/de/clubs/...`, `/it/clubs/...`.

### 3. Remplir les champs

| Champ | Description |
|------|-------------|
| `country` | Code ISO 3166-1 alpha-2 : `GB`, `DE`, `AT`, `CH`, `NL`, `BE`, `IT`, `PL`, `FR`, `DK`, `ES` |
| `permalink` | `/clubs/slug-de-ton-club/` pour GB ; `/<pays>/clubs/slug-de-ton-club/` pour tous les autres |
| `name` | Nom complet du club |
| `type` | Tableau de types, par ex. `["Board Games"]`. Options : "Board Games", "RPG", "Wargames", "TCG", "BOTC" |
| `days` | Jours de rencontre (en anglais), par ex. `["Thursday"]` ou `["Monday", "Friday"]` |
| `time` | Horaire de la rencontre, par ex. "19:00 - 22:00" |
| `frequency` | "Weekly", "Fortnightly", "Monthly" ou "Ad-hoc" |
| `location` | Lieu, adresse complète avec code postal, coordonnées |
| `cost` | "Free" ou un montant en devise locale, par ex. "€3", "£2", "CHF 5", "kr 20", "zł 10", "€5 (première séance gratuite)" |
| `age_restriction` | Âge requis, par ex. "18+". Laisser vide si aucun |
| `image` | URL ou nom de fichier dans `assets/images/clubs/` |
| `website` | Lien vers le site du club |
| `meetup` | Lien vers le groupe Meetup |
| `facebook` | Lien vers la page ou le groupe Facebook |
| `discord` | Lien d'invitation Discord |
| `bgg` | Lien vers la guilde ou le groupe BoardGameGeek |
| `description` | Texte libre. Le Markdown simple est pris en charge — les lignes vides séparent les paragraphes, les lignes commençant par `-` deviennent des listes. Voir les exemples ci-dessous. |

### Formater la description

Le champ `description` est rendu en Markdown, tu peux donc utiliser paragraphes et listes. Veille à garder l'indentation de deux espaces du block scalar YAML — sinon Jekyll râle.

```yaml
description: |
  Nous sommes un groupe ouvert et nous nous retrouvons au centre de Lyon.
  Les nouveaux sont les bienvenus, on explique les règles.

  Une soirée type :

  - Un eurogame intermédiaire pour commencer
  - Plus tard des jeux de cartes ou des party games plus légers
  - Assez de pauses et de temps pour discuter

```

La notation `>-` du modèle fusionne les sauts de ligne en un seul paragraphe — très bien pour une courte description. Passe à `|` (comme ci-dessus) si tu veux préserver paragraphes et listes.

### 4. Trouver les coordonnées

Pour trouver la latitude et la longitude de ton lieu :

1. Ouvre [OpenStreetMap](https://www.openstreetmap.org)
2. Cherche l'adresse
3. Clic droit sur la carte → « Afficher l'adresse »
4. Les coordonnées apparaissent dans l'URL (lat et lng)

### 5. Ajouter un logo

Tu peux ajouter un logo ou une image pour ton club :

1. Charge ton image dans `assets/images/clubs/` du dépôt (PNG ou JPG, idéalement carrée et sous 200 Ko)
2. Dans le fichier du club, règle le champ `image` sur le nom du fichier, par ex. `image: "logo-de-ton-club.png"`

Tu peux aussi utiliser une URL directe vers une image hébergée ailleurs, par ex. `image: "https://example.com/logo.png"`.

### 6. Ouvrir une pull request

Valide ton fichier et [ouvre une pull request](https://github.com/BoardGameClubs/BoardGameClubs/pulls). On la relit et on l'intègre.

## Ton pays n'est pas dans la liste ?

Nous référençons actuellement des clubs au Royaume-Uni, en Allemagne, en Autriche, en Suisse, aux Pays-Bas, en Belgique, en Italie, en Pologne, en France, au Danemark et en Espagne. Si ton club est ailleurs, [ouvre une issue](https://github.com/BoardGameClubs/BoardGameClubs/issues/new) — ajouter un nouveau pays est un petit changement et on le fait volontiers.

## Mettre à jour un club existant

Trouve le fichier du club dans le [dossier `_clubs/` sur GitHub](https://github.com/BoardGameClubs/BoardGameClubs/tree/main/_clubs), fais tes modifications et soumets une pull request. Ou alors **[ouvre simplement une demande de modification](https://github.com/BoardGameClubs/BoardGameClubs/issues/new?template=edit-club.yml)** et on s'en charge.

</div>
