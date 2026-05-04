

export const MARKER_FEATURES = {
  // Basic Marker Properties
  size: 6,                       
  colors: ['#8b5cf6'],              
  strokeColors: '#ffffff',      
  strokeWidth: 2,                  
  strokeOpacity: 1,              
  fillOpacity: 1,             
  shape: 'circle',            
  radius: 3,                      
  
  // Marker Positioning
  offsetX: 0,                   
  offsetY: 0,                     
  
  // Marker Visibility
  showNullDataPoints: true,       
  
  // Hover Effects
  hover: {
    size: 10,                
    sizeOffset: 3,        
  },
  
  // Discrete Markers (for specific points)
  discrete: [],                 
  
  // Event Handlers
  onClick: undefined,             
  onDblClick: undefined,            
};


// Example 1: Larger markers with different colors
export const LARGE_MARKERS = {
  size: 8,
  colors: ['#ec4899'],
  strokeColors: '#ffffff',
  strokeWidth: 3,
  hover: {
    size: 12,
    sizeOffset: 4,
  },
};

// Example 2: Square markers
export const SQUARE_MARKERS = {
  size: 6,
  shape: 'square',
  radius: 2,
  colors: ['#10b981'],
  strokeColors: '#ffffff',
  strokeWidth: 2,
};

// Example 3: Discrete markers (highlight specific points)
export const DISCRETE_MARKERS = {
  discrete: [
    {
      seriesIndex: 0,
      dataPointIndex: 0,
      fillColor: '#f59e0b',
      strokeColor: '#ffffff',
      size: 8,
    },
    {
      seriesIndex: 0,
      dataPointIndex: 6,
      fillColor: '#f59e0b',
      strokeColor: '#ffffff',
      size: 8,
    },
  ],
};


