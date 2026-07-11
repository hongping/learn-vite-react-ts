import { useState } from 'react'
import './App.css'

// --- TypeScript type for a Todo item ---
interface Todo {
  id: number
  text: string
  completed: boolean
  completedAt?: number  // timestamp when marked done (undefined when not done)
}

function App() {
  // --- State ---
  // todos: array of Todo items
  // input: current value of the text input
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')

  // --- Actions ---
  const addTodo = () => {
    if (!input.trim()) return
    const newTodo: Todo = {
      id: Date.now(),      // simple unique id
      text: input,
      completed: false,
    }
    setTodos([...todos, newTodo])
    setInput('')
  }

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, completedAt: !todo.completed ? Date.now() : undefined }
          : todo
      )
    )
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  // --- Render ---
  return (
    <div className="app">
      <h1>📝 Hello World List</h1>

      {/* Input + Add button */}
      <div className="add-todo">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          placeholder="What needs to be done?"
        />
        <button onClick={addTodo}>ADD</button>
      </div>

      {/* List of todos */}
      <ul className="todo-list">
        {/* Sort: incomplete first, then completed by completion time */}
        {[...todos].sort((a, b) => {
          // Both incomplete → keep original order
          if (!a.completed && !b.completed) return 0
          // Both completed → sort by completion time (earlier first)
          if (a.completed && b.completed) return (a.completedAt ?? 0) - (b.completedAt ?? 0)
          // One completed, one not → incomplete comes first
          return a.completed ? 1 : -1
        }).map((todo) => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span>{todo.text}</span>
            <button className="delete" onClick={() => deleteTodo(todo.id)}>
              ✕
            </button>
          </li>
        ))}
      </ul>

      {/* Empty state */}
      {todos.length === 0 && (
        <p className="empty">No todos yet. Add one above!</p>
      )}
    </div>
  )
}

export default App
