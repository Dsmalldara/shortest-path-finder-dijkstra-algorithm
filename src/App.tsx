/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import { Loader2, AlertCircle, MapPin, Navigation, RotateCcw } from 'lucide-react';
import * as d3 from 'd3';
import { graphData, type BackendResults, type Config, type PathInfo, type ProcessedEdge } from './data';
import { pathColors, regionColors } from './SvgStates';


const DijkstraVisualization: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [pathInfo, setPathInfo] = useState<PathInfo | null>(null);

  const [backendResults, setBackendResults] = useState<BackendResults | null>(null);
  
  // Configuration
  const [config, setConfig] = useState<Config>({
    startNode: 'Lagos',
    endNode: 'Abuja',
    animationSpeed: 1000,
    apiEndpoint: 'https://csc-320-backend.vercel.app/calculate-route'
  });

 
    // backend call
  const callBackendDijkstra = async (startNode: string, endNode: string): Promise<BackendResults | null> => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from_city: startNode,
          to_city: endNode
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BackendResults = await response.json();
      
      if (data.success) {
        setBackendResults(data);
        return data;
      } else {
        setError(data.error || 'Failed to calculate route');
        return null;
      }
      
    } catch (err) {
      console.error('API Error:', err);
      setError(`Failed to connect to route service: ${(err as Error).message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };


  // Initialize D3 visualization
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    const width = 1000;
    const height = 500;
    
    svg.attr("width", width).attr("height", height);

    // Add clean background
    const defs = svg.append("defs");
    
    const gradient = defs.append("radialGradient")
      .attr("id", "cleanBackground")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "70%");
    
    gradient.append("stop")
      .attr("offset", "0%")
      .attr("style", "stop-color:#f8fafc;stop-opacity:1");
    
    gradient.append("stop")
      .attr("offset", "100%")
      .attr("style", "stop-color:#e2e8f0;stop-opacity:1");

    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "url(#cleanBackground)");

    // Process edges with node references
    const processedEdges: ProcessedEdge[] = graphData.edges.map(edge => ({
      ...edge,
      sourceNode: graphData.nodes.find(n => n.id === edge.source)!,
      targetNode: graphData.nodes.find(n => n.id === edge.target)!
    }));

    // Create shadow filter
    const filter = defs.append("filter")
      .attr("id", "shadow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");

    filter.append("feDropShadow")
      .attr("dx", 2)
      .attr("dy", 2)
      .attr("stdDeviation", 3)
      .attr("flood-color", "rgba(0,0,0,0.15)");

    // Create connection lines - minimal style
    const edgeGroup = svg.append("g").attr("class", "connections");
    
    const connections = edgeGroup.selectAll(".connection")
      .data(processedEdges)
      .enter().append("g")
      .attr("class", "connection");

    // Simple connection lines
    connections.append("line")
      .attr("class", "connection-line")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-width", 2)
      .attr("x1", d => d.sourceNode.x)
      .attr("y1", d => d.sourceNode.y)
      .attr("x2", d => d.targetNode.x)
      .attr("y2", d => d.targetNode.y)
      .attr("opacity", 0.6);

    // Distance labels - minimal and clean
    connections.append("text")
      .attr("class", "distance-label")
      .attr("x", d => (d.sourceNode.x + d.targetNode.x) / 2)
      .attr("y", d => (d.sourceNode.y + d.targetNode.y) / 2 - 5)
      .attr("text-anchor", "middle")
      .attr("fill", "#64748b")
      .attr("font-size", "10px")
      .attr("font-weight", "500")
      .text(d => `${d.weight}`)
      .style("pointer-events", "none");

    // Create state nodes
    const nodeGroup = svg.append("g").attr("class", "states");
    
    const states = nodeGroup.selectAll(".state")
      .data(graphData.nodes)
      .enter().append("g")
      .attr("class", "state")
      .attr("transform", d => `translate(${d.x}, ${d.y})`);

    // State circles
    states.append("circle")
      .attr("class", "state-circle")
      .attr("r", 25)
      .attr("fill", d => regionColors[d.region].fill)
      .attr("stroke", d => regionColors[d.region].stroke)
      .attr("stroke-width", 2)
      .style("filter", "url(#shadow)")
      .style("cursor", "pointer");

    // State labels - clean typography
    states.append("text")
      .attr("class", "state-label")
      .attr("y", 6)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "11px")
      .attr("font-weight", "600")
      .text(d => d.label)
      .style("pointer-events", "none");

    // Add hover effects
    states.on("mouseover", function() {
      d3.select(this).select(".state-circle")
        .transition()
        .duration(200)
        .attr("r", 30)
        .attr("stroke-width", 3);
    })
    .on("mouseout", function() {
      d3.select(this).select(".state-circle")
        .transition()
        .duration(200)
        .attr("r", 25)
        .attr("stroke-width", 2);
    });

  }, []);


  // Reset visualization
  const resetVisualization = (): void => {
    const svg = d3.select(svgRef.current);
    
    // Reset state colors
    svg.selectAll(".state-circle")
      .transition()
      .duration(300)
      .attr("fill", (d: any) => regionColors[d.region].fill)
      .attr("r", 25)
      .attr("stroke-width", 2);
    
    // Reset connection colors
    svg.selectAll(".connection-line")
      .transition()
      .duration(300)
      .attr("stroke", "#cbd5e1")
      .attr("stroke-width", 2);
    
    setPathInfo(null);
    setBackendResults(null);
  };

  // Display final result
  const displayFinalResult = (results: BackendResults): void => {
    const svg = d3.select(svgRef.current);
    
    // Mark start state (emerald - distinct from regional green)
    svg.selectAll(".state")
      .filter((d: any) => d.id === results.from_city)
      .select(".state-circle")
      .transition()
      .duration(500)
      .attr("fill", pathColors.start.fill)
      .attr("stroke", pathColors.start.stroke)
      .attr("r", 32)
      .attr("stroke-width", 3);
    
    // Mark end state (rose - distinct from regional red)
    svg.selectAll(".state")
      .filter((d: any) => d.id === results.to_city)
      .select(".state-circle")
      .transition()
      .duration(500)
      .attr("fill", pathColors.destination.fill)
      .attr("stroke", pathColors.destination.stroke)
      .attr("r", 32)
      .attr("stroke-width", 3);
    
    // Mark intermediate states (amber)
    results.path.forEach((stateId, index) => {
      if (stateId !== results.from_city && stateId !== results.to_city) {
        svg.selectAll(".state")
          .filter((d: any) => d.id === stateId)
          .select(".state-circle")
          .transition()
          .delay(index * 300)
          .duration(400)
          .attr("fill", pathColors.transit.fill)
          .attr("stroke", pathColors.transit.stroke)
          .attr("r", 28)
          .attr("stroke-width", 3);
      }
    });
    
    // Highlight path connections
    for (let i = 0; i < results.path.length - 1; i++) {
      const sourceState = results.path[i];
      const targetState = results.path[i + 1];
      
      svg.selectAll(".connection")
        .filter((d: any) => 
          (d.source === sourceState && d.target === targetState) ||
          (d.source === targetState && d.target === sourceState)
        )
        .select(".connection-line")
        .transition()
        .delay(i * 500)
        .duration(800)
        .attr("stroke", "#2563eb")
        .attr("stroke-width", 5)
        .attr("opacity", 1);
    }
  };

  // Run algorithm
  const runDijkstra = async (): Promise<void> => {
    if (config.startNode === config.endNode) {
      setError('Origin and destination must be different states');
      return;
    }

    resetVisualization();
    const results = await callBackendDijkstra(config.startNode, config.endNode);
    
    if (results && results.success) {
      setPathInfo({
        path: results.path,
        distance: results.distance,
        totalCities: results.route_info.total_cities,
        directRoute: results.route_info.direct_route
      });
      
      // Show final result with animation
      setTimeout(() => displayFinalResult(results), 500);
    }
  };

  const handleStartNodeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setConfig(prev => ({ ...prev, startNode: e.target.value }));
  };

  const handleEndNodeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setConfig(prev => ({ ...prev, endNode: e.target.value }));
  };

  const handleAnimationSpeedChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setConfig(prev => ({ ...prev, animationSpeed: parseInt(e.target.value) }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <Navigation className="w-10 h-10 text-blue-600" />
           Shortest Path Explorer: Nigerian States
          </h1>
          <p className="text-gray-600">Dijkstra's Algorithm for Interstate Travel Planning</p>
        </header>

        {/* Controls Panel */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                From State
              </label>
              <select 
                value={config.startNode}
                onChange={handleStartNodeChange}
                aria-label="Select origin state"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              >
                {graphData.nodes.map(node => (
                  <option key={node.id} value={node.id}>{node.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-600" />
                To State
               </label>
              <select 
                value={config.endNode}
                onChange={handleEndNodeChange}
                aria-label="Select destination state"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              >
                {graphData.nodes.map(node => (
                  <option key={node.id} value={node.id}>{node.label}</option>
                ))}
              </select>
             
            </div>

            <div>
              <label htmlFor="animation-speed" className="block text-sm font-medium text-gray-700 mb-2">
                Animation Speed
              </label>
              <input 
                id="animation-speed"
                type="range"
                min="300"
                max="2000"
                step="100"
                value={config.animationSpeed}
                onChange={handleAnimationSpeedChange}
                className="w-full accent-blue-600"
                aria-label="Animation speed control"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Fast</span>
                <span>{(config.animationSpeed/1000).toFixed(1)}s</span>
                <span>Slow</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={runDijkstra}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                Find Route
              </button>
              
              <button 
                onClick={resetVisualization}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Network Visualization */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  Nigerian States Network, <span className='text-gray-500'>(weights are in kilometers)</span>
                </h2>
              </div>
              <div className="p-4  overflow-auto">
                <svg 
                  ref={svgRef}
                  className="border border-gray-200 rounded-lg  min-w-[800px] w-full shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* Route Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-blue-600" />
                Route Details
              </h3>
              {pathInfo ? (
                <div className="space-y-4">
                  <div>
                    <span className="font-medium text-gray-700">Optimal Path:</span>
                    <div className="text-sm text-gray-600 mt-1 bg-gray-50 p-3 rounded">
                      {pathInfo.path.join(' → ')}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Total Distance:</span>
                    <div className="text-2xl font-bold text-blue-600">{pathInfo.distance} km</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-700">States:</span>
                      <div className="text-lg text-gray-800">{pathInfo.totalCities}</div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Type:</span>
                      <div className="text-sm text-gray-800">
                        {pathInfo.directRoute ? 'Direct' : 'Multi-hop'}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">Select states and click "Find Route"</p>
              )}
            </div>

            {/* Legend */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Path Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-emerald-600 rounded-full"></div>
                      <span className="text-sm text-gray-700">Origin</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-rose-600 rounded-full"></div>
                      <span className="text-sm text-gray-700">Destination</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Transit</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-2 bg-blue-600 rounded"></div>
                      <span className="text-sm text-gray-700">Optimal Path</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Regions</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                      <span className="text-gray-700">North</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      <span className="text-gray-700">Central</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-700">South</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                      <span className="text-gray-700">East</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                      <span className="text-gray-700">South-South</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Network Statistics */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">States:</span>
                  <span className="text-sm font-semibold text-gray-900">{graphData.nodes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Connections:</span>
                  <span className="text-sm font-semibold text-gray-900">{graphData.edges.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`text-sm font-semibold ${backendResults ? 'text-blue-600' : 'text-gray-400'}`}>
                    {backendResults ? 'Route Found' : 'Ready'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DijkstraVisualization;