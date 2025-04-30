import fs from 'fs/promises';
import path from 'path';
import { format } from 'date-fns';

const STORAGE_PATH = path.join(process.cwd(), 'data');

export async function initializeStorage() {
  try {
    try {
      await fs.access(STORAGE_PATH);
    } catch (error) {
      await fs.mkdir(STORAGE_PATH, { recursive: true });
    }
    
    const depositsPath = path.join(STORAGE_PATH, 'deposits');
    try {
      await fs.access(depositsPath);
    } catch (error) {
      await fs.mkdir(depositsPath, { recursive: true });
    }
    
    console.log('Storage initialized');
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
}

export async function saveDeposit(deposit) {
  try {
    await initializeStorage();
    
    const timestamp = format(new Date(deposit.timestamp), 'yyyyMMdd-HHmmss');
    const filename = `${timestamp}-${deposit.username}-${deposit.itemName}.json`;
    
    const filePath = path.join(STORAGE_PATH, 'deposits', filename);
    await fs.writeFile(filePath, JSON.stringify(deposit, null, 2));
    
    console.log(`Saved deposit to ${filePath}`);
    
    await updateDailySummary(deposit);
  } catch (error) {
    console.error('Error saving deposit:', error);
  }
}

async function updateDailySummary(deposit) {
  try {
    const date = format(new Date(deposit.timestamp), 'yyyyMMdd');
    const summaryPath = path.join(STORAGE_PATH, `deposits-${date}.json`);
    
    let summary;
    try {
      const data = await fs.readFile(summaryPath, 'utf-8');
      summary = JSON.parse(data);
    } catch (error) {
      summary = {
        date,
        deposits: []
      };
    }
    
    summary.deposits.push({
      timestamp: deposit.timestamp,
      username: deposit.username,
      itemName: deposit.itemName,
      quantity: deposit.quantity
    });
    
    await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));
  } catch (error) {
    console.error('Error updating daily summary:', error);
  }
}

export async function getDailyDeposits(date) {
  try {
    await initializeStorage();
    
    const summaryPath = path.join(STORAGE_PATH, `deposits-${date}.json`);
    const data = await fs.readFile(summaryPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error getting daily deposits:', error);
    return { date, deposits: [] };
  }
}

export async function getUserDeposits(username) {
  try {
    await initializeStorage();
    
    const depositsPath = path.join(STORAGE_PATH, 'deposits');
    const files = await fs.readdir(depositsPath);
    
    const userFiles = files.filter(file => file.includes(username));
    
    const deposits = [];
    for (const file of userFiles) {
      const filePath = path.join(depositsPath, file);
      const data = await fs.readFile(filePath, 'utf-8');
      deposits.push(JSON.parse(data));
    }
    
    return deposits;
  } catch (error) {
    console.error('Error getting user deposits:', error);
    return [];
  }
}