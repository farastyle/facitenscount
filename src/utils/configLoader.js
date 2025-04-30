import fs from 'fs/promises';
import path from 'path';

// Default configuration path
const CONFIG_PATH = path.join(process.cwd(), 'config');

/**
 * Load the main configuration
 * @returns {Promise<Object>} - Configuration object
 */
export async function loadConfig() {
  try {
    const configFile = path.join(CONFIG_PATH, 'config.json');
    const configData = await fs.readFile(configFile, 'utf-8');
    return JSON.parse(configData);
  } catch (error) {
    console.error('Error loading configuration:', error);
    
    // Return default configuration if file doesn't exist
    return {
      itemsPath: 'config/items',
      storageType: 'json',
      storagePath: 'data',
      gridSettings: {
        rows: 4,
        columns: 5
      }
    };
  }
}

/**
 * Get reference items for comparison
 * @returns {Promise<Array>} - Array of reference items
 */
export async function getReferenceItems() {
  try {
    const config = await loadConfig();
    const itemsDir = path.join(process.cwd(), config.itemsPath);
    
    // Create directory if it doesn't exist
    try {
      await fs.access(itemsDir);
    } catch (error) {
      await fs.mkdir(itemsDir, { recursive: true });
      
      // Create sample configuration if directory is new
      await createSampleConfig(itemsDir);
    }
    
    // Load items from config files
    const files = await fs.readdir(itemsDir);
    const itemsFiles = files.filter(file => file.endsWith('.json'));
    
    const items = [];
    for (const file of itemsFiles) {
      const itemData = await fs.readFile(path.join(itemsDir, file), 'utf-8');
      const item = JSON.parse(itemData);
      items.push(item);
    }
    
    return items;
  } catch (error) {
    console.error('Error loading reference items:', error);
    return [];
  }
}

/**
 * Create sample configuration files
 * @param {string} itemsDir - Directory to create sample configs in
 */
async function createSampleConfig(itemsDir) {
  // Create sample item config
  const sampleItem = {
    name: 'Stop Sign',
    description: 'A red octagonal stop sign',
    imagePath: 'reference/stop_sign.png',
    coordinates: {
      grid: { row: 0, col: 2 },
      pixel: { x: 320, y: 80 }
    },
    features: {
      color: { r: 220, g: 20, b: 20 },
      shape: 'octagon'
    }
  };
  
  await fs.writeFile(
    path.join(itemsDir, 'stop_sign.json'),
    JSON.stringify(sampleItem, null, 2)
  );
  
  // Create reference directory
  const referenceDir = path.join(process.cwd(), 'config/reference');
  try {
    await fs.mkdir(referenceDir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
  
  // Create main config if it doesn't exist
  const configDir = path.join(process.cwd(), 'config');
  try {
    await fs.mkdir(configDir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
  
  const mainConfig = {
    itemsPath: 'config/items',
    storageType: 'json',
    storagePath: 'data',
    gridSettings: {
      rows: 4,
      columns: 5
    }
  };
  
  await fs.writeFile(
    path.join(configDir, 'config.json'),
    JSON.stringify(mainConfig, null, 2)
  );
  
  console.log('Created sample configuration files');
}