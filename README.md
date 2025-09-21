 

A **Group Project** showcasing the implementation of **Dijkstra's shortest path algorithm** in **Python** for **interstate travel planning** across **10 major Nigerian states**.  

---

## Project Overview  

This interactive web application demonstrates the **practical implementation of Dijkstra's algorithm** in solving real-world pathfinding problems.  

- Uses a **graph structure** of **10 major Nigerian states**  
- Allows users to **find the shortest routes** between states  
- Provides **visualization of paths**  
- Offers a **step-by-step execution view** of the algorithm  

---

## Features  

### Core Algorithm Implementation  
- **Dijkstra's Shortest Path Algorithm** with priority queue optimization  
- **Distance Calculation** based on interstate highway networks  
- **Path Reconstruction** for full source-to-destination visualization  

### Interactive Visualization  
- **Interactive Map Interface** with state connections  
- **Real-time Path Highlighting** for shortest routes  
- **Step-by-step Algorithm Execution** to observe Dijkstra in action  
- **Travel Statistics** including distance and waypoints  

---

## Technical Implementation  

### Technologies Used  
- **Frontend**: React.js with TypeScript  
- **Backend Algorithm**: Python implementation of Dijkstra (priority queue based)  

### Algorithm Details  
- **Time Complexity**: `O((V + E) log V)`  
- **Space Complexity**: `O(V)`  
- Where **V = vertices (states)** and **E = edges (connections)**  

### Graph Data Structure  
- **Vertices (10)**: Major Nigerian states  
- **Edges (16)**: Interstate highway connections  
- **Weights**: Distances in kilometers based on real highway routes  

---

## States Network  

### Included States (10 total)  
- **Northern Region**: Kano, Kaduna  
- **Central Region**: FCT Abuja, Plateau, Niger  
- **Southern Region**: Lagos, Oyo  
- **Eastern Region**: Enugu, Anambra  
- **South-South Region**: Rivers  

---

## Network Topology  

**Note:** The distances listed are **simulated values** and do not represent the exact real-world distances between these cities. They are used for demonstration purposes only.  

### Northern Backbone  
- Kaduna ↔ Kano (160 km)  

### North-Central Connections  
- Kaduna ↔ Abuja (160 km)  
- Kaduna ↔ Niger (180 km)  
- Abuja ↔ Plateau (200 km)  
- Kano ↔ Plateau (280 km)  

### Central Hub  
- Niger ↔ Abuja (120 km)  
- Niger ↔ Oyo (180 km)  

### Western Corridor  
- Lagos ↔ Oyo (150 km)  
- Oyo ↔ Abuja (250 km)  

### Eastern Network  
- Abuja ↔ Enugu (290 km)  
- Plateau ↔ Enugu (250 km)  
- Enugu ↔ Anambra (110 km)  

### Southern Links  
- Anambra ↔ Rivers (120 km)  
- Oyo ↔ Rivers (280 km)  

### Cross-Regional Routes  
- Lagos ↔ Rivers (340 km)  
- Oyo ↔ Anambra (220 km)  
