
[![English](https://img.shields.io/badge/English-Documentation-blue?style=flat-square)](../../README.md)
[![License](https://img.shields.io/badge/License-Apache2.0-green?style=flat-square)](../../LICENSE)

<div align="center">
  <h1>Mat-Calc</h1>
  <p><em>Веб-калькулятор для линейной алгебры и теории информации</em></p>
</div>

Веб-приложение для вычислений над матрицами (определитель, обратная матрица, собственные значения, решение СЛАУ) и в области теории информации (маргинальные и условные распределения, энтропия Шеннона). Каждая операция сопровождается пошаговым решением с формулами в LaTeX.

## Продакшен-развёртывание (для конечных пользователей)

Самый простой способ запустить **Mat-Calc** — использовать **Docker** и **Docker Compose**.  
Никакой сборки, Java или Node.js не требуется.

### Необходимые условия

- [Docker](https://docs.docker.com/get-docker/) (версия 20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (версия 2.0+)

### Шаги

1. **Скачайте `docker-compose.yml` и `.env.example`** из репозитория в текущую папку.

   ```bash
   curl -O https://raw.githubusercontent.com/AxineBro/mat-calc/main/docker-compose.yml
   curl -O https://raw.githubusercontent.com/AxineBro/mat-calc/main/.env.example
   ```

2. **Создайте файл `.env`** на основе примера:

   ```bash
   cp .env.example .env
   ```

   Отредактируйте `.env`, если это нужно

3. **Запустите приложение:**

   ```bash
   docker-compose up -d
   ```

4. Откройте http://localhost в браузере.

Все сервисы (бэкенд, фронтенд, nginx) запускаются автоматически.

## Быстрый старт для разработки

### Требования

- JDK 25+
- Node.js 18+ и npm
- Maven

### 1. Backend

```bash
cd backend
./mvnw spring-boot:run
# по умолчанию бэкенд слушает http://localhost:8080
```

Проверка:

```bash
curl -X POST http://localhost:8080/api/matrix/determinant \
  -H "Content-Type: application/json" \
  -d '{"matrix":[[1,2],[3,4]]}'
```

Ожидаемый ответ:

```json
{ "determinant": -2.0 }
```

### 2. Frontend

```bash
cd frontend
npm ci
npm run dev
# откройте http://localhost:5173
```

`vite.config.ts` уже проксирует `/api` на `http://localhost:8080`, поэтому в коде используются относительные пути.

### 3. Production-сборка

```bash
cd frontend
npm ci
npm run build
# результат — в frontend/dist/
```

`dist/` нужно раздавать через nginx или любой другой веб-сервер, а `/api/*` — проксировать на бэкенд.

## Возможности

### Матрицы и СЛАУ

| Операция | Описание |
| :--- | :--- |
| **Определитель** | Вычисление `det(A)` методом Гаусса с выбором ведущего элемента. |
| **Обратная матрица** | Нахождение `A⁻¹` методом Гаусса–Жордана. |
| **Собственные значения и векторы** | QR-итерации с shift Уилкинсона + обратный ход для векторов. |
| **Метод Крамера** | Решение СЛАУ через отношения определителей. |
| **Метод обратной матрицы** | Решение СЛАУ как `x = A⁻¹ · b`. |
| **Метод Гаусса** | Решение СЛАУ прямым и обратным ходом. |

### Теория информации

| Операция | Описание |
| :--- | :--- |
| **Маргинальные распределения** | `p(x_i)`, `p(y_j)` и проверка независимости `p(x,y) ?= p(x)·p(y)`. |
| **Условные распределения** | `p(x_i \| y_j)` и `p(y_j \| x_i)` с подстановками. |
| **Энтропия** | `H(X)`, `H(Y)`, `H(XY)`, частные и полные условные энтропии. |

### Интерфейс

- Ввод матрицы с тулбаром: undo/redo, добавление и удаление строк и столбцов, вставка из буфера.
- Загрузка данных из CSV/TSV и drag & drop.
- Переключение темы (`system` / `light` / `dark`) и языка (`ru` / `en`).
- Горячие клавиши `Ctrl/Cmd+Z` / `Ctrl/Cmd+Y` для undo/redo.
- Сохранение введённых данных в `localStorage`.
- Рендер формул через KaTeX.
- Debounce-запросы с `AbortController` — отменяют предыдущий запрос при быстром вводе.

## Технологический стек

| Слой | Технологии |
| :--- | :--- |
| **Frontend** | `React 19` · `Vite` · `KaTeX` |
| **Backend** | `Java` · `Spring Boot` · `Spring Web` |
| **Сборка** | `Maven` (backend) · `npm` (frontend) |

## Документация и архитектура

- [Схема работы](architecture/behavior-flow.ru.md) — поток данных от ввода до результата.
- [API-документация](architecture/api_dock.ru.md) — все эндпоинты, DTO и коды ошибок.
- [Структура файлов](architecture/files_tree.ru.md) — как устроены backend и frontend, как добавить операцию.

## Быстрый старт

### Требования

- JDK 17+ (или версия, требуемая `pom.xml` в `backend/`);
- Node.js 18+ и npm;
- Maven (или использование `mvnw` в `backend/`).

### 1. Backend

```bash
cd backend
./mvnw spring-boot:run
# по умолчанию бэкенд слушает http://localhost:8080
```

Проверка:

```bash
curl -X POST http://localhost:8080/api/matrix/determinant \
  -H "Content-Type: application/json" \
  -d '{"matrix":[[1,2],[3,4]]}'
```

Ожидаемый ответ:

```json
{ "determinant": -2.0 }
```

### 2. Frontend

```bash
cd frontend
npm ci
npm run dev
# откройте http://localhost:5173
```

`vite.config.ts` уже проксирует `/api` на `http://localhost:8080`, поэтому в коде используются относительные пути.

### 3. Production-сборка

```bash
cd frontend
npm ci
npm run build
# результат — в frontend/dist/
```

`dist/` нужно раздавать через nginx или любой другой веб-сервер, а `/api/*` — проксировать на бэкенд.

## Пример запроса к API

### Определитель

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

### Решение СЛАУ методом Крамера

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

### Энтропия

```http
POST /api/info/entropy
Content-Type: application/json
Accept-Language: ru

{
  "probabilities": [[0.1, 0.2], [0.3, 0.4]]
}
```

Ответ содержит поле `answer` с кратким итогом и `sections` с пошаговым решением (формулы в LaTeX). Полный формат — в [api_dock.ru.md](architecture/api_dock.ru.md).

## Структура репозитория

```text
mat-calc/
├── backend/                 # Spring Boot
│   ├── src/main/java/github/axine/matrixcalculator/
│   │   ├── api/             # контроллеры, DTO, ошибки, мапперы
│   │   ├── application/     # сервисы и реестр операций
│   │   └── domain/          # модели, операции, исключения, формулы
│   └── src/main/resources/  # настройки и локализация
├── frontend/                # React + Vite
│   ├── src/api/             # http.ts, matrixApi.ts, infoApi.ts
│   ├── src/components/      # ввод и вывод
│   ├── src/hooks/           # useSolution, useMatrixHistory
│   ├── src/i18n/            # локализация
│   ├── src/theme/           # темы
│   └── src/utils/           # парсеры
├── docs/
│   ├── en/architecture/     # документация на английском
│   ├── ru/architecture/     # документация на русском
│   └── img/
├── LICENSE
└── README.md
```

## Архитектура (backend)

Бэкенд построен по многослойной архитектуре.

| Слой | Ответственность |
| :--- | :--- |
| **Controller** | REST-эндпоинты, DTO запросов и ответов, CORS. |
| **Application** | `MatrixService`, `InformationService`, `OperationRegistry`. |
| **Domain** | Модели (`Matrix`, `LinearSystem`, `JointDistribution`), реализации `MatrixOperation`, доменные исключения, формулы. |
| **API-mapper** | Преобразование DTO ↔ доменные модели. |
| **Error handling** | `GlobalExceptionHandler` — единая точка превращения доменных исключений в `ApiError`. |

### Ключевые паттерны

- **Реестр операций** — `OperationRegistry` собирает все `MatrixOperation` через Spring и находит нужную по `OperationType`.
- **Стратегия** — каждая операция — отдельный бин, реализующий общий интерфейс.
- **DTO + Mapper** — API-слой не зависит от доменного, маппинг явный.
- **Единый обработчик ошибок** — все доменные исключения автоматически конвертируются в `400 Bad Request`.

## Архитектура (frontend)

| Слой | Ответственность |
| :--- | :--- |
| **API** | `postJson` с заголовками `Content-Type` и `Accept-Language`, класс `ApiError`. |
| **State** | `useSolution` — дебаунс, отмена запросов, состояния `incomplete / loading / success / error`. |
| **Inputs** | `AugmentedMatrix`, `JointDistributionInput`, `MatrixInput`, `VectorInput`. |
| **Outputs** | `ResultView`, `SolutionSteps`, `Latex`, `MathText`. |
| **Контексты** | `I18nProvider`, `ThemeProvider`. |
| **Operations** | `operations.tsx` — декларативное описание всех операций. |

## Локализация

Все тексты интерфейса и сообщений бэкенда для операций теории информации доступны на русском и английском. Язык выбирается в панели настроек; на бэкенд передаётся в заголовке `Accept-Language`. Словари лежат в:

- `frontend/src/i18n/translations.ts`;
- `backend/src/main/resources/messages*.properties`.

## Как добавить новую операцию

### Backend

1. Добавить значение в `OperationType`.
2. Создать класс, реализующий `MatrixOperation<I, O>`; пометить `@Component`.
3. Добавить метод в `MatrixService` / `InformationService`.
4. Добавить эндпоинт в соответствующий контроллер.
5. При необходимости — DTO и маппер.

### Frontend

1. Добавить запись в `OPERATIONS` (`operations.tsx`).
2. Добавить API-функцию в `matrixApi.ts` / `infoApi.ts`.
3. Добавить ветку в `useSolution`.
4. Добавить отображение в `ResultView`, если появился новый `resultKind`.
5. Добавить переводы в `translations.ts`.

## Тестирование

```bash
# backend
cd backend
./mvnw test

# frontend
cd frontend
npm test
```

## Лицензия

Проект распространяется под лицензией [Apache License 2.0](../../LICENSE).

## Автор

- **Alexey** — backend, frontend, архитектура — [GitHub](https://github.com/AxineBro)