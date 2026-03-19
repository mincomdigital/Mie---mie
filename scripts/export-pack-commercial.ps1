param(
  [string]$OutputDir = "livraison-commercial\exports"
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
$targetDir = Join-Path $repoRoot $OutputDir

# Nettoyage du dossier export.
if (Test-Path $targetDir) {
  Remove-Item -Recurse -Force $targetDir
}
New-Item -ItemType Directory -Force -Path $targetDir | Out-Null

# Copie des fichiers necessaires a la demo.
$files = @(
  "index.html",
  "menu.html",
  "a-propos.html",
  "faq.html",
  "contact.html",
  "mentions-legales.html",
  "politique-confidentialite.html",
  "assets"
)

foreach ($item in $files) {
  Copy-Item -Recurse -Force (Join-Path $repoRoot $item) $targetDir
}

# Creation du zip pret a envoyer.
$zipPath = Join-Path $targetDir "Mie-a-Mie-Rouen-PACK-COMMERCIAL.zip"
if (Test-Path $zipPath) {
  Remove-Item -Force $zipPath
}

Compress-Archive -Path (Join-Path $targetDir "*") -DestinationPath $zipPath -CompressionLevel Optimal
Write-Host "Pack exporte:" $zipPath
