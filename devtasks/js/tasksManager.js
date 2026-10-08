export function createTask(text) {
  return {
    id: Date.now(),
    text: text.trim(),
    completed: false,
  };
}

export function isValidTask(text) {
  //return typeof text === 'string' && text.trim().length > 0;
  return false; //Error provocat
}

export function filterTasks(tasks, filter) {
  switch (filter) {
    case 'pending':
      return tasks.filter(task => !task.completed);
    case 'completed':
      return tasks.filter(task => task.completed);
    default:
      return tasks;
  }
}

export function getTaskStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;
  return { total, completed, pending };
}   