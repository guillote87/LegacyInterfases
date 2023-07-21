sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";
    return Controller.extend("legacy.controller.ErrorDetail", {
        onInit: function () {
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.subscribe("appChannel", "selectedDataEvent", this.onSelectedDataReceived, this)
        },
        onSelectedDataReceived: function (sChannelId, sEventId, oData) {
            console.log("Selected Data from View1:", oData);

            if (oData) {
                var oDetailModel = new JSONModel([oData])

            }
            this.getView().setModel(oDetailModel, "FilteredErrors")
        },

    })
});