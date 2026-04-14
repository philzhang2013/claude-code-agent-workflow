## 1. TDD: useTodos filter logic

- [ ] 1.1 RED: Write tests for `filter` default value (`all`)
- [ ] 1.2 RED: Write tests for `filteredTodos` with `all`, `active`, `completed` filters
- [ ] 1.3 RED: Write tests for `setFilter` state mutation and reactivity
- [ ] 1.4 GREEN: Implement `filter`, `setFilter`, and `filteredTodos` in `useTodos.ts`
- [ ] 1.5 IMPROVE: Run `useTodos.spec.ts` tests, verify all pass and coverage >= 80%

## 2. TDD: TodoApp filter UI

- [ ] 2.1 RED: Write tests for filter button group visibility in `TodoApp.spec.ts`
- [ ] 2.2 RED: Write tests for filter button click interactions and active state
- [ ] 2.3 RED: Write tests for filtered todo list rendering based on selected filter
- [ ] 2.4 GREEN: Implement filter button group UI in `TodoApp.vue`
- [ ] 2.5 IMPROVE: Run `TodoApp.spec.ts` tests, verify all pass

## 3. Integration and final verification

- [ ] 3.1 Run full test suite (`pnpm vitest run`) and verify all tests pass
- [ ] 3.2 Run coverage check and verify statement coverage >= 80%
- [ ] 3.3 Update `openspec/specs/todo-app/spec.md` with delta requirements (archive step)
