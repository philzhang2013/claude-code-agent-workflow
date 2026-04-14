## ADDED Requirements

### Requirement: Filter todos by status
The application SHALL support filtering the displayed todo list by status: all, active (incomplete), or completed.

#### Scenario: Default filter shows all todos
- **GIVEN** the user has added multiple todos with mixed completion states
- **WHEN** the application initializes
- **THEN** the default filter SHALL be "all" and all todos SHALL be visible

#### Scenario: Filter active todos
- **GIVEN** the user has both completed and incomplete todos
- **WHEN** the user selects the "active" filter
- **THEN** only incomplete todos SHALL be displayed

#### Scenario: Filter completed todos
- **GIVEN** the user has both completed and incomplete todos
- **WHEN** the user selects the "completed" filter
- **THEN** only completed todos SHALL be displayed

#### Scenario: Filter state is reactive
- **GIVEN** the user is viewing the "active" filter
- **WHEN** the user marks an active todo as completed
- **THEN** the todo SHALL disappear from the active list immediately

### Requirement: Filter UI controls
`TodoApp.vue` SHALL display a group of filter buttons allowing the user to switch between "all", "active", and "completed" views.

#### Scenario: Filter buttons are visible
- **GIVEN** the application is running
- **WHEN** the user views the main interface
- **THEN** filter buttons labeled "全部", "进行中", "已完成" SHALL be visible

#### Scenario: Active filter has visual feedback
- **GIVEN** the user is viewing the filter buttons
- **WHEN** a filter is selected
- **THEN** the selected button SHALL have a visually distinct active state (e.g., inverted colors, shadow offset) compared to inactive buttons

## MODIFIED Requirements

### Requirement: UI and visual style
The application SHALL use hand-written native CSS without Tailwind or third-party UI libraries. The visual style SHALL be lightweight Neo-brutalism with bold borders, high-contrast colors, and intentional non-uniform shadows, avoiding template-like layouts. Design tokens SHALL be centralized in `src/styles/tokens.css`, supporting both light and dark theme variables with dark theme tokens applied via `[data-theme="dark"]` selector. Component styles SHALL NOT hardcode colors, spacing, or shadow values. Components SHALL be organized by feature domain: `TodoApp.vue` (container), `TodoInput.vue` (input), `TodoList.vue` (list), `TodoItem.vue` (item). Filter controls MAY be co-located within `TodoApp.vue`.

#### Scenario: Visual style consistency
- **GIVEN** the user opens the application
- **WHEN** the user views input box, task items, buttons, and filter controls
- **THEN** all elements SHALL use uniform border width and shadow offset without default browser template feel
- **AND** the visual style SHALL remain consistent in both light and dark themes

### Requirement: Local state management
The application SHALL use Vue 3 Composition API (`ref`, `reactive`, `computed`) for local state management, without introducing Pinia or Vuex. Business logic SHALL be encapsulated in `src/composables/useTodos.ts`, exposing `todos`, `addTodo`, `removeTodo`, `updateTodo`, `toggleTodo`, `filter`, `setFilter`, and `filteredTodos`. State updates SHALL use immutable patterns (returning new arrays/objects), avoiding direct mutation of existing reactive references.

#### Scenario: Composable isolation
- **GIVEN** `useTodos` is called directly in a test environment
- **WHEN** `addTodo`, `toggleTodo`, `removeTodo`, `setFilter`, and reading `filteredTodos` are used
- **THEN** each operation SHALL produce the expected state without relying on UI rendering

### Requirement: Test coverage
The project SHALL use Vitest as the test runner and `@vue/test-utils` for component testing. Unit tests SHALL cover `useTodos.ts`, `storage.ts`, `useTheme.ts`, and core components (`TodoInput`, `TodoItem`, `TodoList`, `TodoApp`). Test coverage SHALL reach or exceed 80% statement coverage.

#### Scenario: Coverage meets target
- **GIVEN** all test cases are written
- **WHEN** `npm run test -- --coverage` is executed
- **THEN** the coverage report SHALL show statement coverage >= 80% with no test failures

## REMOVED Requirements

### Requirement: Task filtering out of scope
**Reason**: Task filtering is now a first-class feature of this change.
**Migration**: N/A — filtering is being implemented as part of this change.
