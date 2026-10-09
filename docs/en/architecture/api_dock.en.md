# Mat-Calc — API Documentation

## Overview

Mat-Calc is a web application for computations on matrices and in the field of information theory.  
The backend is implemented with Spring Boot, the frontend with React + Vite.

The API is split into two main groups:

- `/api/matrix` — matrix operations and solutions of systems of linear equations;
- `/api/info` — computation of marginal and conditional distributions, and entropy.

## Base URL

```text
http://localhost:8080
```

During development the frontend proxies requests through Vite, so the code uses relative paths such as `/api/matrix/...` and `/api/info/...`.

## Authentication

The current version of the API does not require authentication.

CORS is configured for the following origin:

```text
http://localhost:5173
```

## Common headers

| Header           | Type   | Required | Description                                                                  |
| :--------------- | :----- | :------- | :--------------------------------------------------------------------------- |
| `Content-Type`   | string | Yes      | For POST requests: `application/json`.                                       |
| `Accept-Language`| string | No       | Affects the language of messages on the `/api/info/*` endpoints. E.g. `ru`, `en`. |

## Error handling

All domain errors are handled by `GlobalExceptionHandler` and returned in the following format:

```json
{
  "message": "Error description"
}
```

Main HTTP statuses:

| Status code       | Description                                                                |
| :---------------- | :------------------------------------------------------------------------- |
| `200 OK`          | The request completed successfully.                                        |
| `400 Bad Request` | Invalid matrix, singular matrix, invalid distribution, and so on.          |

Exceptions that result in `400 Bad Request`:

- `InvalidMatrixException`;
- `SingularMatrixException`;
- `InvalidProbabilityException`.

---

## Endpoints — Matrices

Base path: `/api/matrix`.

### 1. Matrix determinant

**Endpoint:** `POST /api/matrix/determinant`

**Request body (`MatrixRequest`):**

```json
{
  "matrix": [[1, 2], [3, 4]]
}
```

| Field    | Type         | Description      |
| :------- | :----------- | :--------------- |
| `matrix` | `number[][]` | Square matrix.   |

> In the current `MatrixRequest` DTO, the `matrix` field is declared as `Integer[][]`.

**Response (`MatrixResponse`):**

```json
{
  "determinant": -2.0
}
```

| Field         | Type     | Description              |
| :------------ | :------- | :----------------------- |
| `determinant` | `number` | The determinant value.   |

**Possible errors:**

- `400 Bad Request` — the matrix is not square or is invalid.

---

### 2. Inverse matrix

**Endpoint:** `POST /api/matrix/inverse`

**Request body (`MatrixRequest`):**

```json
{
  "matrix": [[4, 7], [2, 6]]
}
```

**Response (`MatrixResultResponse`):**

```json
{
  "matrix": [[0.6, -0.7], [-0.2, 0.4]]
}
```

| Field    | Type         | Description       |
| :------- | :----------- | :---------------- |
| `matrix` | `number[][]` | The inverse matrix. |

**Possible errors:**

- `400 Bad Request` — the matrix is not square;
- `400 Bad Request` — the matrix is singular and cannot be inverted.

---

### 3. Eigenvalues and eigenvectors

**Endpoint:** `POST /api/matrix/eigen`

**Request body (`MatrixRequest`):**

```json
{
  "matrix": [[2, 0], [0, 3]]
}
```

**Response (`EigenResponse`):**

```json
{
  "eigenvalues": [3.0, 2.0],
  "eigenvectors": [[0.0, 1.0], [1.0, 0.0]]
}
```

| Field          | Type         | Description                                     |
| :------------- | :----------- | :---------------------------------------------- |
| `eigenvalues`  | `number[]`   | Eigenvalues.                                    |
| `eigenvectors` | `number[][]` | Eigenvectors corresponding to the eigenvalues.  |

**Possible errors:**

- `400 Bad Request` — the matrix is not square;
- `400 Bad Request` — the matrix has complex eigenvalues (not supported).

---

### 4. Solving a linear system using Cramer's rule

**Endpoint:** `POST /api/matrix/solve/cramer`

**Request body (`LinearSystemRequest`):**

```json
{
  "matrix": [[2, 1], [1, 3]],
  "constants": [5, 10]
}
```

| Field       | Type         | Description                       |
| :---------- | :----------- | :-------------------------------- |
| `matrix`    | `number[][]` | Coefficient matrix of the system. |
| `constants` | `number[]`   | Vector of free terms.             |

**Response (`LinearSystemResponse`):**

```json
{
  "solution": [1.0, 3.0]
}
```

| Field      | Type       | Description                    |
| :--------- | :--------- | :----------------------------- |
| `solution` | `number[]` | Solution vector of the system. |

**Possible errors:**

- `400 Bad Request` — the matrix is not square;
- `400 Bad Request` — the size of the `constants` vector does not match the order of the matrix;
- `400 Bad Request` — the determinant is zero; the system has no unique solution.

---

### 5. Solving a linear system using the inverse matrix method

**Endpoint:** `POST /api/matrix/solve/inverse`

**Request body (`LinearSystemRequest`):**

```json
{
  "matrix": [[2, 1], [1, 3]],
  "constants": [5, 10]
}
```

**Response (`LinearSystemResponse`):**

```json
{
  "solution": [1.0, 3.0]
}
```

**Possible errors:**

- `400 Bad Request` — the matrix is not square;
- `400 Bad Request` — the size of the `constants` vector does not match the order of the matrix;
- `400 Bad Request` — the matrix is singular.

---

### 6. Solving a linear system using Gaussian elimination

**Endpoint:** `POST /api/matrix/solve/gauss`

**Request body (`LinearSystemRequest`):**

```json
{
  "matrix": [[2, 1], [1, 3]],
  "constants": [5, 10]
}
```

**Response (`LinearSystemResponse`):**

```json
{
  "solution": [1.0, 3.0]
}
```

**Possible errors:**

- `400 Bad Request` — the matrix is not square;
- `400 Bad Request` — the size of the `constants` vector does not match the order of the matrix;
- `400 Bad Request` — the system has no unique solution.

---

## Endpoints — Information theory

Base path: `/api/info`.

All endpoints accept a joint probability distribution and return a step-by-step solution.

### 1. Marginal distributions and independence check

**Endpoint:** `POST /api/info/marginals`

**Request body (`JointDistributionRequest`):**

```json
{
  "probabilities": [[0.1, 0.2], [0.3, 0.4]]
}
```

| Field           | Type         | Description                                                                          |
| :-------------- | :----------- | :----------------------------------------------------------------------------------- |
| `probabilities` | `number[][]` | The joint distribution matrix. The sum of all elements must equal 1.                 |

**Response (`SolutionResponse`):**

```json
{
  "answer": "The random variables are dependent",
  "sections": [
    {
      "title": "Marginal distributions",
      "summary": null,
      "steps": [
        {
          "title": "Formula for p(x_i)",
          "formula": "p(x_i) = \\sum_{j} p(x_i, y_j)",
          "substitution": null,
          "result": null,
          "note": null
        }
      ]
    }
  ]
}
```

**Possible errors:**

- `400 Bad Request` — `probabilities` is `null`;
- `400 Bad Request` — one of the rows is `null`;
- `400 Bad Request` — one of the cells is `null`;
- `400 Bad Request` — the distribution is not rectangular;
- `400 Bad Request` — a probability is negative;
- `400 Bad Request` — the sum of probabilities does not equal 1.

---

### 2. Conditional distributions

**Endpoint:** `POST /api/info/conditionals`

**Request body (`JointDistributionRequest`):**

```json
{
  "probabilities": [[0.1, 0.2], [0.3, 0.4]]
}
```

**Response (`SolutionResponse`):**

Contains sections:

- `p(x_i | y_j)`;
- `p(y_j | x_i)`.

The format is the same as for the `/api/info/marginals` endpoint.

**Possible errors:**

- `400 Bad Request` — invalid joint distribution.

---

### 3. Entropy

**Endpoint:** `POST /api/info/entropy`

**Request body (`JointDistributionRequest`):**

```json
{
  "probabilities": [[0.1, 0.2], [0.3, 0.4]]
}
```

**Response (`SolutionResponse`):**

Contains sections:

- `H(X)`;
- `H(Y)`;
- `H(XY)`;
- partial conditional entropies `H_{y_j}(X)`;
- partial conditional entropies `H_{x_i}(Y)`;
- full conditional entropies `H_Y(X)` and `H_X(Y)`.

**Possible errors:**

- `400 Bad Request` — invalid joint distribution.

---

## DTOs

### `MatrixRequest`

```json
{
  "matrix": [[1, 2], [3, 4]]
}
```

| Field    | Type          | Description          |
| :------- | :------------ | :------------------- |
| `matrix` | `Integer[][]` | Matrix of integers.  |

### `LinearSystemRequest`

```json
{
  "matrix": [[2, 1], [1, 3]],
  "constants": [5, 10]
}
```

| Field       | Type         | Description              |
| :---------- | :----------- | :----------------------- |
| `matrix`    | `Double[][]` | Coefficient matrix.      |
| `constants` | `Double[]`   | Vector of free terms.    |

### `JointDistributionRequest`

```json
{
  "probabilities": [[0.1, 0.2], [0.3, 0.4]]
}
```

| Field           | Type         | Description              |
| :-------------- | :----------- | :----------------------- |
| `probabilities` | `Double[][]` | Joint distribution.      |

### `MatrixResponse`

```json
{
  "determinant": -2.0
}
```

### `MatrixResultResponse`

```json
{
  "matrix": [[0.6, -0.7], [-0.2, 0.4]]
}
```

### `LinearSystemResponse`

```json
{
  "solution": [1.0, 3.0]
}
```

### `EigenResponse`

```json
{
  "eigenvalues": [3.0, 2.0],
  "eigenvectors": [[0.0, 1.0], [1.0, 0.0]]
}
```

### `SolutionResponse`

```json
{
  "answer": "Short answer",
  "sections": []
}
```

| Field      | Type                | Description                       |
| :--------- | :------------------ | :-------------------------------- |
| `answer`   | `string`            | Short summary answer.             |
| `sections` | `SectionResponse[]` | Sections with the step-by-step solution. |

### `SectionResponse`

| Field     | Type             | Description                       |
| :-------- | :--------------- | :-------------------------------- |
| `title`   | `string`         | Section title.                    |
| `summary` | `string \| null` | Short conclusion for the section. |
| `steps`   | `StepResponse[]` | Solution steps.                   |

### `StepResponse`

| Field          | Type             | Description                                                              |
| :------------- | :--------------- | :----------------------------------------------------------------------- |
| `title`        | `string \| null` | Step title.                                                              |
| `formula`      | `string \| null` | Formula in LaTeX format.                                                 |
| `substitution` | `string \| null` | Substitution of values in LaTeX format.                                  |
| `result`       | `string \| null` | Result of the step.                                                      |
| `note`         | `string \| null` | Note.                                                                    |

### `ApiError`

```json
{
  "message": "Error description"
}
```

---

## Request examples

### Determinant

```http
POST /api/matrix/determinant
Content-Type: application/json

{
  "matrix": [[1, 2], [3, 4]]
}
```

### Solving a system using Cramer's rule

```http
POST /api/matrix/solve/cramer
Content-Type: application/json

{
  "matrix": [[2, 1], [1, 3]],
  "constants": [5, 10]
}
```

### Marginal distributions

```http
POST /api/info/marginals
Content-Type: application/json
Accept-Language: en

{
  "probabilities": [[0.1, 0.2], [0.3, 0.4]]
}
```

---

## Constraints

- The matrix must not be empty.
- The matrix must be rectangular.
- For the `determinant`, `inverse`, `eigen`, `cramer`, `solveByInverse`, and `gauss` operations, the matrix must be square.
- For `cramer`, `solveByInverse`, and `gauss`, the length of the `constants` vector must match the order of the matrix.
- The joint distribution must be non-negative and must sum to `1` with tolerance `1e-6`.
- The maximum matrix size on the frontend is `10 × 10` (a UI limitation, not an API one).

---

## Versioning

The current API version does not use a version prefix.  
If needed, versioning can be added in the future:

```text
/api/v2/matrix/...
/api/v2/info/...
```