
# Структура файлов проекта Mat-Calc

Проект состоит из двух основных частей:

```text
mat-calc/
├── backend/   # Spring Boot
└── frontend/  # React + Vite
```

---

## Backend

Корневой пакет:

```text
github.axine.matrixcalculator
```

### `MatrixcalculatorApplication.java`

Точка входа Spring Boot приложения.

```java
@SpringBootApplication
public class MatrixcalculatorApplication {
    public static void main(String[] args) {
        SpringApplication.run(MatrixcalculatorApplication.class, args);
    }
}
```

---

### `api/` — REST-слой

| Путь | Назначение |
| :--- | :--- |
| `api/controller/MatrixController.java` | Эндпоинты для матриц и СЛАУ. |
| `api/controller/InformationController.java` | Эндпоинты для теории информации. |
| `api/dto/request/MatrixRequest.java` | DTO запроса с матрицей. |
| `api/dto/request/LinearSystemRequest.java` | DTO запроса для СЛАУ. |
| `api/dto/request/JointDistributionRequest.java` | DTO запроса с совместным распределением. |
| `api/dto/response/MatrixResponse.java` | DTO ответа с определителем. |
| `api/dto/response/MatrixResultResponse.java` | DTO ответа с матрицей. |
| `api/dto/response/LinearSystemResponse.java` | DTO ответа с решением СЛАУ. |
| `api/dto/response/EigenResponse.java` | DTO ответа с собственными значениями и векторами. |
| `api/dto/response/SolutionResponse.java` | DTO ответа с пошаговым решением. |
| `api/dto/response/SectionResponse.java` | DTO секции решения. |
| `api/dto/response/StepResponse.java` | DTO шага решения. |
| `api/error/ApiError.java` | DTO ошибки. |
| `api/error/GlobalExceptionHandler.java` | Глобальный обработчик доменных исключений. |
| `api/mapper/MatrixDtoMapper.java` | Преобразование DTO ↔ доменные модели матриц. |
| `api/mapper/SolutionDtoMapper.java` | Преобразование доменного решения в DTO. |

---

### `application/` — прикладной слой

| Путь | Назначение |
| :--- | :--- |
| `application/registry/OperationRegistry.java` | Реестр операций. Находит реализацию `MatrixOperation` по `OperationType`. |
| `application/service/MatrixService.java` | Сервис для матричных операций. |
| `application/service/InformationService.java` | Сервис для операций теории информации. |

---

### `domain/` — доменный слой

#### `domain/exception/`

| Файл | Назначение |
| :--- | :--- |
| `DomainException.java` | Базовое доменное исключение. |
| `InvalidMatrixException.java` | Некорректная матрица. |
| `SingularMatrixException.java` | Вырожденная матрица. |
| `InvalidProbabilityException.java` | Некорректное распределение вероятностей. |

#### `domain/formula/`

| Файл | Назначение |
| :--- | :--- |
| `EntropyFormulas.java` | LaTeX-формулы для маргинальных, условных распределений и энтропии. |

#### `domain/model/`

| Файл | Назначение |
| :--- | :--- |
| `Matrix.java` | Доменная модель матрицы. |
| `LinearSystem.java` | Доменная модель системы линейных уравнений. |
| `JointDistribution.java` | Доменная модель совместного распределения. |

#### `domain/model/solution/`

| Файл | Назначение |
| :--- | :--- |
| `SolutionResult.java` | Итоговый результат с ответом и секциями. |
| `SolutionSection.java` | Секция пошагового решения. |
| `SolutionStep.java` | Один шаг решения. |

#### `domain/operation/`

| Файл | Назначение |
| :--- | :--- |
| `MatrixOperation.java` | Интерфейс операции: `execute(input)` и `type()`. |
| `OperationType.java` | Перечисление типов операций. |
| `DeterminantOperation.java` | Определитель. |
| `Determinants.java` | Вычислитель определителя. |
| `CramerOperation.java` | Метод Крамера. |
| `InverseOperation.java` | Обратная матрица. |
| `Inverses.java` | Вычислитель обратной матрицы. |
| `SolveByInverseOperation.java` | Решение СЛАУ через обратную матрицу. |
| `GaussOperation.java` | Метод Гаусса. |
| `EigenOperation.java` | Собственные значения и векторы. |

#### `domain/operation/info/`

| Файл | Назначение |
| :--- | :--- |
| `MarginalsOperation.java` | Маргинальные распределения и проверка независимости. |
| `ConditionalsOperation.java` | Условные распределения. |
| `EntropyOperation.java` | Энтропия. |
| `InfoMath.java` | Вспомогательная математика: `log2`, форматирование чисел. |
| `InfoMessages.java` | Обёртка над `MessageSource` для i18n. |

---

### `resources/`

Стандартные ресурсы Spring Boot:

```text
src/main/resources/
├── application.properties
├── messages.properties
├── messages_ru.properties
├── messages_en.properties
└── ...
```

Точный состав может отличаться, но здесь хранятся:

- настройки приложения;
- сообщения для эндпоинтов `/api/info/*`;
- возможные JSON-данные, если появятся.

---

## Frontend

Корень:

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

| Файл | Назначение |
| :--- | :--- |
| `http.ts` | Базовый `postJson`, класс `ApiError`. |
| `matrixApi.ts` | Функции для `/api/matrix/*`. |
| `infoApi.ts` | Функции для `/api/info/*`. |

### `src/assets/`

| Файл | Назначение |
| :--- | :--- |
| `favicon.svg` | Иконка приложения. |
| `hero.png` | Изображение для главной/приветственного блока. |
| `react.svg` | Логотип React. |
| `vite.svg` | Логотип Vite. |

### `src/components/`

| Файл | Назначение |
| :--- | :--- |
| `Header.tsx` | Шапка приложения: заголовок, выбор операции, настройки. |
| `OperationPicker.tsx` | Выпадающий список операций с поиском и группировкой. |
| `SettingsPanel.tsx` | Панель настроек: язык, тема. |
| `AugmentedMatrix.tsx` | Ввод расширенной матрицы `[A | b]`. |
| `JointDistributionInput.tsx` | Ввод совместного распределения. |
| `MatrixInput.tsx` | Универсальный ввод матрицы. |
| `VectorInput.tsx` | Ввод вектора. |
| `ResultView.tsx` | Отображение результата: скаляр, вектор, матрица, собственные пары, секции. |
| `SolutionSteps.tsx` | Пошаговое решение. |
| `Latex.tsx` | Рендер LaTeX через KaTeX. |
| `MathText.tsx` | Простой рендер подстрочных индексов. |
| `ModeSelector.tsx` | Переключатель режимов (устаревший/вспомогательный). |

### `src/hooks/`

| Файл | Назначение |
| :--- | :--- |
| `useLocalStorage.ts` | Хук для работы с `localStorage`. |
| `useMatrixHistory.ts` | История изменений матрицы: undo/redo, commit, coalesce. |
| `useSolution.ts` | Дебаунс-запрос решения на бэкенд, состояние загрузки/ошибки/успеха. |

### `src/i18n/`

| Файл | Назначение |
| :--- | :--- |
| `I18nContext.tsx` | Контекст локализации, `useI18n`. |
| `translations.ts` | Словари `ru`/`en`, ключи переводов. |

### `src/theme/`

| Файл | Назначение |
| :--- | :--- |
| `ThemeContext.tsx` | Тема: `system`, `light`, `dark`. |

### `src/utils/`

| Файл | Назначение |
| :--- | :--- |
| `csv.ts` | Парсинг CSV/TSV для загрузки матриц. |
| `matrix.ts` | Парсинг матрицы из строк в числа. |
| `vector.ts` | Парсинг вектора из строк в числа. |

### Корневые файлы `src/`

| Файл | Назначение |
| :--- | :--- |
| `App.tsx` | Главный компонент, состояние приложения, выбор операции, ввод, результат. |
| `main.tsx` | Точка входа React, применение начальной темы. |
| `operations.tsx` | Описание всех операций: id, категория, иконка, тип ввода/результата. |
| `types.ts` | Базовые типы: `Matrix`, `Vector`, `JointDistribution`, `CalculatorMode`. |
| `index.css` | Глобальные стили и темы. |

---

## Ключевые паттерны

### Backend

| Паттерн | Применение |
| :--- | :--- |
| **Реестр операций** | `OperationRegistry` хранит все `MatrixOperation` по `OperationType`. |
| **Стратегия** | Каждая операция — отдельная реализация `MatrixOperation`. |
| **Сервисный слой** | `MatrixService`, `InformationService` делегируют выполнение в реестр. |
| **DTO + Mapper** | `MatrixDtoMapper`, `SolutionDtoMapper` отделяют API от домена. |
| **Глобальный обработчик ошибок** | `GlobalExceptionHandler` превращает доменные исключения в `ApiError`. |

### Frontend

| Паттерн | Применение |
| :--- | :--- |
| **Хуки** | `useSolution`, `useMatrixHistory`, `useLocalStorage`. |
| **API-клиент** | `postJson` + функции `matrixApi` / `infoApi`. |
| **Контексты** | `I18nProvider`, `ThemeProvider`. |
| **Операции как данные** | `operations.tsx` описывает операции декларативно. |
| **Результат как discriminated union** | `SolutionResult` в `useSolution` различает `scalar`, `vector`, `matrix`, `eigen`, `sections`. |

---

## Как добавить новую операцию

### Backend

1. Добавить новый `OperationType`.
2. Создать класс, реализующий `MatrixOperation<I, O>`.
3. Пометить его `@Component`, чтобы он попал в `OperationRegistry`.
4. Добавить метод в `MatrixService` или `InformationService`.
5. Добавить эндпоинт в соответствующий контроллер.
6. При необходимости добавить DTO запроса/ответа и маппер.

### Frontend

1. Добавить `OperationId` и `OperationDef` в `operations.tsx`.
2. Добавить API-функцию в `matrixApi.ts` или `infoApi.ts`.
3. Добавить ветку в `useSolution`.
4. Добавить отображение в `ResultView`, если появился новый `resultKind`.
5. Добавить переводы в `translations.ts`.
6. При необходимости добавить новый компонент ввода.