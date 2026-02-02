# Pet Manager (Angular)

SPA em Angular para gerenciar Pets e Tutores consumindo a API pública (spec fornecida via Swagger).

Resumo do que está implementado
- SPA em Angular + TypeScript
- Lazy modules para `Pets` e `Tutores`
- Listagem de pets em cards (foto, nome, espécie, idade) com paginação (10 por página) e busca por nome
- Telas de detalhe, criação e edição de Pets e Tutores (inclui upload de fotos)
- Autenticação via `POST /autenticacao/login` com refresh (`PUT /autenticacao/refresh`)
- Padrão Facade para autenticação com `BehaviorSubject`
- Health endpoints (liveness/readiness/health) expostos pelo servidor Node (`server/index.js`)
- Testes unitários com Jest (suites passando localmente)
- Build de produção e Dockerfile (NGINX). Adicionalmente há `Dockerfile.node` para servir via `server/index.js` (fallback + health)

Como rodar localmente (desenvolvimento)
1. Instalar dependências:

```bash
npm ci
```

2. Rodar em modo dev:

```bash
npx ng serve
# abrir http://localhost:4200
```

Build de produção

```bash
npm run build
# saída em dist/<project-name>
```

Docker (opções)
- Imagem NGINX (padrão `Dockerfile`): copia `dist/*` para NGINX e serve a SPA. URLs do cliente requerem fallback para `index.html` (NGINX config).
- Imagem Node (recomendada para CI/health): `Dockerfile.node` usa `server/index.js` e expõe endpoints:
  - `/health` → JSON { status: 'ok' }
  - `/liveness` → 200 'alive'
  - `/readiness` → JSON { ready: true }

Exemplo: rodar a imagem Node localmente (já incluida no repositório):

```bash
# build alternativa (Dockerfile.node)
docker build -f Dockerfile.node -t pet-manager-node:local .

# executar container Node (porta 8080)
docker run -d -p 8080:8080 --name pet-manager-node-local pet-manager-node:local
# abrir http://localhost:8080
```

Testes

```bash
npm test
# cobertura (gera ./coverage e arquivo coverage-report.zip):
npm test -- --coverage -i
```

Relatório de cobertura
- O ZIP `coverage-report.zip` é gerado na raiz do projeto após executar os testes com `--coverage`.

CI / Workflows
- Há workflows em `.github/workflows/`:
  - `ci-docker.yml` (test, build, push a GHCR usando `Dockerfile`)
  - `docker-build.yml` (push para Docker Hub)
  - `ghcr-build.yml` (push para GHCR)
- Observação: as ações exigem secrets/config (ex.: `DOCKERHUB_TOKEN`, `DOCKERHUB_USERNAME`, `GITHUB_TOKEN` já provido pelo Actions). Se o workflow falhar, faça download dos logs (Actions → run → Download logs) e compartilhe para análise.

Itens pendentes / recomendações
- CI: analisar logs do GitHub Actions (estou disponível para analisar se você enviar o ZIP ou fornecer PAT temporário).
- Cobertura: ainda pode ser melhorada — arquivos com baixa cobertura: `src/app/services/api.service.ts` (já adicionei testes para internals, cobertura aumentada).
- Estilos: Tailwind não foi integrado; integrar Tailwind é recomendado se exigido para avaliação de layout.
- Máscaras de formulário: não há biblioteca de máscaras instalada (telefone/data) — recomendo adicionar `ngx-mask` ou similar.

Contato / entrega
- Arquivos principais:
  - `src/app` (código fonte)
  - `server/index.js` (health + fallback)
  - `Dockerfile` and `Dockerfile.node`
  - `.github/workflows/*` (CI)
  - `coverage-report.zip` (relatório gerado localmente)

Instruções finais
- Para reproduzir build, testes e container em sua máquina: execute `npm ci`, `npm run build`, e use `Dockerfile.node` para rodar com health endpoints se preferir suporte a rotas via fallback.
- Se quiser que eu atualize o `Dockerfile` NGINX para incluir `try_files $uri $uri/ /index.html;` eu faço a alteração e recrio a imagem.

Obrigado — se precisar, eu atualizo o README com dados de inscrição e faço o push final.
# Pet Manager (Angular)

Aplicação Single Page em Angular para gerenciar Pets e Tutores consumindo a API pública.

Principais pontos implementados
- Frontend em Angular + TypeScript
- Lazy loading para módulos `Pets` e `Tutores` (módulos esqueleto prontos)
- Listagem de Pets com paginação e busca
- Detalhe do Pet com dados do tutor
- CRUD de Pets (criar, editar, upload de foto)
- CRUD de Tutores (criar, editar, upload, vincular/desvincular pets)
- Autenticação com login e refresh automático de token
- Gerenciamento de estado mínimo via `BehaviorSubject` (facade)
- Testes unitários básicos para serviços
- Dockerfile e workflows para publicação de imagens (Docker Hub + GHCR)

Requisitos para rodar localmente

1. Instalar dependências

```bash
npm install
```

2. Rodar em modo desenvolvimento

```bash
npx ng serve
# abrir http://localhost:4200
```

Build de produção

```bash
npm run build
# saída em dist/<project-name>
```

Docker (local)

O `Dockerfile` está configurado para copiar o conteúdo do build Angular (`dist/*`) para o NGINX.

Build local e execução:

```bash
# build da imagem local
docker build -t pet-manager:latest .

# executar a imagem (ex.: mapear porta 80 para 8080)
docker run -p 8080:80 --rm pet-manager:latest

# abrir http://localhost:8080
```

CI / Publicação de imagens

Docker Hub
- Workflow: `.github/workflows/docker-build.yml` — executa em push para `main` e publica em `DOCKERHUB_USERNAME/pet-manager:latest`.
- Configure os secrets no GitHub: `DOCKERHUB_USERNAME` e `DOCKERHUB_TOKEN`.
- Scripts locais: `scripts/build-and-push.sh` e `scripts/build-and-push.ps1`.

GitHub Container Registry (GHCR)
- Workflow: `.github/workflows/ghcr-build.yml` — executa em push para `main` e publica em `ghcr.io/<owner>/pet-manager:latest`.
- Para publish manual use `scripts/build-and-push-ghcr.sh` / `scripts/build-and-push-ghcr.ps1`.
- Para publicação manual via GHCR você precisa de um Personal Access Token com permissões `write:packages`.

Scripts
- `scripts/build-and-push.sh` — build & push para Docker Hub (Linux/macOS)
- `scripts/build-and-push.ps1` — build & push para Docker Hub (PowerShell)
- `scripts/build-and-push-ghcr.sh` — build & push para GHCR (Linux/macOS)
- `scripts/build-and-push-ghcr.ps1` — build & push para GHCR (PowerShell)

Testes

```bash
npm test
```

Observações finais
- O projeto foi scaffoldado parcialmente manualmente no ambiente onde você está trabalhando (alguns comandos CLI foram bloqueados). Todos os arquivos essenciais para rodar/rodar build e empacotar em container estão no repositório.
- Caso não consiga rodar `docker` localmente aqui, use os workflows do GitHub (configurar secrets) para gerar imagens automaticamente.

O que ficou por fazer / melhorias possíveis
- Refinamento de estilos (Tailwind está previsto, pendente configuração completa)
- Testes e cobertura mais abrangentes
- Validar formatos de resposta da API (o cliente trata algumas variações)

Contato
- Inscrição / Vaga: inclua seus dados aqui quando for subir o repositório final.
Projeto Pet Manager (Angular)

Arquitetura e instruções básicas:

- Framework: Angular + TypeScript
- CSS: Tailwind (configurar após instalar dependências)
- Rotas lazy para `Pets` e `Tutores`

Como iniciar (local):

```bash
npm install
npx ng serve
```

Docker (build):

```bash
docker build -t pet-manager:latest .
```

Notas:
- O scaffold inicial foi criado manualmente. Rode `npm install` antes de usar.
- Ver README completo no repositório para detalhes de arquitetura e testes.

Executando o container (após build):

```bash
# cria a imagem
docker build -t pet-manager:latest .

# executa o container (mapeia porta 80 do container -> 8080 local)
docker run -p 8080:80 --rm pet-manager:latest

# então abra http://localhost:8080
```

Observações importantes:
- O `Dockerfile` assume que `npm run build` gera a pasta `dist/<project-name>` (padrão Angular CLI). Se o build gerar um subdiretório, o `Dockerfile` copia o primeiro subdiretório de `dist/` para o `nginx`.
- Se preferir rodar localmente em desenvolvimento, use `npx ng serve` após `npm install`.

CI / Build automático (GitHub Actions)
-----------------------------------

O repositório inclui um workflow GitHub Actions que constrói e publica a imagem no Docker Hub automaticamente quando houver push na branch `main`.

Configurar secrets no repositório (Settings → Secrets):
- `DOCKERHUB_USERNAME` — seu usuário Docker Hub
- `DOCKERHUB_TOKEN` — token ou senha do Docker Hub (recomendado usar token)

Depois de configurar os secrets, um push para `main` disparará o workflow e publicará a imagem como:

- `<DOCKERHUB_USERNAME>/pet-manager:latest`
- `<DOCKERHUB_USERNAME>/pet-manager:<commit-sha>`

Também há scripts locais em `scripts/` para facilitar build e push manual:

```bash
# Linux/macOS
DOCKERHUB_USERNAME=me DOCKERHUB_TOKEN=token ./scripts/build-and-push.sh

# Windows PowerShell
$env:DOCKERHUB_USERNAME='me'; $env:DOCKERHUB_TOKEN='token'; ./scripts/build-and-push.ps1
```

