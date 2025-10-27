/**
 * daily-service.mjs
 * Daily Tasks Service - Todos and Accomplishments
 * 
 * Responsibilities:
 * - CRUD operations for todos
 * - CRUD operations for accomplishments
 * - Todo completion tracking
 * - Date-based queries
 * 
 * Dependencies: db.mjs, ui-utils.mjs
 */

import { dbPromise } from './db.mjs';
import { showToast, getTodayISO } from './ui-utils.mjs';

// ============================================================
// TODO OPERATIONS
// ============================================================

/**
 * Save a new todo
 * @param {string} title - Todo title
 * @param {string} content - Todo description/content
 * @returns {Promise<Object|null>} Saved todo object or null if failed
 */
export async function saveTodo(title, content = '') {
  const todo = {
    title: title,
    content: content,
    completed: false,
    createdAt: new Date().toISOString(),
    completedAt: null
  };
  
  try {
    const db = await dbPromise;
    const id = await db.add('todos', todo);
    todo.id = id;
    
    return todo;
  } catch (err) {
    console.error('Error adding todo:', err);
    return null;
  }
}

/**
 * Get all todos, optionally filtered
 * @param {boolean} includeCompleted - Include completed todos
 * @returns {Promise<Array>} Array of todo objects
 */
export async function getTodos(includeCompleted = false) {
  try {
    const db = await dbPromise;
    const allTodos = await db.getAll('todos');
    
    // Filter todos based on completion status
    const todosToShow = includeCompleted 
      ? allTodos
      : allTodos.filter(todo => !todo.completed);
    
    // Sort: active todos first, then by creation date (newest first)
    todosToShow.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1; // Active todos first
      }
      return new Date(b.createdAt) - new Date(a.createdAt); // Newest first within each group
    });
    
    return todosToShow;
  } catch (err) {
    console.error('Error loading todos:', err);
    return [];
  }
}

/**
 * Get todo by ID
 * @param {number} todoId - Todo ID
 * @returns {Promise<Object|null>} Todo object or null if not found
 */
export async function getTodoById(todoId) {
  try {
    const db = await dbPromise;
    return await db.get('todos', todoId);
  } catch (err) {
    console.error('Error fetching todo by ID:', err);
    return null;
  }
}

/**
 * Toggle todo completion status
 * @param {number} todoId - Todo ID
 * @returns {Promise<boolean>} True if toggled successfully
 */
export async function toggleTodo(todoId) {
  try {
    const db = await dbPromise;
    const todo = await db.get('todos', todoId);
    
    if (!todo) {
      console.error('Todo not found:', todoId);
      return false;
    }
    
    todo.completed = !todo.completed;
    
    // Set or clear completion timestamp
    if (todo.completed) {
      todo.completedAt = new Date().toISOString();
    } else {
      todo.completedAt = null;
    }
    
    await db.put('todos', todo);
    
    return true;
  } catch (err) {
    console.error('Error toggling todo:', err);
    return false;
  }
}

/**
 * Delete todo by ID
 * @param {number} todoId - Todo ID
 * @returns {Promise<boolean>} True if deleted successfully
 */
export async function deleteTodo(todoId) {
  try {
    const db = await dbPromise;
    await db.delete('todos', todoId);
    
    return true;
  } catch (err) {
    console.error('Error deleting todo:', err);
    return false;
  }
}

/**
 * Get count of active (incomplete) todos
 * @returns {Promise<number>} Count of active todos
 */
export async function getActiveTodoCount() {
  const todos = await getTodos(false);
  return todos.length;
}

/**
 * Get count of completed todos
 * @returns {Promise<number>} Count of completed todos
 */
export async function getCompletedTodoCount() {
  try {
    const db = await dbPromise;
    const allTodos = await db.getAll('todos');
    return allTodos.filter(todo => todo.completed).length;
  } catch (err) {
    console.error('Error counting completed todos:', err);
    return 0;
  }
}

// ============================================================
// ACCOMPLISHMENT OPERATIONS
// ============================================================

/**
 * Save a new accomplishment
 * @param {string} title - Accomplishment title
 * @param {string} content - Accomplishment details/content
 * @returns {Promise<Object|null>} Saved accomplishment object or null if failed
 */
export async function saveAccomplishment(title, content = '') {
  const accomplishment = {
    title: title,
    content: content,
    date: getTodayISO(),
    createdAt: new Date().toISOString()
  };
  
  try {
    const db = await dbPromise;
    const id = await db.add('accomplishments', accomplishment);
    accomplishment.id = id;
    
    return accomplishment;
  } catch (err) {
    console.error('Error adding accomplishment:', err);
    return null;
  }
}

/**
 * Get accomplishments for a specific date
 * @param {string} date - Date in YYYY-MM-DD format (defaults to today)
 * @returns {Promise<Array>} Array of accomplishment objects
 */
export async function getAccomplishments(date = null) {
  try {
    const db = await dbPromise;
    const targetDate = date || getTodayISO();
    const allAccomplishments = await db.getAll('accomplishments');
    
    // Filter by date
    const filteredAccomplishments = allAccomplishments.filter(acc => acc.date === targetDate);
    
    // Sort by creation time (newest first)
    filteredAccomplishments.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    return filteredAccomplishments;
  } catch (err) {
    console.error('Error loading accomplishments:', err);
    return [];
  }
}

/**
 * Get accomplishments for today
 * @returns {Promise<Array>} Array of today's accomplishments
 */
export async function getTodayAccomplishments() {
  return getAccomplishments();
}

/**
 * Get accomplishment by ID
 * @param {number} accomplishmentId - Accomplishment ID
 * @returns {Promise<Object|null>} Accomplishment object or null if not found
 */
export async function getAccomplishmentById(accomplishmentId) {
  try {
    const db = await dbPromise;
    return await db.get('accomplishments', accomplishmentId);
  } catch (err) {
    console.error('Error fetching accomplishment by ID:', err);
    return null;
  }
}

/**
 * Delete accomplishment by ID
 * @param {number} accomplishmentId - Accomplishment ID
 * @returns {Promise<boolean>} True if deleted successfully
 */
export async function deleteAccomplishment(accomplishmentId) {
  try {
    const db = await dbPromise;
    await db.delete('accomplishments', accomplishmentId);
    
    return true;
  } catch (err) {
    console.error('Error deleting accomplishment:', err);
    return false;
  }
}

/**
 * Get accomplishments for a date range
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Array>} Array of accomplishments in date range
 */
export async function getAccomplishmentsInRange(startDate, endDate) {
  try {
    const db = await dbPromise;
    const allAccomplishments = await db.getAll('accomplishments');
    
    return allAccomplishments.filter(acc => 
      acc.date >= startDate && acc.date <= endDate
    );
  } catch (err) {
    console.error('Error fetching accomplishments in range:', err);
    return [];
  }
}

/**
 * Get count of accomplishments for a specific date
 * @param {string} date - Date in YYYY-MM-DD format (defaults to today)
 * @returns {Promise<number>} Count of accomplishments
 */
export async function getAccomplishmentCount(date = null) {
  const accomplishments = await getAccomplishments(date);
  return accomplishments.length;
}

// ============================================================
// WORK SESSION OPERATIONS
// ============================================================

/**
 * Get active work session (if any)
 * @returns {Promise<Object|null>} Active work session or null
 */
export async function getActiveWorkSession() {
  try {
    const db = await dbPromise;
    const allSessions = await db.getAll('workSessions');
    
    // Find session without punchOut
    const activeSession = allSessions.find(session => !session.punchOut);
    return activeSession || null;
  } catch (err) {
    console.error('Error getting active work session:', err);
    return null;
  }
}

/**
 * Punch in - start a new work session
 * @returns {Promise<Object|null>} New work session object or null if failed
 */
export async function punchIn() {
  try {
    // Check if already punched in
    const activeSession = await getActiveWorkSession();
    if (activeSession) {
      showToast('You are already punched in!', 'warning');
      return activeSession;
    }
    
    const db = await dbPromise;
    const now = new Date().toISOString();
    const session = {
      date: getTodayISO(),
      punchIn: now,
      punchOut: null,
      totalHours: null,
      breaks: [],
      activities: [
        {
          startTime: now,
          endTime: null,
          category: 'work',
          description: 'Work Time'
        }
      ]
    };
    
    const id = await db.add('workSessions', session);
    session.id = id;
    
    return session;
  } catch (err) {
    console.error('Error punching in:', err);
    return null;
  }
}

/**
 * Punch out - end the active work session
 * @returns {Promise<Object|null>} Updated work session or null if failed
 */
export async function punchOut() {
  try {
    const activeSession = await getActiveWorkSession();
    if (!activeSession) {
      showToast('No active work session found', 'warning');
      return null;
    }
    
    const db = await dbPromise;
    const punchOutTime = new Date().toISOString();
    
    // Calculate total hours
    const punchInDate = new Date(activeSession.punchIn);
    const punchOutDate = new Date(punchOutTime);
    const totalMilliseconds = punchOutDate - punchInDate;
    const totalHours = totalMilliseconds / (1000 * 60 * 60);
    
    activeSession.punchOut = punchOutTime;
    activeSession.totalHours = parseFloat(totalHours.toFixed(2));
    
    await db.put('workSessions', activeSession);
    
    return activeSession;
  } catch (err) {
    console.error('Error punching out:', err);
    return null;
  }
}

/**
 * Get work session for a specific date
 * @param {string} date - Date in YYYY-MM-DD format (defaults to today)
 * @returns {Promise<Object|null>} Work session or null
 */
export async function getWorkSession(date = null) {
  try {
    const db = await dbPromise;
    const targetDate = date || getTodayISO();
    const allSessions = await db.getAll('workSessions');
    
    // Find session for the date
    const session = allSessions.find(s => s.date === targetDate);
    return session || null;
  } catch (err) {
    console.error('Error getting work session:', err);
    return null;
  }
}

/**
 * Get work sessions for a date range
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Array>} Array of work sessions
 */
export async function getWorkSessionsForDateRange(startDate, endDate) {
  try {
    const db = await dbPromise;
    const allSessions = await db.getAll('workSessions');
    
    return allSessions.filter(session => 
      session.date >= startDate && session.date <= endDate
    );
  } catch (err) {
    console.error('Error fetching work sessions in range:', err);
    return [];
  }
}

/**
 * Record an activity/interruption (lunch, meeting, personal, work)
 * @param {string} category - Activity category: 'work', 'lunch', 'meeting', 'personal', 'custom'
 * @param {string} description - Activity description
 * @returns {Promise<Object|null>} Updated work session or null if failed
 */
export async function recordActivity(category, description) {
  try {
    const activeSession = await getActiveWorkSession();
    if (!activeSession) {
      showToast('No active work session. Please punch in first.', 'warning');
      return null;
    }
    
    const db = await dbPromise;
    const now = new Date().toISOString();
    
    // Initialize activities array if it doesn't exist (for old sessions)
    if (!activeSession.activities) {
      activeSession.activities = [];
    }
    
    // End current activity if any
    if (activeSession.activities.length > 0) {
      const lastActivity = activeSession.activities[activeSession.activities.length - 1];
      if (!lastActivity.endTime) {
        lastActivity.endTime = now;
      }
    }
    
    // Start new activity
    const newActivity = {
      startTime: now,
      endTime: null,
      category: category,
      description: description
    };
    
    activeSession.activities.push(newActivity);
    
    // Save to database
    await db.put('workSessions', activeSession);
    
    return activeSession;
  } catch (err) {
    console.error('Error recording activity:', err);
    return null;
  }
}

/**
 * Get current activity from active work session
 * @returns {Promise<Object|null>} Current activity or null
 */
export async function getCurrentActivity() {
  try {
    const activeSession = await getActiveWorkSession();
    if (!activeSession || !activeSession.activities || activeSession.activities.length === 0) {
      return null;
    }
    
    // Return last activity without end time
    const lastActivity = activeSession.activities[activeSession.activities.length - 1];
    return !lastActivity.endTime ? lastActivity : null;
  } catch (err) {
    console.error('Error getting current activity:', err);
    return null;
  }
}

/**
 * Save or update a work session (for administrative corrections)
 * @param {Object} session - Work session object with date, punchIn, punchOut
 * @returns {Promise<Object|null>} Saved work session or null if failed
 */
export async function saveWorkSession(session) {
  try {
    const db = await dbPromise;
    
    // Calculate total hours if both punch times are provided
    if (session.punchIn && session.punchOut) {
      const punchInDate = new Date(session.punchIn);
      const punchOutDate = new Date(session.punchOut);
      const totalMilliseconds = punchOutDate - punchInDate;
      const totalHours = totalMilliseconds / (1000 * 60 * 60);
      session.totalHours = parseFloat(totalHours.toFixed(2));
    }
    
    // Initialize activities array if not present
    if (!session.activities) {
      session.activities = [];
    }
    
    // Initialize breaks array if not present
    if (!session.breaks) {
      session.breaks = [];
    }
    
    if (session.id) {
      // Update existing session
      await db.put('workSessions', session);
    } else {
      // Create new session - remove id field if it's undefined
      const { id, ...sessionWithoutId } = session;
      const newId = await db.add('workSessions', sessionWithoutId);
      session.id = newId;
    }
    
    return session;
  } catch (err) {
    console.error('Error saving work session:', err);
    showToast('Failed to save work session', 'error');
    return null;
  }
}

/**
 * Delete a work session
 * @param {number} sessionId - Work session ID
 * @returns {Promise<boolean>} True if deleted successfully
 */
export async function deleteWorkSession(sessionId) {
  try {
    const db = await dbPromise;
    await db.delete('workSessions', sessionId);
    return true;
  } catch (err) {
    console.error('Error deleting work session:', err);
    showToast('Failed to delete work session', 'error');
    return false;
  }
}

// ============================================================
// DAILY SUMMARY
// ============================================================

/**
 * Get daily summary (todos and accomplishments)
 * @param {string} date - Date in YYYY-MM-DD format (defaults to today)
 * @returns {Promise<Object>} { todos, accomplishments, todoCount, accomplishmentCount }
 */
export async function getDailySummary(date = null) {
  const targetDate = date || getTodayISO();
  
  // Get todos (not date-specific, get all active)
  const todos = await getTodos(false);
  const completedTodos = await getTodos(true);
  
  // Get accomplishments for the date
  const accomplishments = await getAccomplishments(targetDate);
  
  return {
    date: targetDate,
    todos: todos,
    todoCount: todos.length,
    completedTodoCount: completedTodos.filter(t => t.completed).length,
    accomplishments: accomplishments,
    accomplishmentCount: accomplishments.length
  };
}
