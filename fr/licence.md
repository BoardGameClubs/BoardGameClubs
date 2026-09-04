---
layout: default
title: "Licence"
description: "Comment Board Game Clubs est licencié : MIT avec restriction Commons Clause pour le code, et CC BY 4.0 pour les données des clubs et événements."
permalink: /fr/licence/
---

<div class="content-page" markdown="1">

# Licence

_Dernière mise à jour : {{ site.time | date: "%-d %B %Y" }}_

Board Game Clubs est open source. Cette page résume la licence en termes simples. Le texte intégral et juridiquement contraignant se trouve dans le [fichier LICENSE]({% if site.repository %}https://github.com/{{ site.repository }}/blob/main/LICENSE{% endif %}) du dépôt. En cas de contradiction, le fichier LICENSE prévaut.

## La version courte

Le code source du site est publié sous **MIT License** avec une clause additionnelle **Commons Clause**. En clair :

- **Tu peux** l'utiliser, le copier, le modifier, faire tourner ta propre version et partager tes modifications.
- **Tu ne peux pas** le vendre comme produit ou service. L'héberger contre paiement, ou se faire payer pour le faire tourner pour d'autres, n'est pas autorisé.
- **Tu dois** conserver l'avis de copyright et de licence dans toutes les copies ou œuvres dérivées.
- **Aucune garantie.** Le logiciel est fourni « tel quel ».
- **Les données des clubs et événements sont licenciées séparément.** Elles sont sous [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.fr) : tout le monde peut les réutiliser à condition de créditer BoardGameClubs.org.

## Ce que permet la MIT License

La MIT License est l'une des licences open source les plus permissives. Sous cette licence, tu peux :

- Utiliser le logiciel à n'importe quelle fin.
- Le copier et le distribuer.
- Le modifier et distribuer des versions modifiées.
- L'inclure dans des projets plus larges (y compris commerciaux, sous réserve de la Commons Clause ci-dessous).
- Le sous-licencier.

Seule condition : l'avis de copyright et le texte de la licence doivent accompagner toute copie ou toute partie substantielle du logiciel.

## Ce que restreint la Commons Clause

La Commons Clause ajoute **une** restriction à la MIT License : tu ne peux pas **vendre** le logiciel.

Dans les termes de la licence, « vendre » signifie utiliser les droits accordés par la MIT License pour fournir le logiciel à d'autres **contre rémunération ou contrepartie**, y compris l'héberger pour des clients payants, ou vendre du conseil/support dont la valeur découle substantiellement de ce logiciel.

En pratique :

- Faire tourner ta propre copie gratuite de l'annuaire pour la communauté locale : ok.
- Forker le code et proposer des améliorations : ok.
- Intégrer de petites parties dans un projet plus large : ok.
- Mettre en place une version hébergée payante de cet annuaire et faire payer les utilisateurs ou les clubs pour figurer dessus : pas autorisé sans accord.

La Commons Clause est un [texte standardisé et publié](https://commonsclause.com/), maintenu par Fossa. Elle est volontairement de portée étroite : elle ne restreint que la vente, pas l'utilisation ou la modification.

## Données des clubs et événements

Les fiches des clubs et des événements (les fichiers dans `_clubs/` et `_events/`, et les flux JSON sur `/api/clubs.json` et `/api/events.json`) sont contribuées par la communauté et licenciées séparément du code, sous [Creative Commons Attribution 4.0 (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/deed.fr).

Cela signifie que tu peux copier, partager et adapter les fiches pour n'importe quel usage, y compris commercial, à condition de :

- **Créditer la source.** Cite BoardGameClubs.org comme source et ajoute un lien vers le site.
- **Renvoyer vers la licence.** Indique CC BY 4.0.
- **Signaler les modifications.** Précise si tu as modifié les données.

Attribution suggérée : « Données des clubs et événements de [BoardGameClubs.org](https://boardgameclubs.org), sous licence [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.fr). »

La Commons Clause ci-dessus s'applique uniquement au logiciel. Elle ne restreint pas l'utilisation des données.

En soumettant ou en modifiant une fiche, que ce soit via un formulaire GitHub, une pull request ou tout autre moyen, tu acceptes que ta contribution soit publiée sous CC BY 4.0.

Les logos des clubs et des événements dans `assets/images/` appartiennent à leurs clubs et organisateurs respectifs et ne sont couverts par aucune des deux licences.

Si tu es organisateur ou organisatrice d'un club et que tu veux mettre à jour ou retirer ta fiche, voir la [page de contribution]({{ "/fr/contribute/" | relative_url }}) ou ouvre une issue sur GitHub.

## Logiciels et ressources tierces

Le site utilise plusieurs bibliothèques open source tierces (Leaflet, Leaflet.MarkerCluster, icônes Lucide, Jekyll et d'autres). Chacune est utilisée selon sa propre licence. Tu trouveras la liste complète dans les [fichiers de paquets du dépôt]({% if site.repository %}https://github.com/{{ site.repository }}{% endif %}).

Les tuiles de carte sont fournies par [CARTO](https://carto.com/), les données sont &copy; [contributeurs d'OpenStreetMap](https://www.openstreetmap.org/copyright).

## Aucune garantie

Le logiciel est fourni **« tel quel »**, sans garantie d'aucune sorte, expresse ou implicite. Les auteurs et titulaires des droits ne sont pas responsables des réclamations ou dommages découlant de l'utilisation du logiciel. La clause d'exclusion complète se trouve dans le [fichier LICENSE]({% if site.repository %}https://github.com/{{ site.repository }}/blob/main/LICENSE{% endif %}).

## Contact

Pour toute question sur la licence, ou si tu veux utiliser le logiciel d'une manière que la Commons Clause pourrait restreindre, [ouvre une issue sur GitHub]({% if site.repository %}https://github.com/{{ site.repository }}/issues{% endif %}).

</div>
