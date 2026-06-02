"use client";

import React, { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { Info } from "lucide-react";

export const TourGuideButton = () => {
  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        { 
          element: '#pipeline-map', 
          popover: { 
            title: 'The Data Pipeline', 
            description: 'This map shows the 7 core stages a piece of data goes through. As you complete actions, you can navigate forward using these circles.', 
            side: "bottom", 
            align: 'start' 
          }
        },
        { 
          element: '#eli5-toggle', 
          popover: { 
            title: 'Confused by jargon?', 
            description: 'Flip this switch at any time! We will instantly swap out scary data engineering terms (like OLTP) with simple real-world metaphors (like Cash Register).', 
            side: "top", 
            align: 'center' 
          }
        },
        { 
          element: '#golden-thread-badge', 
          popover: { 
            title: 'The Golden Thread', 
            description: 'Keep an eye on this little button! It tracks the very first order you create and lets you spy on how it changes form in every stage of the pipeline.', 
            side: "top", 
            align: 'start' 
          }
        }
      ]
    });
    
    driverObj.drive();
  };

  return (
    <button 
      onClick={startTour}
      className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors text-sm font-medium"
    >
      <Info size={16} className="text-blue-400" />
      Start Quick Tour
    </button>
  );
};
