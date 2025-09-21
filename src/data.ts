interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  region: string;
}

interface Edge {
  source: string;
  target: string;
  weight: number;
}

interface ProcessedEdge extends Edge {
  sourceNode: Node;
  targetNode: Node;
}

interface BackendResults {
  success: boolean;
  distance: number;
  distance_unit: string;
  path: string[];
  from_city: string;
  to_city: string;
  route_info: {
    total_cities: number;
    direct_route: boolean;
    total_distance_km: number;
  };
  error?: string;
}

interface PathInfo {
  path: string[];
  distance: number;
  totalCities: number;
  directRoute: boolean;
}

interface Config {
  startNode: string;
  endNode: string;
  animationSpeed: number;
  apiEndpoint: string;
}
export type {
  Node,
  Edge,
    ProcessedEdge,
    BackendResults,
    PathInfo,
    Config
};

// Nigerian states network - 10 major states with optimal spacing
  const graphData: { nodes: Node[]; edges: Edge[] } = {
    nodes: [
      // Northern States
      { id: 'Kano', label: 'Kano', x: 500, y: 80, region: 'north' },
      { id: 'Kaduna', label: 'Kaduna', x: 350, y: 70, region: 'north' },
      
      // Central States
      { id: 'Abuja', label: 'FCT', x: 420, y: 200, region: 'central' },
      { id: 'Plateau', label: 'Plateau', x: 550, y: 180, region: 'central' },
      { id: 'Niger', label: 'Niger', x: 280, y: 160, region: 'central' },
      
      // Western States
      { id: 'Lagos', label: 'Lagos', x: 120, y: 350, region: 'south' },
      { id: 'Oyo', label: 'Oyo', x: 150, y: 250, region: 'south' },
      
      // Eastern States
      { id: 'Enugu', label: 'Enugu', x: 580, y: 320, region: 'east' },
      { id: 'Anambra', label: 'Anambra', x: 450, y: 380, region: 'east' },
      
      // South-South
      { id: 'Rivers', label: 'Rivers', x: 370, y: 460, region: 'south_south' }
    ],
    edges: [
      // Northern backbone
      { source: 'Kaduna', target: 'Kano', weight: 160 },
      // North to Central connections
      { source: 'Kaduna', target: 'Abuja', weight: 160 },
      { source: 'Kaduna', target: 'Niger', weight: 180 },
      { source: 'Abuja', target: 'Plateau', weight: 200 },
      { source: 'Kano', target: 'Plateau', weight: 280 },
      
      // Central hub connections
      { source: 'Niger', target: 'Abuja', weight: 120 },
      { source: 'Niger', target: 'Oyo', weight: 180 },
      
      // Western corridor
      { source: 'Lagos', target: 'Oyo', weight: 150 },
      { source: 'Oyo', target: 'Abuja', weight: 250 },
      
      // Eastern connections
      { source: 'Abuja', target: 'Enugu', weight: 290 },
      { source: 'Plateau', target: 'Enugu', weight: 250 },
      { source: 'Enugu', target: 'Anambra', weight: 110 },
      
      // Southern connections
      { source: 'Anambra', target: 'Rivers', weight: 120 },
      { source: 'Oyo', target: 'Rivers', weight: 280 },
      
      // Cross-regional links
      { source: 'Lagos', target: 'Rivers', weight: 340 },
      { source: 'Oyo', target: 'Anambra', weight: 220 }
    ]
  };
  export { graphData };