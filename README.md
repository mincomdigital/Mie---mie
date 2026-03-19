# Mie a Mie Rouen

Site vitrine statique optimise (7 pages) avec un systeme de templates simple.

## Structure

- `src/partials/` : blocs partages (`header.html`, `footer.html`)
- `src/pages/` : templates de pages avec marqueurs `{{HEADER}}` et `{{FOOTER}}`
- `scripts/build.ps1` : genere les pages finales a la racine
- `assets/` : CSS, JS, images

## Pages generees

- `index.html`
- `menu.html`
- `a-propos.html`
- `faq.html`
- `contact.html`
- `mentions-legales.html`
- `politique-confidentialite.html`

## Workflow

1. Modifier les templates dans `src/pages/` et les partials dans `src/partials/`.
2. Lancer le build:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/build.ps1
```

3. Verifier les pages HTML generees a la racine.
4. Committer les changements.

## Tracking GA4 (optionnel)

Configurer `assets/js/analytics-config.js`:

```js
window.MIE_A_MIE_ANALYTICS = {
  gaMeasurementId: "G-XXXXXXXXXX",
  enabled: true
};
```

Si `enabled` est `false` ou `gaMeasurementId` est vide, aucun script GA n'est charge.
