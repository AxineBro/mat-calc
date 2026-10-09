[![Русский](https://img.shields.io/badge/Русский-Документация-blue?style=flat-square)](docs/ru/README.ru.md)
[![License](https://img.shields.io/badge/License-Apache2.0-green?style=flat-square)](LICENSE)

<div align="center">
  <h1>Mat-Calc</h1>
  <p><em>Web calculator for linear algebra and information theory</em></p>
</div>

A web application for computations over matrices (determinant, inverse matrix, eigenvalues, solving systems of linear equations) and in the field of information theory (marginal and conditional distributions, Shannon entropy). Each operation comes with a step-by-step solution using LaTeX formulas.

## Production deployment (for end users)

The easiest way to run **Mat-Calc** is with **Docker** and **Docker Compose**.  
No building, no Java, no Node.js required.

### Requirements

- [Docker](https://docs.docker.com/get-docker/) (version 20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0+)

### Steps

1. **Download `docker-compose.yml` and `.env.example`** from the repository into the current folder.

   ```bash
   curl -O https://raw.githubusercontent.com/AxineBro/mat-calc/main/docker-compose.yml
   curl -O https://raw.githubusercontent.com/AxineBro/mat-calc/main/.env.example
   ```

2. **Create your `.env` file** from the example:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` if needed (for example, change the exposed port).

3. **Start the application:**

   ```bash
   docker-compose up -d
   ```

4. Open http://localhost in your browser.

All services (backend, frontend, nginx) start automatically.

## Development quick start

### Requirements

- JDK 25
- Node.js 18+ and npm
- Maven

### 1. Backend

```bash
cd backend
./mvnw spring-boot:run
# the backend listens on http://localhost:8080 by default
```

Check:

```bash
curl -X POST http://localhost:8080/api/matrix/determinant \
  -H "Content-Type: application/json" \
  -d '{"matrix":[[1,2],[3,4]]}'
```

Expected response:

```json
{ "determinant": -2.0 }
```

### 2. Frontend

```bash
cd frontend
npm ci
npm run dev
# open http://localhost:5173
```

`vite.config.ts` already proxies `/api` to `http://localhost:8080`, so relative paths are used in the code.

### 3. Production build

```bash
cd frontend
npm ci
npm run build
# the output is in frontend/dist/
```

`dist/` should be served via nginx or any other web server, and `/api/*` should be proxied to the backend.

## Features

### Matrices and systems of linear equations

| Operation | Description |
| :--- | :--- |
| **Determinant** | Computes `det(A)` using Gaussian elimination with partial pivoting. |
| **Inverse matrix** | Computes `A⁻¹` via Gauss–Jordan elimination. |
| **Eigenvalues and eigenvectors** | QR iterations with Wilkinson shift + back substitution for eigenvectors. |
| **Cramer's rule** | Solves a system of linear equations using ratios of determinants. |
| **Inverse matrix method** | Solves a system of linear equations as `x = A⁻¹ · b`. |
| **Gaussian elimination** | Solves a system of linear equations via forward and back substitution. |

### Information theory

| Operation | Description |
| :--- | :--- |
| **Marginal distributions** | `p(x_i)`, `p(y_j)` and an independence check `p(x,y) ?= p(x)·p(y)`. |
| **Conditional distributions** | `p(x_i \| y_j)` and `p(y_j \| x_i)` with substitutions. |
| **Entropy** | `H(X)`, `H(Y)`, `H(XY)`, partial and full conditional entropies. |

### User interface

- Matrix input with a toolbar: undo/redo, adding and removing rows and columns, pasting from the clipboard.
- Loading data from CSV/TSV and drag & drop.
- Theme switching (`system` / `light` / `dark`) and language switching (`ru` / `en`).
- Keyboard shortcuts `Ctrl/Cmd+Z` / `Ctrl/Cmd+Y` for undo/redo.
- Saving entered data in `localStorage`.
- Formula rendering via KaTeX.
- Debounced requests with `AbortController` — cancel the previous request on fast typing.

## Technology stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | `React 19` · `Vite` · `KaTeX` |
| **Backend** | `Java` · `Spring Boot` · `Spring Web` |
| **Build** | `Maven` (backend) · `npm` (frontend) |

## Documentation and architecture

- [Behavior flow](docs/en/architecture/behavior-flow.en.md) — data flow from input to result.
- [API documentation](docs/en/architecture/api_dock.en.md) — all endpoints, DTOs, and error codes.
- [File structure](docs/en/architecture/files_tree.en.md) — how the backend and frontend are organized, and how to add an operation.

## Quick start

### Requirements

- JDK 17+ (or the version required by `pom.xml` in `backend/`);
- Node.js 18+ and npm;
- Maven (or use `mvnw` in `backend/`).

### 1. Backend

```bash
cd backend
./mvnw spring-boot:run
# the backend listens on http://localhost:8080 by default
```

Check:

```bash
curl -X POST http://localhost:8080/api/matrix/determinant \
  -H "Content-Type: application/json" \
  -d '{"matrix":[[1,2],[3,4]]}'
```

Expected response:

```json
{ "determinant": -2.0 }
```

### 2. Frontend

```bash
cd frontend
npm ci
npm run dev
# open http://localhost:5173
```

`vite.config.ts` already proxies `/api` to `http://localhost:8080`, so relative paths are used in the code.

### 3. Production build

```bash
cd frontend
npm ci
npm run build
# the output is in frontend/dist/
```

`dist/` should be served via nginx or any other web server, and `/api/*` should be proxied to the backend.

## API request examples

### Determinant

```http
POST /api/matrix/determinant
Content-Type: application/json

{
  "matrix": [[1, 2], [3, 4]]
}
```

```json
{ "determinant": -2.0 }
```

### Solving a system of linear equations using Cramer's rule

```http
POST /api/matrix/solve/cramer
Content-Type: application/json

{
  "matrix": [[2, 1], [1, 3]],
  "constants": [5, 10]
}
```

```json
{ "solution": [1.0, 3.0] }
```

### Entropy

```http
POST /api/info/entropy
Content-Type: application/json
Accept-Language: en

{
  "probabilities": [[0.1, 0.2], [0.3, 0.4]]
}
```

The response contains an `answer` field with a short summary and `sections` with a step-by-step solution (LaTeX formulas). See the full format in [api_dock.en.md](docs/en/architecture/api_dock.en.md).

## Repository structure

```text
mat-calc/
├── backend/                 # Spring Boot
│   ├── src/main/java/github/axine/matrixcalculator/
│   │   ├── api/             # controllers, DTOs, errors, mappers
│   │   ├── application/     # services and operation registry
│   │   └── domain/          # models, operations, exceptions, formulas
│   └── src/main/resources/  # configuration and localization
├── frontend/                # React + Vite
│   ├── src/api/             # http.ts, matrixApi.ts, infoApi.ts
│   ├── src/components/      # input and output
│   ├── src/hooks/           # useSolution, useMatrixHistory
│   ├── src/i18n/            # localization
│   ├── src/theme/           # themes
│   └── src/utils/           # parsers
├── docs/
│   ├── en/architecture/     # English documentation
│   ├── ru/architecture/     # Russian documentation
│   └── img/
├── LICENSE
└── README.md
```

## Architecture (backend)

The backend follows a layered architecture.

| Layer | Responsibility |
| :--- | :--- |
| **Controller** | REST endpoints, request and response DTOs, CORS. |
| **Application** | `MatrixService`, `InformationService`, `OperationRegistry`. |
| **Domain** | Models (`Matrix`, `LinearSystem`, `JointDistribution`), `MatrixOperation` implementations, domain exceptions, formulas. |
| **API mapper** | Conversion between DTOs and domain models. |
| **Error handling** | `GlobalExceptionHandler` — the single point that turns domain exceptions into `ApiError`. |

### Key patterns

- **Operation registry** — `OperationRegistry` collects all `MatrixOperation` beans via Spring and locates the required one by `OperationType`.
- **Strategy** — each operation is a separate bean implementing a common interface.
- **DTO + Mapper** — the API layer does not depend on the domain layer; the mapping is explicit.
- **Unified error handler** — all domain exceptions are automatically converted into `400 Bad Request`.

## Architecture (frontend)

| Layer | Responsibility |
| :--- | :--- |
| **API** | `postJson` with `Content-Type` and `Accept-Language` headers, `ApiError` class. |
| **State** | `useSolution` — debouncing, request cancellation, `incomplete / loading / success / error` states. |
| **Inputs** | `AugmentedMatrix`, `JointDistributionInput`, `MatrixInput`, `VectorInput`. |
| **Outputs** | `ResultView`, `SolutionSteps`, `Latex`, `MathText`. |
| **Contexts** | `I18nProvider`, `ThemeProvider`. |
| **Operations** | `operations.tsx` — a declarative description of all operations. |

## Localization

All UI texts and backend messages for information theory operations are available in Russian and English. The language is selected in the settings panel and passed to the backend via the `Accept-Language` header. The dictionaries are located in:

- `frontend/src/i18n/translations.ts`;
- `backend/src/main/resources/messages*.properties`.

## How to add a new operation

### Backend

1. Add a value to `OperationType`.
2. Create a class implementing `MatrixOperation<I, O>` and annotate it with `@Component`.
3. Add a method to `MatrixService` / `InformationService`.
4. Add an endpoint to the corresponding controller.
5. Add DTOs and a mapper if needed.

### Frontend

1. Add an entry to `OPERATIONS` (`operations.tsx`).
2. Add an API function in `matrixApi.ts` / `infoApi.ts`.
3. Add a branch to `useSolution`.
4. Add rendering in `ResultView` if a new `resultKind` was introduced.
5. Add translations in `translations.ts`.

## Testing

```bash
# backend
cd backend
./mvnw test

# frontend
cd frontend
npm test
```

## License

This project is distributed under the [Apache License 2.0](LICENSE).

## Author

- **Alexey** — backend, frontend, architecture — [GitHub](https://github.com/AxineBro)