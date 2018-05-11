const tasks = []

export const addTask = task => {
  tasks.push(task)
}

export const flushTasks = () => Promise.all(tasks)
