// Regional color schemes
const regionColors: Record<string, { fill: string; stroke: string }> = {
  north: { fill: '#dc2626', stroke: '#b91c1c' }, // Red
  central: { fill: '#16a34a', stroke: '#15803d' }, // Green  
  south: { fill: '#2563eb', stroke: '#1d4ed8' }, // Blue
  east: { fill: '#7c3aed', stroke: '#6d28d9' }, // Purple
  south_south: { fill: '#ea580c', stroke: '#c2410c' } // Orange
};

// Completely distinct colors for path markers
const pathColors = {
  start: { fill: '#10b981', stroke: '#059669' }, // Emerald
  destination: { fill: '#e11d48', stroke: '#be185d' }, // Pink/Rose
  transit: { fill: '#f59e0b', stroke: '#d97706' } // Amber
};

export { regionColors, pathColors };