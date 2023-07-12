sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageToast',
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, JSONModel, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("legacy.controller.MainView", {
            onInit: function () {
                var oModel = new JSONModel("../model/tileError.json");
                this.getView().setModel(oModel);
                var oModelErrors = new JSONModel("../model/interfaseError.json");
                this.getView().setModel(oModelErrors, "Errors");
            },
            pressTile: function (event) {

                var sPath = event.getSource().getBindingContext().getPath()
                var oModel = this.getView().getModel()

                var oContext = oModel.getProperty(sPath)
                var oFilter = new Filter("Interfase", FilterOperator.EQ , oContext.id)
                console.log(oFilter)

                var table = this.byId("interfaseTable")
                table.getBinding("items").filter(oFilter)
                table.setProperty('visible').true
            }
        });
    });
