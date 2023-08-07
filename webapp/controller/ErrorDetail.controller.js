sap.ui.define([
    "legacy/controller/BaseController",
    'sap/m/MessageToast',
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (BaseController, MessageToast, JSONModel, Filter, FilterOperator) {
    "use strict";
    return BaseController.extend("legacy.controller.ErrorDetail", {
        onInit: function () {
            this.getView().setModel("TempDataModel")

            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("ErrorDetail").attachMatched(this._onRouteMatched, this);

        },
        _onRouteMatched: function (oEvent) {
            var oArgs, oView;
            oArgs = oEvent.getParameter("arguments");
            oView = this.getView();
            this.getView().setModel(new JSONModel([]), "LogError")
            
            var log = this.getOwnerComponent().getModel('oDataInterfasesModel')

            log.setHeaders({
                'sap-client': "300"
            })

            log.read("/DispLogSet", {
                filters: [
                    new Filter('IdLog', FilterOperator.EQ, oArgs.IdLog)
                ],
                success: function (data) {
                    console.log(data)
                    if (data.results.length) {
                        this.getView().setModel(new JSONModel(data.results), "LogError")
                        //     console.log(data)

                    } else {
                        MessageToast.show("No hay datos para mostrar")
                        this.getView().setModel(new JSONModel(data.results), "LogError")
                    }
                }.bind(this),
                error: function (e) {
                    //
                }
            })
        }
    })
})
