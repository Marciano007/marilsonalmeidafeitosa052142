Publicação no GitHub Container Registry (GHCR)
------------------------------------------------

Workflow:
- Arquivo: `.github/workflows/ghcr-build.yml`
- Aciona em push para `main` e faz build multi-platform e push para `ghcr.io/<owner>/pet-manager:latest` e `:sha`.

Manual:
- Requer `GHCR_USERNAME` (seu usuário GitHub) e `GHCR_TOKEN` (Personal Access Token com `write:packages`).
- Script (Linux/macOS): `GHCR_USERNAME=me GHCR_TOKEN=token ./scripts/build-and-push-ghcr.sh`.
- Script (PowerShell):
  ```powershell
  $env:GHCR_USERNAME='me'; $env:GHCR_TOKEN='token'; ./scripts/build-and-push-ghcr.ps1
  ```

Notes:
- CI usa `secrets.GITHUB_TOKEN` para autenticar automaticamente.
- A imagem ficará disponível em `ghcr.io/<github-username>/pet-manager:latest`.
