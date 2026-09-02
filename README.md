<p align="center">
  <img src="./enginy_brand_filled.svg" width="256" height="128" alt="Enginy logo">
</p>

## Overview

Welcome to the **TinyEnginy** take‑home! This exercise is a condensed version of our product and day‑to‑day work. Please treat the codebase as if it were the one you ship to production.


## What you’ll do (at a glance)

These tasks are independent — tackle them in whatever order you consider most important or impactful.

- **Bug fix:** CSV import displays invalid country codes.
- **Bug fix:** Email verification hangs indefinitely with no feedback.
- **Feature:** Add new lead data fields (phone number, years at company, LinkedIn).
- **Feature:** Implement an enrich phone workflow using Temporal.
- **PR Review:** Review an open pull request from a teammate.
- **Analysis:** Propose codebase improvements and a technical roadmap.

## Submission

Please record your screen (and, if possible, your voice) while you work on this task [(opensource tool)](https://cap.so/). We want to see how you collaborate with AI tools, how you reason through trade-offs, and how far you can get within the timebox. Feel free to get comfortable with the project first — set things up, explore the codebase, and understand how it all fits together before you start recording.

The expected work time is around 1 hour. Do not worry if you cannot complete every part of the task. Work in the repository as you see fit, and when you are done, just ping us. We value the time you invest in this task, and we commit to spending a similar amount reviewing it thoroughly. Regardless of the outcome, we’ll provide constructive feedback so you can benefit from the evaluation.


## Getting Started

### Prerequisites

- **[Node.js](https://nodejs.org/)** (use the version in .nvmrc).

- **[pnpm](https://pnpm.io/)** package manager.

- **[SQLite](https://www.sqlite.org/)** (bundled; no separate install required).

- **[Temporal](https://docs.temporal.io/)** — Workflow management system.

- **[Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview)** installed locally, with the provided `ANTHROPIC_API_KEY` configured. If you are more comfortable, you can use any other AI coding tool you have access to.

Install tools:

- Node via nvm: https://github.com/nvm-sh/nvm#installing-and-updating

- pnpm: https://pnpm.io/installation#using-other-package-managers

- Temporal: https://docs.temporal.io/develop/typescript/set-up-your-local-typescript

- Claude Code: https://docs.anthropic.com/en/docs/claude-code/overview

### Environment setup

Set the provided `ANTHROPIC_API_KEY` in your shell before running the project:

```zsh
export ANTHROPIC_API_KEY="your-provided-key"
```

**Backend (one‑time)**

```zsh
cd backend
nvm use                   # Ensure the Node version from .nvmrc
pnpm install              # Install dependencies
pnpm migrate:dev          # Sync local SQLite with Prisma schema
pnpm gen:prisma           # Generate Prisma client
temporal server start-dev # Starts Temporal server
```

**Backend (develop)**

```zsh
cd backend
pnpm run dev           # Starts the API server
```

When you change the [Prisma](https://www.prisma.io/docs) schema:
```zsh
pnpm migrate:dev
```

**Frontend (one‑time)**

```zsh
cd frontend
nvm use                # Ensure the Node version from .nvmrc
pnpm install
```

**Frontend (develop)**

```zsh
cd frontend
pnpm run dev           # Starts the dev server
```

## Task Description

### Bug: CSV country codes

When importing leads from CSV using the example file, the country column displays garbled characters instead of valid country codes.

### Bug: Email verification stalls

The email verification process hangs indefinitely for some leads and never reports a success or failure outcome.

### Feature: New lead fields

Add three new data points for leads: **phone number**, **years at current company**, and **LinkedIn profile URL**.

Users should be able to:

 - See these fields in the leads table
 - Set them via CSV import
 - Use them in message composition

Since the field list will keep growing, the message composition UX needs to scale accordingly (no design provided).

### Feature: Enrich phone

Implement a [**Temporal**](https://docs.temporal.io/) workflow that finds a lead's phone number by querying three providers in sequence:

1. Call **Provider One** → if no phone found,  
2. Call **Provider Two** → if no phone found,  
3. Call **Provider Three** → if no phone found, mark as **No data found**.

#### Requirements
- Each provider call is an **activity** with:
  - Short timeout
  - Retry policy (e.g. 3 attempts, exponential backoff)
- Stop early when a phone is found.
- Idempotent workflow (only one per lead).
- Abstraction layer to handle different provider inputs.
- Show process feedback to the user
- Update frontend accordingly

#### Nice to have

Take into account provider rate limits, right now they have unlimited RPS/RPM, however they told us they will add rate limits to their endpoints.


#### Provider APIs

**Orion Connect**
> Provider with the best data in the market, but slow and fails sometimes
>
> Base URL: `https://api.enginy.ai/api/tmp/orionConnect`
>
> Request: `{ "fullName": "Ada Lovelace", "companyWebsite": "example.com" }`
>
> Authentication: `Request header 'x-auth-me' with key 'mySecretKey123'`
>
> Response: `POST { "phone": string | null }`

**Astra Dialer**
> Provider with the worst data in the market, but is the fastest one
>
> Base URL: `https://api.enginy.ai/api/tmp/astraDialer`
>
> Request: `POST { "email": "john.doe@example.com" }`
>
> Authentication: `Request header 'apiKey' with key '1234jhgf'`
>
> Response: `{ "phoneNmbr": string | null | undefined }`

**Nimbus Lookup**
> New provider in the market
>
> Base URL: `https://api.enginy.ai/api/tmp/numbusLookup`
>
> Request: `POST { "email": "john.doe@example.com", jobTitle: "CTO" }`
>
> Authentication: `Get parameter 'api' with key '000099998888'`
>
> Response: `{ "number": number, "countryCode": "string" }`

### PR review

Review the open PR as if it were from a teammate. Leave inline comments where relevant and provide a summary with a clear approve or request-changes decision.

### Codebase Analysis & Roadmap

Create an `IMPROVEMENTS.md` file as if it were a document in our project management tool.

## Evaluation

You won’t be evaluated on producing a single predefined _correct solution_, but rather on your problem-solving skills, the product mindset you showcase, your ability to reason and explain your thought process, the trade-offs behind your decisions, and how you managed to use AI tools.

---

# Prueba técnica — resumen (Ricardo)

Tenía una hora de time cap y varias cosas que hacer. Los primeros diez o quince minutos los usé en revisar el código: entender qué había que hacer, cómo funcionaba, qué estaba pasando. Era una cosa pequeña, pero al final me quedaron unos cuarenta y tantos minutos efectivos.

A partir de ahí me dieron seis tareas: dos bugs, dos features, un PR y un análisis técnico de refactorización.

## Qué decidí hacer y por qué

**Bug 1 — importación incorrecta de datos** ([PR #4](https://github.com/Genesy-AI/technical-task-ricardo/pull/4)). Decidí atacarlo primero porque, si se generan datos mal y quedan mal en base de datos, acabas teniendo que hacer una limpieza. Es un bug que se extiende: puedes meter clientes, mandatos y datos incorrectos. Lo hice para ahorrar problemas futuros.

**Bug 2 — falta de feedback al usuario en una validación** ([PR #3](https://github.com/Genesy-AI/technical-task-ricardo/pull/3)). Lo detecté justo mientras revisaba el código y decidí atacarlo porque me pareció fácil.

**Code review del PR.** Había dos PRs. Uno era un bump de versión que además arreglaba un leak de seguridad ([PR #1](https://github.com/Genesy-AI/technical-task-ricardo/pull/1)), así que a tope con ello. El otro era una feature nueva ([PR #2](https://github.com/Genesy-AI/technical-task-ricardo/pull/2)), hermana de una de las features que me pedían a mí.

¿Por qué priorizar el PR antes que mi propia feature? Porque así sacamos valor más rápido al usuario. Si me pongo a hacer mi feature y dejo el PR parado, perdemos velocidad de entrega. Es prioritario revisar los PRs para que las cosas vayan saliendo hacia los clientes.

Después del PR ya no me dio tiempo a más.

## Análisis técnico

No hay mucho test, o al menos no los suficientes para mi gusto. No voy a decir que sea espagueti, porque tampoco lo es: son controladores sencillos y el flujo se sigue bastante bien. Pero sí veo llamadas HTTP mezcladas con llamadas a base de datos, y llamadas a base de datos dentro de bucles, cuando en realidad habría que hacer un bulk.

Mi propuesta:

**Sacar el acceso a datos de donde está.** Las llamadas a base de datos tienen que vivir en otra capa, no ahí. Eso pasa por inversión de dependencias e inyección de dependencias. En general, todo SOLID: hay que darle cariño a esa parte. Ahora bien, esto depende de si queremos que escale de verdad o si con algún cambio puntual nos vale y tiramos para adelante.

**Testing.** Sobre todo esto. Montar una pirámide de testing: tests unitarios de absolutamente todo lo que se pueda —no hace falta el cien por cien de cobertura, pero sí una base sólida— e ir subiendo hacia tests funcionales y de aceptación.

**A más largo plazo.** Si queremos ir a algo más serio, yo estoy acostumbrado a trabajar con DDD y CQRS, así que intentaría ir por ahí. Pero eso ya requiere más tiempo: habría que definir una estructura común para que todos trabajemos igual, decidir qué dependencias usar para los buses, y montar algún tipo de caché para la generación automática de servicios. Todo eso lleva bastante más tiempo, pero se podría ir introduciendo poco a poco.