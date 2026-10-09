
# Схема работы Mat-Calc

Приложение не содержит длительного диалога или AI-агента — это интерактивный калькулятор. Основной сценарий: пользователь выбирает операцию, вводит данные, приложение валидирует ввод, отправляет запрос на бэкенд и отображает результат.

## Общая логика

1. Пользователь выбирает операцию в шапке.
2. Приложение определяет, какой ввод нужен:
   - `matrix` — только матрица `A`;
   - `augmented` — расширенная матрица `[A | b]`;
   - `jointDistribution` — таблица совместного распределения.
3. Пользователь заполняет ячейки (вручную, вставкой или загрузкой CSV/TSV).
4. Фронтенд парсит значения и валидирует:
   - пустые ячейки;
   - нечисловые значения;
   - для распределения — неотрицательность и сумма `= 1`.
5. Если ввод валиден — запускается дебаунс-запрос к API.
6. Бэкенд валидирует данные повторно, выбирает операцию из реестра и выполняет её.
7. Ответ отображается:
   - скаляр (определитель);
   - вектор (решение СЛАУ);
   - матрица (обратная);
   - собственные пары;
   - секции с пошаговым решением.

## Ограничения на фронтенде

- Максимальный размер матрицы/вектора/распределения — `10 × 10` (константа `MAX_SIZE`).
- История изменений матрицы ограничена 50 снапшотами (с коалесцированием по 600 мс).
- Дебаунс запросов — 350 мс (`DEBOUNCE_MS` в `useSolution`).
- При смене операции результат сбрасывается.

## Ограничения на бэкенде

- Матрица не должна быть пустой и обязана быть прямоугольной.
- Квадратность обязательна для: `determinant`, `inverse`, `eigen`, `cramer`, `solveByInverse`, `gauss`.
- Длина вектора `constants` должна совпадать с порядком матрицы.
- Распределение вероятностей — неотрицательное и суммируется в `1` с точностью `1e-6`.
- Собственные значения ищутся только действительные — иначе `400 Bad Request`.

## Ключевые состояния фронтенда

| Состояние | Описание |
| :--- | :--- |
| `incomplete` | Ввод ещё не заполнен или невалиден, запрос не отправляется. |
| `loading` | Идёт запрос к бэкенду; отображается индикатор, предыдущий результат затенён. |
| `success` | Получен ответ, результат отображается. |
| `error` | Ошибка сети или сервера, показывается человекочитаемое сообщение. |

## Классификация ошибок на клиенте

| Тип ошибки | Источник | Отображение |
| :--- | :--- | :--- |
| `network` | `fetch` упал без ответа | `errorNetwork` |
| `server` | `4xx/5xx` | Специфичное сообщение по операции или `errorServer` |
| `unknown` | Иное исключение | `errorCompute` |

## Диаграмма

```mermaid
flowchart TD
    Start([Старт приложения]) --> LoadState["Загрузка состояния из localStorage:<br/>• матрица A<br/>• вектор b<br/>• режим операции<br/>• совместное распределение"]
    LoadState --> RenderUI["Рендер Header + Input + Result"]
    RenderUI --> PickOp{"Пользователь выбирает операцию?"}

    PickOp -->|Да| ChangeMode["Сменить OperationId<br/>Сбросить результат"]
    ChangeMode --> DetermineInput["Определить inputKind:<br/>matrix / augmented /<br/>jointDistribution"]

    PickOp -->|Нет| Input{"Пользователь вводит данные"}

    DetermineInput --> Input
    Input -->|Ручной ввод| SetCell["setCell / setVecCell"]
    Input -->|Вставка из буфера| Paste["handlePaste"]
    Input -->|Загрузка файла| Upload["handleUpload → parseDelimited"]
    Input -->|Drag & drop| Drop["onDrop → handleUpload"]

    SetCell --> Parse["parseMatrix / parseVector<br/>/ parseMatrix(joint)"]
    Paste --> Parse
    Upload --> Parse
    Drop --> Parse

    Parse --> Validate{"Валидно?"}
    Validate -->|Пустые ячейки| ShowEmpty["Подсветка ячеек<br/>+ подсказка fillRemaining"]
    Validate -->|Нечисловые| ShowInvalid["Подсветка invalidCells<br/>+ invalidCellsLabel"]
    Validate -->|Не квадрат для requiresSquare| ShowSquare["requiresSquare"]
    Validate -->|Σ ≠ 1 для распределения| ShowSumErr["joint__sum--err"]
    ShowEmpty --> Input
    ShowInvalid --> Input
    ShowSquare --> Input
    ShowSumErr --> Input

    Validate -->|Да| BuildInputs["Сформировать inputs:<br/>{ matrix, vector, joint }"]

    BuildInputs --> Ready{"isReady(mode, inputs)?"}
    Ready -->|Нет| Incomplete["status: incomplete"]
    Ready -->|Да| Debounce["setTimeout 350ms<br/>+ AbortController"]

    Debounce --> Fetch["POST /api/matrix/*<br/>или /api/info/*"]
    Fetch --> Response{"response.ok?"}

    Response -->|Нет| ThrowApiError["throw ApiError(message, status)"]
    ThrowApiError --> MapError["SolutionError:<br/>network / server / unknown"]
    MapError --> ShowError["ResultView: сообщение по операции<br/>(noUniqueSolution, singularMatrix и т.п.)"]

    Response -->|Да| ParseJson["response.json()"]
    ParseJson --> BuildResult["SolutionResult:<br/>scalar / vector / matrix /<br/>eigen / sections"]
    BuildResult --> RenderResult["ResultView рендерит по kind"]
    RenderResult --> SectionsCheck{"kind === 'sections'?"}
    SectionsCheck -->|Да| RenderSteps["SolutionSteps в .steps-panel"]
    SectionsCheck -->|Нет| End([Конец итерации])
    RenderSteps --> End

    ShowError --> End
    Incomplete --> End

    subgraph Backend [Обработка на сервере]
        BStart([POST запрос]) --> Controller["MatrixController или<br/>InformationController"]
        Controller --> ToDomain["MatrixDtoMapper.toDomain<br/>/ JointDistribution"]
        ToDomain --> Service["MatrixService / InformationService"]
        Service --> Registry["OperationRegistry.get(type)"]
        Registry --> Execute["MatrixOperation.execute(input)"]
        Execute --> Op{"Тип операции"}

        Op -->|DETERMINANT| Det["Determinants.compute"]
        Op -->|INVERSE| Inv["Inverses.compute"]
        Op -->|CRAMER| Cr["Заменить столбец,<br/>det_i / det_A"]
        Op -->|GAUSS| Ga["Прямой + обратный ход"]
        Op -->|SOLVE_BY_INVERSE| Si["inv(A) · b"]
        Op -->|EIGEN| Eg["QR-итерации +<br/>собственные векторы"]
        Op -->|INFO_MARGINALS| Mg["Маргинальные +<br/>проверка независимости"]
        Op -->|INFO_CONDITIONALS| Cd["p(x|y), p(y|x)"]
        Op -->|INFO_ENTROPY| En["H(X), H(Y), H(XY),<br/>условные"]

        Det --> Dto["SolutionDtoMapper.toDto<br/>или DTO ответа"]
        Inv --> Dto
        Cr --> Dto
        Ga --> Dto
        Si --> Dto
        Eg --> Dto
        Mg --> Dto
        Cd --> Dto
        En --> Dto

        Dto --> BEnd([JSON-ответ])

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

## Как это читать

- **Левая часть** — клиент: выбор операции, ввод, валидация, дебаунс и отображение.
- **Нижний подграф** — бэкенд: маппинг DTO, реестр операций, выполнение и сериализация ответа.
- **Красным** — точки, где клиент превращает ошибку API в человекочитаемое сообщение.
- Пунктирные стрелки — синхронизация между клиентом и сервером через HTTP.

## Особенности, важные при доработке

- Добавление операции требует правок и на фронте, и на бэке: см. раздел «Как добавить новую операцию» в `files_tree.ru.md`.
- Реестр операций на бэке (`OperationRegistry`) регистрирует всё, что помечено `@Component` и реализует `MatrixOperation<I, O>`. Достаточно создать новый бин — регистрация автоматическая.
- На фронте новая операция — это новая запись в `OPERATIONS` (`operations.tsx`), новая API-функция и новая ветка в `useSolution`.
- Совместное распределение на бэке — это доменная модель `JointDistribution`, которая сразу считает маргиналы и умеет отдавать условные вероятности. Использовать её в новых операциях по теории информации — предпочтительно.