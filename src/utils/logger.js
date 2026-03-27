/* eslint-disable no-console */
const LOG_LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, CRITICAL: 4 };

/*
 * Отримує мінімальний рівень логування без перекомпіляції.
 * 1. Спочатку шукає в URL (наприклад, ?log=DEBUG)
 * 2. Потім у localStorage браузера
 * 3. Якщо ніде немає — використовує INFO за замовчуванням
 */
const getLogLevel = () => {
  // Перевірка URL-параметра (найшвидший спосіб для дебагу)
  const urlParams = new URLSearchParams(window.location.search);
  const urlLevel = urlParams.get('logLevel');
  if (urlLevel && LOG_LEVELS[urlLevel] !== undefined) return LOG_LEVELS[urlLevel];

  // Перевірка localStorage
  const saved = localStorage.getItem('GMR_LOG_LEVEL');
  return (saved && LOG_LEVELS[saved] !== undefined) ? LOG_LEVELS[saved] : LOG_LEVELS.INFO;
};

const log = (level, module, message, data = "") => {
  if (LOG_LEVELS[level] < getLogLevel()) return;

  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] [${module}]: ${message}`, data);
};

export const logger = {
  debug: (mod, msg, data) => log('DEBUG', mod, msg, data),
  info: (mod, msg, data) => log('INFO', mod, msg, data),
  warn: (mod, msg, data) => log('WARN', mod, msg, data),
  error: (mod, msg, data) => log('ERROR', mod, msg, data),
  critical: (mod, msg, data) => log('CRITICAL', mod, msg, data),
};