import fs from 'fs/promises';
import path from 'path';
import { format } from 'date-fns';

// Log path
const LOG_PATH = path.join(process.cwd(), 'logs');

/**
 * Initialize logger
 * @returns {Promise<void>}
 */
export async function initializeLogger() {
  try {
    // Create log directory if it doesn't exist
    try {
      await fs.access(LOG_PATH);
    } catch (error) {
      await fs.mkdir(LOG_PATH, { recursive: true });
    }
  } catch (error) {
    console.error('Error initializing logger:', error);
  }
}

/**
 * Log an event
 * @param {string} type - Event type
 * @param {Object} data - Event data
 * @returns {Promise<void>}
 */
export async function logEvent(type, data) {
  try {
    await initializeLogger();
    
    // Create log entry
    const timestamp = new Date();
    const entry = {
      timestamp: timestamp.toISOString(),
      type,
      data
    };
    
    // Append to daily log file
    const date = format(timestamp, 'yyyyMMdd');
    const logFile = path.join(LOG_PATH, `${date}.log`);
    
    await fs.appendFile(
      logFile,
      JSON.stringify(entry) + '\n',
      { encoding: 'utf-8' }
    );
  } catch (error) {
    console.error('Error logging event:', error);
  }
}

/**
 * Get logs for a day
 * @param {string} date - Date in format YYYYMMDD
 * @returns {Promise<Array>} - Array of log entries
 */
export async function getLogs(date) {
  try {
    await initializeLogger();
    
    // Read log file
    const logFile = path.join(LOG_PATH, `${date}.log`);
    const data = await fs.readFile(logFile, 'utf-8');
    
    // Parse log entries
    return data
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => JSON.parse(line));
  } catch (error) {
    console.error('Error getting logs:', error);
    return [];
  }
}