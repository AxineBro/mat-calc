# Mat-Calc Project File Structure

The project consists of two main parts:

```text
mat-calc/
├── backend/   # Spring Boot
└── frontend/  # React + Vite
```

---

## Backend

Root package:

```text
github.axine.matrixcalculator
```

### `MatrixcalculatorApplication.java`

The Spring Boot application entry point.

```java
@SpringBootApplication
public class MatrixcalculatorApplication {
    public static void main(String[] args) {
        SpringApplication.run(MatrixcalculatorApplication.class, args);
    }
}
```

---

### `api/` — REST layer

| Path | Purpose |
| :--- | :--- |
| `api/controller/MatrixController.java` | Endpoints for matrices and systems of linear equations. |
| `api/controller/InformationController.java` | Endpoints for information theory. |
| `api/dto/request/MatrixRequest.java` | Request DTO carrying a matrix. |
| `api/dto/request/LinearSystemRequest.java` | Request DTO for a system of linear equations. |
| `api/dto/request/JointDistributionRequest.java` | Request DTO carrying a joint distribution. |
| `api/dto/response/MatrixResponse.java` | Response DTO carrying the determinant. |
| `api/dto/response/MatrixResultResponse.java` | Response DTO carrying a matrix. |
| `api/dto/response/LinearSystemResponse.java` | Response DTO carrying the solution of a linear system. |
| `api/dto/response/EigenResponse.java` | Response DTO carrying eigenvalues and eigenvectors. |
| `api/dto/response/SolutionResponse.java` | Response DTO carrying a step-by-step solution. |
| `api/dto/response/SectionResponse.java` | Solution section DTO. |
| `api/dto/response/StepResponse.java` | Solution step DTO. |
| `api/error/ApiError.java` | Error DTO. |
| `api/error/GlobalExceptionHandler.java` | Global handler for domain exceptions. |
| `api/mapper/MatrixDtoMapper.java` | Conversion between DTOs and matrix domain models. |
| `api/mapper/SolutionDtoMapper.java` | Conversion of a domain solution into DTOs. |

---

### `application/` — Application layer

| Path | Purpose |
| :--- | :--- |
| `application/registry/OperationRegistry.java` | Operation registry. Locates a `MatrixOperation` implementation by `OperationType`. |
| `application/service/MatrixService.java` | Service for matrix operations. |
| `application/service/InformationService.java` | Service for information theory operations. |

---

### `domain/` — Domain layer

#### `domain/exception/`

| File | Purpose |
| :--- | :--- |
| `DomainException.java` | Base domain exception. |
| `InvalidMatrixException.java` | Invalid matrix. |
| `SingularMatrixException.java` | Singular matrix. |
| `InvalidProbabilityException.java` | Invalid probability distribution. |

#### `domain/formula/`

| File | Purpose |
| :--- | :--- |
| `EntropyFormulas.java` | LaTeX formulas for marginal and conditional distributions and entropy. |

#### `domain/model/`

| File | Purpose |
| :--- | :--- |
| `Matrix.java` | Matrix domain model. |
| `LinearSystem.java` | System of linear equations domain model. |
| `JointDistribution.java` | Joint distribution domain model. |

#### `domain/model/solution/`

| File | Purpose |
| :--- | :--- |
| `SolutionResult.java` | Final result with an answer and sections. |
| `SolutionSection.java` | A step-by-step solution section. |
| `SolutionStep.java` | A single solution step. |

#### `domain/operation/`

| File | Purpose |
| :--- | :--- |
| `MatrixOperation.java` | Operation interface: `execute(input)` and `type()`. |
| `OperationType.java` | Enumeration of operation types. |
| `DeterminantOperation.java` | Determinant. |
| `Determinants.java` | Determinant computation helper. |
| `CramerOperation.java` | Cramer's rule. |
| `InverseOperation.java` | Inverse matrix. |
| `Inverses.java` | Inverse matrix computation helper. |
| `SolveByInverseOperation.java` | Solving a linear system via the inverse matrix. |
| `GaussOperation.java` | Gaussian elimination. |
| `EigenOperation.java` | Eigenvalues and eigenvectors. |

#### `domain/operation/info/`

| File | Purpose |
| :--- | :--- |
| `MarginalsOperation.java` | Marginal distributions and independence check. |
| `ConditionalsOperation.java` | Conditional distributions. |
| `EntropyOperation.java` | Entropy. |
| `InfoMath.java` | Auxiliary math: `log2`, number formatting. |
| `InfoMessages.java` | Wrapper around `MessageSource` for i18n. |

---

### `resources/`

Standard Spring Boot resources:

```text
src/main/resources/
├── application.properties
├── messages.properties
├── messages_ru.properties
├── messages_en.properties
└── ...
```

The exact contents may vary, but this directory stores:

- application settings;
- messages for the `/api/info/*` endpoints;
- any JSON data if it is added later.

---

## Frontend

Root:

```text
frontend/
├── public/
├── src/
├── index.html
├── package.json
├── vite.config.ts
└── ...
```

### `src/api/`

| File | Purpose |
| :--- | :--- |
| `http.ts` | Base `postJson`, `ApiError` class. |
| `matrixApi.ts` | Functions for `/api/matrix/*`. |
| `infoApi.ts` | Functions for `/api/info/*`. |

### `src/assets/`

| File | Purpose |
| :--- | :--- |
| `favicon.svg` | Application icon. |
| `hero.png` | Image for the main / welcome block. |
| `react.svg` | React logo. |
| `vite.svg` | Vite logo. |

### `src/components/`

| File | Purpose |
| :--- | :--- |
| `Header.tsx` | Application header: title, operation picker, settings. |
| `OperationPicker.tsx` | Dropdown list of operations with search and grouping. |
| `SettingsPanel.tsx` | Settings panel: language, theme. |
| `AugmentedMatrix.tsx` | Input for the augmented matrix `[A | b]`. |
| `JointDistributionInput.tsx` | Input for the joint distribution. |
| `MatrixInput.tsx` | Generic matrix input. |
| `VectorInput.tsx` | Vector input. |
| `ResultView.tsx` | Result rendering: scalar, vector, matrix, eigen pairs, sections. |
| `SolutionSteps.tsx` | Step-by-step solution. |
| `Latex.tsx` | LaTeX rendering via KaTeX. |
| `MathText.tsx` | Simple rendering of subscripts. |
| `ModeSelector.tsx` | Mode switch (legacy / auxiliary). |

### `src/hooks/`

| File | Purpose |
| :--- | :--- |
| `useLocalStorage.ts` | Hook for working with `localStorage`. |
| `useMatrixHistory.ts` | Matrix edit history: undo/redo, commit, coalesce. |
| `useSolution.ts` | Debounced solution request to the backend; loading / error / success state. |

### `src/i18n/`

| File | Purpose |
| :--- | :--- |
| `I18nContext.tsx` | Localization context, `useI18n`. |
| `translations.ts` | `ru` / `en` dictionaries, translation keys. |

### `src/theme/`

| File | Purpose |
| :--- | :--- |
| `ThemeContext.tsx` | Theme: `system`, `light`, `dark`. |

### `src/utils/`

| File | Purpose |
| :--- | :--- |
| `csv.ts` | CSV/TSV parsing for matrix upload. |
| `matrix.ts` | Parsing a matrix from strings into numbers. |
| `vector.ts` | Parsing a vector from strings into numbers. |

### Root files in `src/`

| File | Purpose |
| :--- | :--- |
| `App.tsx` | Root component, application state, operation selection, input, result. |
| `main.tsx` | React entry point, applying the initial theme. |
| `operations.tsx` | Description of all operations: id, category, icon, input / result kinds. |
| `types.ts` | Base types: `Matrix`, `Vector`, `JointDistribution`, `CalculatorMode`. |
| `index.css` | Global styles and themes. |

---

## Key patterns

### Backend

| Pattern | Application |
| :--- | :--- |
| **Operation registry** | `OperationRegistry` stores every `MatrixOperation` keyed by `OperationType`. |
| **Strategy** | Each operation is a separate implementation of `MatrixOperation`. |
| **Service layer** | `MatrixService`, `InformationService` delegate execution to the registry. |
| **DTO + Mapper** | `MatrixDtoMapper`, `SolutionDtoMapper` decouple the API from the domain. |
| **Global exception handler** | `GlobalExceptionHandler` turns domain exceptions into `ApiError`. |

### Frontend

| Pattern | Application |
| :--- | :--- |
| **Hooks** | `useSolution`, `useMatrixHistory`, `useLocalStorage`. |
| **API client** | `postJson` plus the `matrixApi` / `infoApi` functions. |
| **Contexts** | `I18nProvider`, `ThemeProvider`. |
| **Operations as data** | `operations.tsx` describes operations declaratively. |
| **Result as a discriminated union** | `SolutionResult` in `useSolution` distinguishes `scalar`, `vector`, `matrix`, `eigen`, `sections`. |

---

## How to add a new operation

### Backend

1. Add a new `OperationType`.
2. Create a class implementing `MatrixOperation<I, O>`.
3. Annotate it with `@Component` so it is picked up by the `OperationRegistry`.
4. Add a method to `MatrixService` or `InformationService`.
5. Add an endpoint to the corresponding controller.
6. Add request / response DTOs and a mapper if needed.

### Frontend

1. Add a new `OperationId` and `OperationDef` in `operations.tsx`.
2. Add an API function in `matrixApi.ts` or `infoApi.ts`.
3. Add a branch to `useSolution`.
4. Add rendering in `ResultView` if a new `resultKind` was introduced.
5. Add translations in `translations.ts`.
6. Add a new input component if needed.