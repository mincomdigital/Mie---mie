# Build statique avec partials (header/footer)
# Ce script remplace {{HEADER}} et {{FOOTER}} dans src/pages/*.html
# puis genere les pages finales a la racine du repository.

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$pagesDir = Join-Path $repoRoot "src\pages"
$partialsDir = Join-Path $repoRoot "src\partials"

$headerPath = Join-Path $partialsDir "header.html"
$footerPath = Join-Path $partialsDir "footer.html"

if (-not (Test-Path $headerPath) -or -not (Test-Path $footerPath)) {
  throw "Partials manquants: src/partials/header.html et/ou src/partials/footer.html"
}

$header = Get-Content -Raw $headerPath
$footer = Get-Content -Raw $footerPath

if (-not (Test-Path $pagesDir)) {
  throw "Dossier source introuvable: src/pages"
}

Get-ChildItem -Path $pagesDir -Filter "*.html" | ForEach-Object {
  $template = Get-Content -Raw $_.FullName
  $output = $template.Replace("{{HEADER}}", $header).Replace("{{FOOTER}}", $footer)
  $targetPath = Join-Path $repoRoot $_.Name
  Set-Content -Path $targetPath -Value $output -Encoding UTF8
  Write-Host "Genere: $($_.Name)"
}
