import { HealthStatus, TradingMode } from '../backend';

/**
 * Normalizes HealthStatus values that may come from the backend as strings,
 * enums, or Motoko-variant-shaped objects (single-key objects).
 * 
 * @param value - The raw health status value from the backend
 * @returns A normalized HealthStatus enum value
 */
export function normalizeHealthStatus(value: any): HealthStatus {
  // If it's already a valid enum value, return it
  if (typeof value === 'string') {
    const normalized = value.replace(/^#/, ''); // Remove leading # if present
    if (Object.values(HealthStatus).includes(normalized as HealthStatus)) {
      return normalized as HealthStatus;
    }
  }

  // Handle Motoko variant shape: { healthy: null } or { degraded: null }
  if (typeof value === 'object' && value !== null) {
    const keys = Object.keys(value);
    if (keys.length === 1) {
      const key = keys[0];
      if (Object.values(HealthStatus).includes(key as HealthStatus)) {
        return key as HealthStatus;
      }
    }
  }

  // Default fallback
  return HealthStatus.healthy;
}

/**
 * Normalizes TradingMode values that may come from the backend as strings,
 * enums, or Motoko-variant-shaped objects.
 * 
 * @param value - The raw trading mode value from the backend
 * @returns A normalized TradingMode enum value
 */
export function normalizeTradingMode(value: any): TradingMode {
  // If it's already a valid enum value, return it
  if (typeof value === 'string') {
    const normalized = value.replace(/^#/, ''); // Remove leading # if present
    if (Object.values(TradingMode).includes(normalized as TradingMode)) {
      return normalized as TradingMode;
    }
  }

  // Handle Motoko variant shape: { paperTrading: null } or { liveTrading: null }
  if (typeof value === 'object' && value !== null) {
    const keys = Object.keys(value);
    if (keys.length === 1) {
      const key = keys[0];
      if (Object.values(TradingMode).includes(key as TradingMode)) {
        return key as TradingMode;
      }
    }
  }

  // Default fallback
  return TradingMode.paperTrading;
}
