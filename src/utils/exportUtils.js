/**
 * Export and composite canvas utilities
 */

/**
 * Downloads a base64 or URL image file directly
 * @param {string} url 
 * @param {string} filename 
 */
export function downloadImage(url, filename = 'venue-render.png') {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Creates a high-resolution side-by-side comparison image using HTML5 Canvas
 * @param {string} originalSrc 
 * @param {string} decoratedSrc 
 * @param {object} meta - title, style, etc.
 * @returns {Promise<string>} Data URL of composite PNG
 */
export async function createCompositeComparison(originalSrc, decoratedSrc, meta = {}) {
  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  const [origImg, decImg] = await Promise.all([
    loadImage(originalSrc),
    loadImage(decoratedSrc)
  ]);

  const targetHeight = Math.min(origImg.naturalHeight || 900, decImg.naturalHeight || 900);
  const origScale = targetHeight / (origImg.naturalHeight || targetHeight);
  const decScale = targetHeight / (decImg.naturalHeight || targetHeight);

  const origWidth = Math.round((origImg.naturalWidth || 1200) * origScale);
  const decWidth = Math.round((decImg.naturalWidth || 1200) * decScale);

  const headerHeight = 90;
  const footerHeight = 40;
  const canvasWidth = origWidth + decWidth + 12; // 12px divider
  const canvasHeight = targetHeight + headerHeight + footerHeight;

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#0F0F12';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Header Bar
  ctx.fillStyle = '#1A1A22';
  ctx.fillRect(0, 0, canvasWidth, headerHeight);

  // Bottom border on header with hotpink accent
  ctx.fillStyle = '#FF1493';
  ctx.fillRect(0, headerHeight - 3, canvasWidth, 3);

  // Header Title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText('Venue Decorator & Visualization AI', 30, 42);

  // Subtitle / Specs
  ctx.fillStyle = '#A0A0B2';
  ctx.font = '15px sans-serif';
  const subtitle = meta.title || 'Before & After Transformation Comparison';
  const extra = meta.style ? ` | Style: ${meta.style}` : '';
  ctx.fillText(`${subtitle}${extra}`, 30, 68);

  // Draw Images
  const yOffset = headerHeight;
  ctx.drawImage(origImg, 0, yOffset, origWidth, targetHeight);
  
  // Divider
  ctx.fillStyle = '#FF1493';
  ctx.fillRect(origWidth, yOffset, 12, targetHeight);

  ctx.drawImage(decImg, origWidth + 12, yOffset, decWidth, targetHeight);

  // Image Labels
  const drawBadge = (text, x, y, isDecorated = false) => {
    ctx.save();
    ctx.fillStyle = isDecorated ? 'rgba(255, 20, 147, 0.9)' : 'rgba(15, 15, 18, 0.85)';
    ctx.strokeStyle = isDecorated ? '#FF1493' : 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;

    const paddingX = 18;
    const paddingY = 8;
    ctx.font = 'bold 15px sans-serif';
    const textWidth = ctx.measureText(text).width;
    const rectW = textWidth + paddingX * 2;
    const rectH = 34;

    ctx.beginPath();
    ctx.roundRect(x, y, rectW, rectH, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(text, x + paddingX, y + 22);
    ctx.restore();
  };

  drawBadge('BEFORE: Bare Venue Space', 30, yOffset + 30, false);
  drawBadge('AFTER: AI Decorated Render', origWidth + 12 + 30, yOffset + 30, true);

  // Footer bar
  ctx.fillStyle = '#0a0a0d';
  ctx.fillRect(0, canvasHeight - footerHeight, canvasWidth, footerHeight);
  ctx.fillStyle = '#68687a';
  ctx.font = '13px sans-serif';
  ctx.fillText('Generated with Google GenAI & Venue Decorator AI', 30, canvasHeight - 16);
  ctx.textAlign = 'right';
  ctx.fillText(new Date().toLocaleDateString(), canvasWidth - 30, canvasHeight - 16);

  return canvas.toDataURL('image/png');
}

/**
 * Exports decor checklist items to CSV format
 * @param {Array} items 
 * @param {string} currency 
 */
export function exportChecklistToCSV(items, currency = 'USD') {
  if (!items || items.length === 0) return;

  const headers = ['Category', 'Item Name', 'Quantity', 'Est. Unit Cost', 'Est. Total Cost', 'Completed', 'Notes'];
  const rows = items.map(item => [
    `"${item.category || 'General'}"`,
    `"${item.name || ''}"`,
    item.quantity || 1,
    `"${currency} ${item.unitCost || 0}"`,
    `"${currency} ${(item.quantity || 1) * (item.unitCost || 0)}"`,
    item.completed ? 'Yes' : 'No',
    `"${(item.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `venue-decor-checklist-${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copies a formatted text summary of the decor plan to clipboard
 * @param {object} planData 
 * @returns {Promise<boolean>}
 */
export async function copyPlanSummaryToClipboard(planData) {
  const { title, celebration, style, colorPalette, lighting, prompt, checklist = [], currency = '$' } = planData;

  const totalCost = checklist.reduce((sum, item) => sum + (item.quantity || 1) * (item.unitCost || 0), 0);
  
  const checklistText = checklist
    .map(item => `  - [${item.completed ? 'x' : ' '}] ${item.name} (${item.quantity}x) - ${currency}${item.unitCost * item.quantity} [${item.category}]`)
    .join('\n');

  const text = `
========================================
VENUE DECORATOR & VISUALIZATION AI PLAN
========================================
Venue: ${title || 'Custom Venue'}
Event Type: ${celebration || 'Celebration'}
Aesthetic: ${style || 'Custom Style'}
Color Palette: ${colorPalette || 'Custom Palette'}
Lighting: ${lighting || 'Ambient'}

PROMPT SPECIFICATION:
${prompt || 'N/A'}

VENDOR DECOR CHECKLIST & BUDGET ESTIMATES:
Estimated Total: ${currency}${totalCost.toLocaleString()}
${checklistText || 'No items listed'}
========================================
Generated by Venue Decorator & Visualization AI
`.trim();

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Clipboard copy failed', err);
    return false;
  }
}
