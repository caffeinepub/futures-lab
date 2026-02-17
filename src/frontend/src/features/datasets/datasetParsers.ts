import type { Candle } from '../../backend';

export async function parseDatasetFile(file: File): Promise<Candle[]> {
  const text = await file.text();
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'json') {
    return parseJSON(text);
  } else if (extension === 'csv') {
    return parseCSV(text);
  } else {
    throw new Error('Unsupported file format. Please use CSV or JSON.');
  }
}

function parseJSON(text: string): Candle[] {
  try {
    const data = JSON.parse(text);
    
    if (!Array.isArray(data)) {
      throw new Error('JSON must contain an array of candles');
    }

    return data.map((item, index) => {
      const candle = validateCandle(item, index);
      return candle;
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('JSON')) {
      throw error;
    }
    throw new Error(`Invalid JSON format: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function parseCSV(text: string): Candle[] {
  const lines = text.trim().split('\n');
  
  if (lines.length < 2) {
    throw new Error('CSV must contain at least a header row and one data row');
  }

  const header = lines[0].toLowerCase().split(',').map(h => h.trim());
  const requiredFields = ['time', 'open', 'high', 'low', 'close', 'volume'];
  
  const fieldIndices: Record<string, number> = {};
  for (const field of requiredFields) {
    const index = header.findIndex(h => h === field || h === `timestamp` && field === 'time');
    if (index === -1) {
      throw new Error(`Missing required field: ${field}`);
    }
    fieldIndices[field] = index;
  }

  const candles: Candle[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(',').map(v => v.trim());
    
    try {
      const timeValue = values[fieldIndices.time];
      let timestamp: bigint;
      
      // Try parsing as ISO date string first, then as unix timestamp
      if (timeValue.includes('-') || timeValue.includes('T')) {
        timestamp = BigInt(new Date(timeValue).getTime() * 1_000_000);
      } else {
        // Assume milliseconds if < 13 digits, nanoseconds otherwise
        const num = parseFloat(timeValue);
        timestamp = num < 1e13 ? BigInt(Math.floor(num * 1_000_000)) : BigInt(Math.floor(num));
      }

      const candle: Candle = {
        time: timestamp,
        open: parseFloat(values[fieldIndices.open]),
        high: parseFloat(values[fieldIndices.high]),
        low: parseFloat(values[fieldIndices.low]),
        close: parseFloat(values[fieldIndices.close]),
        volume: parseFloat(values[fieldIndices.volume]),
      };

      validateCandle(candle, i);
      candles.push(candle);
    } catch (error) {
      throw new Error(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Invalid data'}`);
    }
  }

  if (candles.length === 0) {
    throw new Error('No valid candles found in CSV');
  }

  return candles;
}

function validateCandle(item: any, index: number): Candle {
  const requiredFields = ['time', 'open', 'high', 'low', 'close', 'volume'];
  
  for (const field of requiredFields) {
    if (!(field in item)) {
      throw new Error(`Row ${index + 1}: Missing field '${field}'`);
    }
  }

  const { time, open, high, low, close, volume } = item;

  // Convert time to bigint if needed
  let timestamp: bigint;
  if (typeof time === 'bigint') {
    timestamp = time;
  } else if (typeof time === 'number') {
    timestamp = BigInt(Math.floor(time));
  } else if (typeof time === 'string') {
    timestamp = BigInt(time);
  } else {
    throw new Error(`Row ${index + 1}: Invalid time format`);
  }

  const numOpen = Number(open);
  const numHigh = Number(high);
  const numLow = Number(low);
  const numClose = Number(close);
  const numVolume = Number(volume);

  if (isNaN(numOpen) || isNaN(numHigh) || isNaN(numLow) || isNaN(numClose) || isNaN(numVolume)) {
    throw new Error(`Row ${index + 1}: All OHLCV values must be valid numbers`);
  }

  if (numHigh < numLow) {
    throw new Error(`Row ${index + 1}: High must be >= Low`);
  }

  if (numOpen < 0 || numHigh < 0 || numLow < 0 || numClose < 0 || numVolume < 0) {
    throw new Error(`Row ${index + 1}: All values must be non-negative`);
  }

  return {
    time: timestamp,
    open: numOpen,
    high: numHigh,
    low: numLow,
    close: numClose,
    volume: numVolume,
  };
}
