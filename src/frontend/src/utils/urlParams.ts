/**
 * Utility functions for parsing and managing URL parameters
 * Works with both hash-based and browser-based routing
 */

/**
 * Extracts a URL parameter from the current URL
 * Works with both query strings (?param=value) and hash-based routing (#/?param=value)
 *
 * @param paramName - The name of the parameter to extract
 * @returns The parameter value if found, null otherwise
 */
export function getUrlParameter(paramName: string): string | null {
  // Try to get from regular query string first
  const urlParams = new URLSearchParams(window.location.search);
  const regularParam = urlParams.get(paramName);

  if (regularParam !== null) {
    return regularParam;
  }

  // If not found, try to extract from hash (for hash-based routing)
  const hash = window.location.hash;
  const queryStartIndex = hash.indexOf('?');

  if (queryStartIndex !== -1) {
    const hashQuery = hash.substring(queryStartIndex + 1);
    const hashParams = new URLSearchParams(hashQuery);
    return hashParams.get(paramName);
  }

  return null;
}

/**
 * Stores a parameter in sessionStorage for persistence across navigation
 * Useful for maintaining state like admin tokens throughout the session
 *
 * @param key - The key to store the value under
 * @param value - The value to store
 */
export function storeSessionParameter(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Failed to store session parameter ${key}:`, error);
  }
}

/**
 * Retrieves a parameter from sessionStorage
 *
 * @param key - The key to retrieve
 * @returns The stored value if found, null otherwise
 */
export function getSessionParameter(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch (error) {
    console.warn(`Failed to retrieve session parameter ${key}:`, error);
    return null;
  }
}

/**
 * Gets a parameter from URL or sessionStorage (URL takes precedence)
 * If found in URL, also stores it in sessionStorage for future use
 *
 * @param paramName - The name of the parameter to retrieve
 * @param storageKey - Optional custom storage key (defaults to paramName)
 * @returns The parameter value if found, null otherwise
 */
export function getPersistedUrlParameter(paramName: string, storageKey?: string): string | null {
  const key = storageKey || paramName;

  // Check URL first
  const urlValue = getUrlParameter(paramName);
  if (urlValue !== null) {
    // Store in session for persistence
    storeSessionParameter(key, urlValue);
    return urlValue;
  }

  // Fall back to session storage
  return getSessionParameter(key);
}

/**
 * Removes a parameter from sessionStorage
 *
 * @param key - The key to remove
 */
export function clearSessionParameter(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.warn(`Failed to clear session parameter ${key}:`, error);
  }
}

/**
 * Removes a specific parameter from the URL without reloading the page
 * Works with both standard query strings and hash-based routing
 * Preserves route information and other parameters
 * Used to remove sensitive data from the address bar after extracting it
 *
 * @param paramName - The parameter to remove
 */
function clearParamFromUrl(paramName: string): void {
  if (!window.history.replaceState) {
    return;
  }

  // Handle standard query string
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has(paramName)) {
    urlParams.delete(paramName);
    const newSearch = urlParams.toString();
    const newUrl = window.location.pathname + (newSearch ? '?' + newSearch : '') + window.location.hash;
    window.history.replaceState(null, '', newUrl);
    return;
  }

  // Handle hash-based routing
  const hash = window.location.hash;
  if (!hash || hash.length <= 1) {
    return;
  }

  const hashContent = hash.substring(1);
  const queryStartIndex = hashContent.indexOf('?');

  if (queryStartIndex === -1) {
    return;
  }

  const routePath = hashContent.substring(0, queryStartIndex);
  const queryString = hashContent.substring(queryStartIndex + 1);

  const params = new URLSearchParams(queryString);
  params.delete(paramName);

  const newQueryString = params.toString();
  let newHash = routePath;

  if (newQueryString) {
    newHash += '?' + newQueryString;
  }

  const newUrl = window.location.pathname + window.location.search + (newHash ? '#' + newHash : '');
  window.history.replaceState(null, '', newUrl);
}

/**
 * Gets a secret from the URL (hash fragment, hash-route query, or standard query)
 * Supports multiple formats for maximum compatibility:
 * - Hash-only: https://app.com/#secret=xxx
 * - Hash-route query: https://app.com/#/route?secret=xxx
 * - Standard query: https://app.com/?secret=xxx
 * 
 * The parameter is immediately cleared from the URL after extraction to prevent history leakage
 *
 * @param paramName - The name of the secret parameter
 * @returns The secret value if found (from URL or session), null otherwise
 */
export function getSecretFromUrl(paramName: string): string | null {
  // Check session first to avoid unnecessary URL manipulation
  const existingSecret = getSessionParameter(paramName);
  if (existingSecret !== null) {
    return existingSecret;
  }

  // Try standard query string first
  const urlParams = new URLSearchParams(window.location.search);
  const standardParam = urlParams.get(paramName);
  if (standardParam) {
    storeSessionParameter(paramName, standardParam);
    clearParamFromUrl(paramName);
    return standardParam;
  }

  // Try hash-based routing (e.g., #/route?secret=xxx)
  const hash = window.location.hash;
  if (hash && hash.length > 1) {
    const hashContent = hash.substring(1);
    const queryStartIndex = hashContent.indexOf('?');
    
    if (queryStartIndex !== -1) {
      const hashQuery = hashContent.substring(queryStartIndex + 1);
      const hashParams = new URLSearchParams(hashQuery);
      const hashParam = hashParams.get(paramName);
      
      if (hashParam) {
        storeSessionParameter(paramName, hashParam);
        clearParamFromUrl(paramName);
        return hashParam;
      }
    }

    // Try hash-only format (e.g., #secret=xxx)
    const hashParams = new URLSearchParams(hashContent);
    const hashOnlyParam = hashParams.get(paramName);
    
    if (hashOnlyParam) {
      storeSessionParameter(paramName, hashOnlyParam);
      clearParamFromUrl(paramName);
      return hashOnlyParam;
    }
  }

  return null;
}

/**
 * Gets a secret parameter with fallback chain: URL (any format) -> sessionStorage
 * This is the recommended way to handle sensitive parameters like admin tokens
 *
 * Security benefits:
 * - Supports multiple URL formats for compatibility
 * - Automatically cleared from URL after extraction
 * - Persisted in sessionStorage for the session lifetime
 * - Not sent in HTTP Referer headers (when using hash)
 *
 * @param paramName - The name of the secret parameter
 * @returns The secret value if found, null otherwise
 */
export function getSecretParameter(paramName: string): string | null {
  return getSecretFromUrl(paramName);
}
