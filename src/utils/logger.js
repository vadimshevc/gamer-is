/* eslint-disable no-console */

// Генеруємо ID сесії один раз при завантаженні сторінки
const SESSION_ID = `SES-${Math.floor(Math.random() * 10000)}`;
const LOG_LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, CRITICAL: 4 };
const MAX_LOG_SIZE = 50; // Ротація: зберігаємо лише останні 50 записів

/*
 * Отримує рівень логування (65%)
 */
const getLogLevel = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const urlLevel = urlParams.get('logLevel');
  if (urlLevel && LOG_LEVELS[urlLevel] !== undefined) return LOG_LEVELS[urlLevel];
  return localStorage.getItem('GMR_LOG_LEVEL') || 'INFO';
};

/*
 * Імітація обробника файлів (File Handler) через LocalStorage (85%)
 * Реалізує ротацію: якщо логів забагато, старі видаляються.
 */
const saveToPersistentLog = (entry) => {
  try {
    const logs = JSON.parse(localStorage.getItem('GMR_PERSISTENT_LOGS') || '[]');
    logs.push(entry);
    
    // РОТАЦІЯ (85%): якщо масив більший за ліміт, видаляємо найстаріший запис
    if (logs.length > MAX_LOG_SIZE) {
      logs.shift(); 
    }
    
    localStorage.setItem('GMR_PERSISTENT_LOGS', JSON.stringify(logs));
  } catch (e) {
    console.warn("Не вдалося зберегти лог у сховище", e);
  }
};

const log = (level, module, message, data = "") => {
  const currentLevelName = getLogLevel();
  if (LOG_LEVELS[level] < LOG_LEVELS[currentLevelName]) return;

  const timestamp = new Date().toISOString();
  
  // КОНТЕКСТНА ІНФОРМАЦІЯ (85%): додаємо сесію та користувача
  const logEntry = {
    timestamp,
    level,
    module,
    message,
    session: SESSION_ID,
    user: "Guest_User", // В реальному проєкті тут буде ID з Firebase Auth
    extra: data
  };

  // ОБРОБНИК 1: Консоль
  const formattedMsg = `[${timestamp}] [${level}] [${module}] [S:${SESSION_ID}]: ${message}`;
  console.log(formattedMsg, data);

  // ОБРОБНИК 2: "Файл" (LocalStorage)
  saveToPersistentLog(logEntry);
};

export const logger = {
  debug: (mod, msg, data) => log('DEBUG', mod, msg, data),
  info: (mod, msg, data) => log('INFO', mod, msg, data),
  warn: (mod, msg, data) => log('WARN', mod, msg, data),
  error: (mod, msg, data) => log('ERROR', mod, msg, data),
  critical: (mod, msg, data) => log('CRITICAL', mod, msg, data),
};