import { createWorker } from 'tesseract.js';
import fetch from 'node-fetch';
import { Image, createCanvas } from 'canvas';
import { getReferenceItems } from '../utils/configLoader.js';
import { logEvent } from '../utils/logger.js';

// Initialize Tesseract.js worker for OCR
let worker = null;

async function initializeWorker() {
  if (!worker) {
    worker = await createWorker('eng');
  }
  return worker;
}

/**
 * Process an image from a URL
 * @param {string} imageUrl - The URL of the image to process
 * @param {string} username - The username of the user who posted the image
 * @returns {Promise<Array>} - Array of detected items with quantities
 */
export async function processAttachment(imageUrl, username) {
  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    
    // Load the image into canvas
    const img = new Image();
    img.src = Buffer.from(buffer);
    
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    // Get reference items for comparison
    const referenceItems = await getReferenceItems();
    
    // Process the image to detect items
    const results = await detectItems(canvas, referenceItems);
    
    console.log(`Detected ${results.length} items in image from ${username}`);
    return results;
  } catch (error) {
    console.error('Error processing image:', error);
    logEvent('error', { type: 'image_processing', message: error.message, imageUrl });
    return [];
  }
}

/**
 * Detect items in an image by comparing with reference items
 * @param {Canvas} canvas - The canvas containing the image
 * @param {Array} referenceItems - Array of reference items to match against
 * @returns {Promise<Array>} - Array of detected items with quantities
 */
async function detectItems(canvas, referenceItems) {
  const results = [];
  const ctx = canvas.getContext('2d');
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  // Initialize OCR worker
  const ocrWorker = await initializeWorker();
  
  // Implement a simple grid-based analysis (similar to the provided image)
  // Assuming a 5x4 grid based on the example image
  const gridCols = 5;
  const gridRows = 4;
  const cellWidth = canvas.width / gridCols;
  const cellHeight = canvas.height / gridRows;
  
  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      const x = col * cellWidth;
      const y = row * cellHeight;
      
      // Extract cell from the image
      const cellCanvas = createCanvas(cellWidth, cellHeight);
      const cellCtx = cellCanvas.getContext('2d');
      cellCtx.drawImage(canvas, x, y, cellWidth, cellHeight, 0, 0, cellWidth, cellHeight);
      
      // Compare with reference items
      const matchedItem = await matchItemInCell(cellCanvas, referenceItems);
      
      if (matchedItem) {
        // Extract the quantity using OCR
        // Focus on the upper right part of the cell where "x108" would be
        const quantityCanvas = createCanvas(cellWidth * 0.4, cellHeight * 0.3);
        const quantityCtx = quantityCanvas.getContext('2d');
        quantityCtx.drawImage(
          cellCanvas, 
          cellWidth * 0.6, // Start at 60% from left
          0, // Start at top
          cellWidth * 0.4, // Width of 40%
          cellHeight * 0.3, // Height of 30%
          0, 0, cellWidth * 0.4, cellHeight * 0.3
        );
        
        // Run OCR to get the quantity
        const { data } = await ocrWorker.recognize(quantityCanvas.toBuffer());
        const quantityText = data.text.trim();
        
        // Extract numeric value with format "x108"
        const quantityMatch = quantityText.match(/x(\d+)/);
        const quantity = quantityMatch ? parseInt(quantityMatch[1], 10) : null;
        
        results.push({
          itemName: matchedItem.name,
          position: { row, col },
          quantity: quantity,
          confidence: matchedItem.confidence
        });
      }
    }
  }
  
  return results;
}

/**
 * Match an item in a cell with reference items
 * @param {Canvas} cellCanvas - The canvas containing the cell image
 * @param {Array} referenceItems - Array of reference items to match against
 * @returns {Object|null} - Matched item or null if no match
 */
async function matchItemInCell(cellCanvas, referenceItems) {
  // This is a simplified implementation
  // In a real implementation, you would use more sophisticated image matching
  // techniques like feature matching, template matching, or deep learning
  
  // For demonstration purposes, assume we match based on average color
  const ctx = cellCanvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, cellCanvas.width, cellCanvas.height);
  const avgColor = getAverageColor(imageData);
  
  // Find the best match
  let bestMatch = null;
  let bestScore = 0;
  
  for (const item of referenceItems) {
    // In a real implementation, load the reference image and compare
    // For now, we'll use a placeholder scoring function
    const score = calculateMatchScore(avgColor, item);
    
    if (score > bestScore && score > 0.7) { // 70% confidence threshold
      bestScore = score;
      bestMatch = {
        name: item.name,
        confidence: score
      };
    }
  }
  
  return bestMatch;
}

/**
 * Calculate average color of an image
 * @param {ImageData} imageData - The image data
 * @returns {Object} - RGB values of average color
 */
function getAverageColor(imageData) {
  let r = 0, g = 0, b = 0;
  const pixels = imageData.data.length / 4;
  
  for (let i = 0; i < imageData.data.length; i += 4) {
    r += imageData.data[i];
    g += imageData.data[i + 1];
    b += imageData.data[i + 2];
  }
  
  return {
    r: Math.round(r / pixels),
    g: Math.round(g / pixels),
    b: Math.round(b / pixels)
  };
}

/**
 * Calculate match score between image and reference item
 * @param {Object} avgColor - Average color of the image
 * @param {Object} item - Reference item
 * @returns {number} - Match score (0-1)
 */
function calculateMatchScore(avgColor, item) {
  // Placeholder for demonstration
  // In a real implementation, use proper image comparison techniques
  
  // For now, return a random score for demonstration
  return Math.random() * 0.3 + 0.7; // Random score between 0.7 and 1.0
}