# Mat-Calc Behavior Flow

The application does not involve a long-running dialogue or an AI agent — it is an interactive calculator. The main scenario is: the user picks an operation, enters data, the application validates the input, sends a request to the backend, and renders the result.

## General logic

1. The user selects an operation in the header.
2. The application determines what kind of input is required:
   - `matrix` — only the matrix `A`;
   - `augmented` — the augmented matrix `[A | b]`;
   - `jointDistribution` — a joint distribution table.
3. The user fills in the cells (manually, by pasting, or by uploading a CSV/TSV file).
4. The frontend parses the values and validates them:
   - empty cells;
   - non-numeric values;
   - for a distribution — non-negativity and a sum of `1`.
5. If the input is valid, a debounced request to the API is triggered.
6. The backend re-validates the data, picks an operation from the registry, and executes it.
7. The response is rendered as:
   - a scalar (determinant);
   - a vector (solution of a linear system);
   - a matrix (inverse);
   - eigen pairs;
   - sections with a step-by-step solution.

## Frontend constraints

- The maximum size of a matrix / vector / distribution is `10 × 10` (the `MAX_SIZE` constant).
- The matrix edit history is limited to 50 snapshots (with coalescing at 600 ms).
- The request debounce is 350 ms (`DEBOUNCE_MS` in `useSolution`).
- The result is reset whenever the operation changes.

## Backend constraints

- The matrix must not be empty and must be rectangular.
- Squareness is required for: `determinant`, `inverse`, `eigen`, `cramer`, `solveByInverse`, `gauss`.
- The length of the `constants` vector must match the order of the matrix.
- The probability distribution must be non-negative and must sum to `1` with tolerance `1e-6`.
- Only real eigenvalues are computed; otherwise `400 Bad Request`.

## Key frontend states

| State | Description |
| :--- | :--- |
| `incomplete` | The input is not yet complete or is invalid; no request is sent. |
| `loading` | A request to the backend is in flight; a spinner is shown and the previous result is dimmed. |
| `success` | A response has been received and the result is displayed. |
| `error` | A network or server error occurred; a human-readable message is displayed. |

## Client-side error classification

| Error type | Source | Rendering |
| :--- | :--- | :--- |
| `network` | `fetch` failed without a response | `errorNetwork` |
| `server` | `4xx / 5xx` | An operation-specific message or `errorServer` |
| `unknown` | Any other exception | `errorCompute` |

## Diagram

```mermaid
flowchart TD
    Start([Application start]) --> LoadState["Load state from localStorage:<br/>• matrix A<br/>• vector b<br/>• operation mode<br/>• joint distribution"]
    LoadState --> RenderUI["Render Header + Input + Result"]
    RenderUI --> PickOp{"Does the user pick an operation?"}

    PickOp -->|Yes| ChangeMode["Change OperationId<br/>Reset the result"]
    ChangeMode --> DetermineInput["Determine inputKind:<br/>matrix / augmented /<br/>jointDistribution"]

    PickOp -->|No| Input{"User enters data"}

    DetermineInput --> Input
    Input -->|Manual input| SetCell["setCell / setVecCell"]
    Input -->|Clipboard paste| Paste["handlePaste"]
    Input -->|File upload| Upload["handleUpload → parseDelimited"]
    Input -->|Drag & drop| Drop["onDrop → handleUpload"]

    SetCell --> Parse["parseMatrix / parseVector<br/>/ parseMatrix(joint)"]
    Paste --> Parse
    Upload --> Parse
    Drop --> Parse

    Parse --> Validate{"Valid?"}
    Validate -->|Empty cells| ShowEmpty["Highlight cells<br/>+ fillRemaining hint"]
    Validate -->|Non-numeric| ShowInvalid["Highlight invalidCells<br/>+ invalidCellsLabel"]
    Validate -->|Not square for requiresSquare| ShowSquare["requiresSquare"]
    Validate -->|Σ ≠ 1 for a distribution| ShowSumErr["joint__sum--err"]
    ShowEmpty --> Input
    ShowInvalid --> Input
    ShowSquare --> Input
    ShowSumErr --> Input

    Validate -->|Yes| BuildInputs["Build inputs:<br/>{ matrix, vector, joint }"]

    BuildInputs --> Ready{"isReady(mode, inputs)?"}
    Ready -->|No| Incomplete["status: incomplete"]
    Ready -->|Yes| Debounce["setTimeout 350ms<br/>+ AbortController"]

    Debounce --> Fetch["POST /api/matrix/*<br/>or /api/info/*"]
    Fetch --> Response{"response.ok?"}

    Response -->|No| ThrowApiError["throw ApiError(message, status)"]
    ThrowApiError --> MapError["SolutionError:<br/>network / server / unknown"]
    MapError --> ShowError["ResultView: operation-specific message<br/>(noUniqueSolution, singularMatrix, etc.)"]

    Response -->|Yes| ParseJson["response.json()"]
    ParseJson --> BuildResult["SolutionResult:<br/>scalar / vector / matrix /<br/>eigen / sections"]
    BuildResult --> RenderResult["ResultView renders by kind"]
    RenderResult --> SectionsCheck{"kind === 'sections'?"}
    SectionsCheck -->|Yes| RenderSteps["SolutionSteps in .steps-panel"]
    SectionsCheck -->|No| End([End of iteration])
    RenderSteps --> End

    ShowError --> End
    Incomplete --> End

    subgraph Backend [Server-side processing]
        BStart([POST request]) --> Controller["MatrixController or<br/>InformationController"]
        Controller --> ToDomain["MatrixDtoMapper.toDomain<br/>/ JointDistribution"]
        ToDomain --> Service["MatrixService / InformationService"]
        Service --> Registry["OperationRegistry.get(type)"]
        Registry --> Execute["MatrixOperation.execute(input)"]
        Execute --> Op{"Operation type"}

        Op -->|DETERMINANT| Det["Determinants.compute"]
        Op -->|INVERSE| Inv["Inverses.compute"]
        Op -->|CRAMER| Cr["Replace a column,<br/>det_i / det_A"]
        Op -->|GAUSS| Ga["Forward + back substitution"]
        Op -->|SOLVE_BY_INVERSE| Si["inv(A) · b"]
        Op -->|EIGEN| Eg["QR iterations +<br/>eigenvectors"]
        Op -->|INFO_MARGINALS| Mg["Marginals +<br/>independence check"]
        Op -->|INFO_CONDITIONALS| Cd["p(x|y), p(y|x)"]
        Op -->|INFO_ENTROPY| En["H(X), H(Y), H(XY),<br/>conditionals"]

        Det --> Dto["SolutionDtoMapper.toDto<br/>or a response DTO"]
        Inv --> Dto
        Cr --> Dto
        Ga --> Dto
        Si --> Dto
        Eg --> Dto
        Mg --> Dto
        Cd --> Dto
        En --> Dto

        Dto --> BEnd([JSON response])

        Execute -->|DomainException| Handler["GlobalExceptionHandler"]
        Handler --> ErrResp["400 Bad Request<br/>{ message }"]
    end

    Fetch -.-> BStart
    BEnd -.-> Response
    ErrResp -.-> ThrowApiError

    classDef startend fill:#2E86AB,stroke:#1a5276,color:white,stroke-width:2px
    classDef process fill:#A23B72,stroke:#7b2359,color:white,stroke-width:1px
    classDef decision fill:#F18F01,stroke:#b86f00,color:white,stroke-width:2px
    classDef backend fill:#3a5a40,stroke:#2a4030,color:white,stroke-width:1px
    classDef error fill:#C73E1D,stroke:#8b2a14,color:white,stroke-width:1px

    class Start,End,BStart,BEnd startend
    class LoadState,RenderUI,ChangeMode,DetermineInput,SetCell,Paste,Upload,Drop,Parse,BuildInputs,Debounce,Fetch,ParseJson,BuildResult,RenderResult,RenderSteps,ShowEmpty,ShowInvalid,ShowSquare,ShowSumErr,Incomplete,MapError,ShowError process
    class PickOp,Input,Validate,Ready,Response,SectionsCheck decision
    class Controller,ToDomain,Service,Registry,Execute,Det,Inv,Cr,Ga,Si,Eg,Mg,Cd,En,Dto,Handler,ErrResp backend
    class ThrowApiError error
```

## How to read it

- **The left side** is the client: operation selection, input, validation, debouncing, and rendering.
- **The subgraph at the bottom** is the backend: DTO mapping, the operation registry, execution, and response serialization.
- **Red nodes** mark the points where the client turns an API error into a human-readable message.
- Dashed arrows represent client–server synchronization over HTTP.

## Notes for further development

- Adding a new operation requires changes on both the frontend and the backend: see the "How to add a new operation" section in `files_tree.en.md`.
- The backend operation registry (`OperationRegistry`) registers every bean annotated with `@Component` that implements `MatrixOperation<I, O>`. A new bean is registered automatically.
- On the frontend, a new operation means a new entry in `OPERATIONS` (`operations.tsx`), a new API function, and a new branch in `useSolution`.
- On the backend, the joint distribution is the `JointDistribution` domain model, which immediately computes the marginals and can return conditional probabilities. Reusing it in new information theory operations is preferable.