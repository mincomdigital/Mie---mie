# Pack Commercial - Mie a Mie Rouen

Ce dossier est prevu pour un commercial qui va en rendez-vous avec un commercant.

## 1) Version la plus simple (ultra rapide)

- Ouvrir `index.html` dans un navigateur.
- Montrer la navigation mobile (barre basse type app).
- Cliquer les CTA (Appeler / Itineraire / Uber Eats / Deliveroo).

## 2) Version propre en local (recommandee)

Lancer un petit serveur local pour eviter les restrictions navigateur:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/export-pack-commercial.ps1
```

Puis ouvrir le dossier `livraison-commercial/exports`.

## 3) Ce qu'il faut dire au commercant

- Le site est pense mobile-first, comme une mini app.
- Les actions rentables sont en acces direct (commande et itineraire).
- Le contenu est modifiable rapidement (header/footer mutualises + templates).

## 4) Lien GitHub

- Repo: https://github.com/mincomdigital/Mie---mie
- GitHub Pages: activer Pages dans les settings du repo (branche `main`, root) si besoin.
