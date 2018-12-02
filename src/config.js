define(function() {
  
  var QLIK_DIMENSION_MAX = 0;
  var QLIK_DIMENSION_MIN = 0;
  var QLIK_MEASURE_COUNT = 0;
  
  var about = {
    type: "items",
    label: "About",
    items: {
      about1: {
        type: "string",
        component: "text",
        label: "QlikLab - Patric Amatulli 2018"
      },
      about1a: {
        type: "string",
        component: "text",
        label: "BETA: v0.1.0" 
      },
      about2: {
        type: "string",
        component: "text",
        label: "GitHub: www.github.com/pamaxeed"
      },
      about3: {
        type: "string",
        component: "text",
        label: "www.qliklab.ch"
      },
      about4: {
        type: "string",
        component: "text",
        label: "Variable Management for Bookmark inclusion"
      }
    }
  };
 
  return {
        
    initialProperties: {
      version: 1.0,
      qHyperCubeDef: {
        qDimensions: [],
        qMeasures: [],
        qInitialDataFetch: [{
            qWidth: 0,
            qHeight: 0 // needs a limitation
        }]
      },
      selectionMode: "CONFIRM"
    },
    definition: {
      type: 'items',
      component: 'accordion',
      items: {        
        bubbles: {
          uses: 'dimensions',
          min: QLIK_DIMENSION_MIN,
          max: QLIK_DIMENSION_MAX
        },        
        size: {
          uses: 'measures',
          min: QLIK_MEASURE_COUNT,
          max: QLIK_MEASURE_COUNT,
        },
        addons: {
          uses: "addons",
          items: {
            dataHandling: {
              uses: "dataHandling"
            }
          }
        },
        settings: {
          uses: "settings"
        }
      }     
    },
    about,
    snapshot: {
	    canTakeSnapshot: true
    }
  };
});
