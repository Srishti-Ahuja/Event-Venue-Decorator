/**
 * @fileoverview JSDoc Architectural Data Contracts and Runtime Schema Validators
 * Single source of truth for entity shapes across services, hooks, and UI components.
 */
import { sanitizeInput } from '../utils/sanitize.js';

/**
 * @typedef {Object} Specifications
 * @property {string} celebrationType - Event type (e.g., 'Wedding Ceremony & Reception')
 * @property {string} aestheticStyle - Design theme (e.g., 'Bohemian Romantic')
 * @property {string} colorPalette - Palette label (e.g., 'Rose Gold & Champagne')
 * @property {string} primaryLighting - Lighting scheme (e.g., 'Fairy Lights & Twinkle Canopy')
 * @property {string} [customNotes] - Optional bespoke directives from the client
 */

/**
 * @typedef {Object} ChecklistItem
 * @property {string} id - Unique item identifier
 * @property {string} category - Vendor category
 * @property {string} name - Actionable item name
 * @property {number} quantity - Quantity count (>= 1)
 * @property {number} unitCost - Estimated unit cost in USD (>= 0)
 * @property {boolean} completed - Sourcing / booking completion status
 * @property {string} [notes] - Placement and installation notes
 */

/**
 * @typedef {Object} SpatialAnalysis
 * @property {string} roomType - Identified architectural typology
 * @property {string} ceilingHeight - Vertical clearance and rigging feasibility
 * @property {string[]} architecturalAnchors - 3 structural anchor points in space
 * @property {string} lightingAnalysis - Ambient lighting and dark zone evaluation
 * @property {string} surfaceMaterials - Surface finishes and reflection characteristics
 */

/**
 * @typedef {Object} PipelineState
 * @property {'idle'|'stage1'|'stage2'|'completed'|'error'} status
 * @property {number|null} currentStage
 * @property {number} progressPercent
 * @property {string} statusMessage
 * @property {string|null} error
 * @property {string|null} errorNotice
 * @property {number|string} stage1Duration
 * @property {number|string} stage2Duration
 */

/**
 * Validates and sanitizes a Specifications object.
 * Returns a clean, safe specifications payload with guaranteed valid fields.
 * @param {any} specs - Raw specifications candidate
 * @returns {Specifications} Sanitized and normalized specifications
 */
export function validateSpecifications(specs) {
  if (!specs || typeof specs !== 'object') {
    return {
      celebrationType: 'Wedding Ceremony & Reception',
      aestheticStyle: 'Bohemian Romantic',
      colorPalette: 'Rose Gold & Champagne',
      primaryLighting: 'Fairy Lights & Twinkle Canopy',
      customNotes: ''
    };
  }

  return {
    celebrationType: sanitizeInput(specs.celebrationType) || 'Wedding Ceremony & Reception',
    aestheticStyle: sanitizeInput(specs.aestheticStyle) || 'Bohemian Romantic',
    colorPalette: sanitizeInput(specs.colorPalette) || 'Rose Gold & Champagne',
    primaryLighting: sanitizeInput(specs.primaryLighting) || 'Fairy Lights & Twinkle Canopy',
    customNotes: sanitizeInput(specs.customNotes || '', 500)
  };
}

/**
 * Validates and sanitizes a single vendor checklist item.
 * @param {any} item - Raw checklist item candidate
 * @param {number} [fallbackIndex=1] - Fallback counter for generating safe IDs
 * @returns {ChecklistItem}
 */
export function validateChecklistItem(item, fallbackIndex = 1) {
  if (!item || typeof item !== 'object') {
    return {
      id: `item-${fallbackIndex}-${Date.now()}`,
      category: 'General Decor',
      name: 'Unspecified Decor Item',
      quantity: 1,
      unitCost: 100,
      completed: false,
      notes: ''
    };
  }

  const rawQty = Number(item.quantity);
  const rawCost = Number(item.unitCost);

  return {
    id: String(item.id || `item-${fallbackIndex}-${Date.now()}`).trim(),
    category: sanitizeInput(item.category) || 'General Decor',
    name: sanitizeInput(item.name) || 'Custom Decor Item',
    quantity: !Number.isNaN(rawQty) && rawQty > 0 ? Math.round(rawQty) : 1,
    unitCost: !Number.isNaN(rawCost) && rawCost >= 0 ? Math.round(rawCost) : 0,
    completed: Boolean(item.completed),
    notes: sanitizeInput(item.notes || '', 300)
  };
}