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

        return Controller.extend("project1.controller.MainView", {
            onInit: function () {

                var oModel = new JSONModel("../model/tileError.json");
                this.getView().setModel(oModel);
                this.byId('interfasesFull').setBusy(true)
                var interModel = this.getOwnerComponent().getModel('interfasesModel')

                interModel.setHeaders({
                    "sap-client": "300"
                })

                interModel.read("/LogsSet", {
                    filters: [
                        new sap.ui.model.Filter("Interface", FilterOperator.EQ, '06')
                    ],
                    success: function (data) {
                        console.log("DATOS", data.results)
                        this.getView().setModel(new JSONModel(data.results), "interfases")
                        this.byId('interfasesFull').setBusy(false)

                    }.bind(this),
                    error: function (e) {
                        //
                    }
                });
            },
            pressTile: function (event) {
                var table = this.byId("interfaseTable")
          
                table.setBusy(true)

                var sPath = event.getSource().getBindingContext().sPath
                var oModel = this.getView().getModel()
                var oContext = oModel.getProperty(sPath);
                console.log(oContext)

                var filterInterface = this.getOwnerComponent().getModel('interfasesModel')

                filterInterface.setHeaders({
                    "sap-client": "300"
                })

                filterInterface.read("/LogsSet", {
                    filters: [
                        new sap.ui.model.Filter("Interface", FilterOperator.EQ, oContext.id),
                    ],
                    success: function (data) {
                        this.getView().setModel(new JSONModel(data.results), "FilteredErrors")
                        table.setBusy(false)
                    }.bind(this),
                    error: function (e) {
                        //
                    }
                })



                // Cambiar a visible los elementos
                table.setVisible(true)
                this.byId("search").setVisible(true)
                this.byId("interfasesFull").setVisible(false)
            },


            searchFilter: function () {
                this.byId("interfaseTable").setBusy(true)

                var aFilters = [];
                var filter = this.byId("searchFilter").getValue()

                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "YYYYMMdd" });
                var fromDate = dateFormat.format(this.getView().byId("fecha").getDateValue());
                var toDate = dateFormat.format(this.getView().byId("fecha").getSecondDateValue());

                if (filter) {
                    aFilters.push(new Filter("OrgVentas", FilterOperator.Contains, filter))
                }

                if (fromDate && toDate) {
                    aFilters.push(new Filter("Fecha", FilterOperator.BT, fromDate, toDate))
                }

                this.byId("interfaseTable").getBinding("items").filter(aFilters);
                this.byId("interfaseTable").setBusy(false)

            },



        });
    });
