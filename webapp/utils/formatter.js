sap.ui.define([], function() {
    return {
      mapValueColorToTileClass: function(color) {
                // Your logic to map valueColor to CSS class
        switch (color) {
          case "Good":
            return "goodTileBackground";
          case "Critical":
            return "criticalTileBackground";
          case "Error":
            return "errorTileBackground";
          default:
            return ""; // Empty string if valueColor doesn't match any case
        }
      }
    };
  });
