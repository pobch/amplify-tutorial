import React, { useState, useEffect } from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import { createTodo } from './graphql/mutations'
import { listTodos } from './graphql/queries'

const initialState = { name: '', description: '' }

function App() {
  const [formState, setFormState] = useState(initialState)
  const [todos, setTodos] = useState([])

  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos))
      const todos = todoData.data.listTodos.items
      setTodos(todos)
    } catch (err) {
      console.log('error fetching todos')
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  function updateInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  async function addTodo() {
    try {
      if (!formState.name || !formState.description) return
      const todo = { ...formState }
      setTodos([...todos, todo])
      setFormState(initialState)
      await API.graphql(graphqlOperation(createTodo, { input: todo }))
    } catch (err) {
      console.log('error creating todo:', err)
    }
  }

  return (
    <div style={styles.container}>
      <h2>Amplify Todos</h2>
      <input
        style={styles.input}
        value={formState.name}
        onChange={(event) => updateInput('name', event.target.value)}
        placeholder="Name"
      />
      <input
        style={styles.input}
        value={formState.description}
        onChange={(event) => updateInput('description', event.target.value)}
        placeholder="Description"
      />
      <button style={styles.button} onClick={addTodo}>
        Create Todo
      </button>
      {todos.map((todo, index) => (
        <div key={todo.id ? todo.id : index} style={styles.todo}>
          <p style={styles.todoName}>{todo.name}</p>
          <p style={styles.todoDescription}>{todo.description}</p>
        </div>
      ))}
    </div>
  )
}

const styles = {
  container: { width: 400, margin: '0 auto' },
  input: {},
  button: {},
  todo: {},
  todoName: {},
  todoDescription: {},
}

export default App
