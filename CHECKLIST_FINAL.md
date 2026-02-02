Checklist Final - Pet Manager (Angular)

Implementações concluídas:

- Frontend em Angular + TypeScript
- Requisições em tempo real com `axios` (`src/app/services/api.service.ts`)
- Lazy Loading Routes para `Pets` e `Tutores` (`src/app/app.module.ts`)
- Listagem de Pets com paginação (10 por página) e busca por nome (`src/app/pets/pages/pet-list.component.ts`)
- Detalhamento do Pet com tutor, quando disponível (`src/app/pets/pages/pet-detail.component.ts`)
- CRUD Pet (create/update/delete) e upload de foto (`src/app/pets/pets.service.ts`, `pet-form.component.ts`)
- CRUD Tutor e upload de foto, vincular/desvincular pets (`src/app/tutores/*`)
- Autenticação com login e refresh automático de token (`src/app/services/auth.service.ts`, `api.service.ts`)
- Padrão Facade e `BehaviorSubject` para estado de autenticação (`src/app/services/auth.facade.ts`)
- Testes unitários básicos (Jest) — suites presentes e passando localmente (`npm test`)
- Container/Dockerfile e server com health endpoints (`Dockerfile`, `server/index.js`)
- `environment.prod.ts` adicionado (`src/environments/environment.prod.ts`)

Observações / próximos passos sugeridos:

- Aumentar cobertura de testes (components, guards, interceptors)
- Completar configuração do Tailwind e refinamento visual
- Validar responsividade em múltiplos breakpoints

Localização de arquivos relevantes (resumo):

- `src/app/services/api.service.ts` — cliente HTTP + interceptors
- `src/app/services/auth.service.ts` & `auth.facade.ts` — autenticação + facade
- `src/app/pets/*` — list/detail/form/services
- `src/app/tutores/*` — list/detail/form/services
- `server/index.js` — health endpoints + static serving of `dist`
