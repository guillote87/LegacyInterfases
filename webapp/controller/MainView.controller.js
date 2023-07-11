sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageToast',
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, JSONModel) {
        "use strict";

        return Controller.extend("legacy.controller.MainView", {
            onInit: function () {

                var oModel = new JSONModel("../model/tileError.json");
                this.getView().setModel(oModel);
                var oModelErrors = new JSONModel("../model/interfaseError.json");
                this.getView().setModel(oModelErrors, "Errors");
            }
        });
    });
