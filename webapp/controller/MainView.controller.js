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
                var oModelErrors = this.getView().getModel("Errors")
                var oContext = oModel.getProperty(sPath)

                const info = oModelErrors.getData()

                var FilterData = new JSONModel(info.filter(element => element.Interfase == oContext.id))

                this.getView().setModel(FilterData, "FilteredErrors")


                var table = this.byId("interfaseTable")


                // Cambiar a visible los elementos
                table.setProperty('visible').true
                this.byId("search").setProperty('visible').true
            },
            searchFilter: function () {
                var filter = this.byId("searchFilter").getValue()

                var oFilter = new Filter("Usuario", FilterOperator.Contains, filter)
                var table = this.byId("interfaseTable")
                table.getBinding("items").filter(oFilter)
            }
        });
    });
