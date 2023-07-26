sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageToast',
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "legacy/utils/formatter",
     'sap/ui/export/library',
    'sap/ui/export/Spreadsheet'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, JSONModel, Filter, FilterOperator, formatter,exportLibrary, Spreadsheet) {
        "use strict";
        var EdmType = exportLibrary.EdmType
    
        return Controller.extend("legacy.controller.MainView", {
            onInit: function () {
                var oModel = new JSONModel("../model/tileError.json");
                this.getView().setModel(oModel);
            },
            createTiles: function (sId, oContext) {
                var oColor = oContext.getProperty("color");

                switch (oColor) {
                    case "Good":
                        return new sap.m.GenericTile({
                            header: oContext.getProperty("title"),
                            subheader: oContext.getProperty("subtitle"),
                            frameType: "OneByHalf",
                            press: this.pressTile.bind(this),
                            sizeBehavior: "Small",
                            tileContent: new sap.m.TileContent({
                                unit: oContext.getProperty("unit"),
                                footer: oContext.getProperty("footer"),
                                content: new sap.m.NumericContent({
                                    value: oContext.getProperty("kpivalue"),
                                })
                            })
                        }).addStyleClass("goodTileBackground sapUiTinyMargin");

                    case "Critical":
                        return new sap.m.GenericTile({
                            header: oContext.getProperty("title"),
                            subheader: oContext.getProperty("subtitle"),
                            frameType: "OneByHalf",
                            press: this.pressTile.bind(this),
                            sizeBehavior: "Small",
                            tileContent: new sap.m.TileContent({
                                unit: oContext.getProperty("unit"),
                                footer: oContext.getProperty("footer"),
                                content: new sap.m.NumericContent({
                                    value: oContext.getProperty("kpivalue"),
                                })
                            })
                        }).addStyleClass("criticalTileBackground sapUiTinyMargin");

                    case "Error":
                        return new sap.m.GenericTile({
                            header: oContext.getProperty("title"),
                            subheader: oContext.getProperty("subtitle"),
                            frameType: "OneByHalf",
                            press: this.pressTile.bind(this),
                            sizeBehavior: "Small",
                            tileContent: new sap.m.TileContent({
                                unit: oContext.getProperty("unit"),
                                footer: oContext.getProperty("footer"),
                                content: new sap.m.NumericContent({
                                    value: oContext.getProperty("kpivalue"),
                                })
                            })
                        }).addStyleClass("errorTileBackground sapUiTinyMargin");

                    default:
                        return null;
                }
            },
            pressTile: function (event) {
                var table = this.byId("tableVBox")
                this.getView().setModel(new JSONModel([]), "FilteredErrors")

                table.setBusy(true)

                var sPath = event.getSource().getBindingContext().sPath
                var oModel = this.getView().getModel()
                var oContext = oModel.getProperty(sPath);

                var filterInterface = this.getOwnerComponent().getModel('interfasesModel')

                filterInterface.setHeaders({
                    "sap-client": "300"
                })

                filterInterface.read("/LogsSet", {
                    filters: [
                        new sap.ui.model.Filter("Interface", FilterOperator.EQ, oContext.id),
                    ],
                    success: function (data) {

                        if (data.results.length) {
                            this.getView().setModel(new JSONModel(data.results), "FilteredErrors")
                            //     console.log(data)

                        } else {
                            MessageToast.show("No hay datos para mostrar")
                            this.getView().setModel(new JSONModel(data.results), "FilteredErrors")
                        }
                        table.setBusy(false)
                    }.bind(this),
                    error: function (e) {
                        //
                    }
                })

                // Cambiar a visible los elementos
                table.setVisible(true)
            },
            searchFilter: function () {
                this.byId("interfaseTable").setBusy(true)

                var aFilters = [];
                var filter = this.byId("orgVta").getValue()

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
            onPress: function (oEvent) {

                var itemPress = oEvent.getSource()
                var oContext = itemPress.getBindingContext("FilteredErrors")
                var oSelectedData = oContext.getObject()

                // var oEventBus = sap.ui.getCore().getEventBus();
                // oEventBus.publish("appChannel", "selectedDataEvent", oSelectedData);

                this.getView().getModel("TempDataModel").setData(oSelectedData)

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this)
                oRouter.navTo("ErrorDetail")
            },
            onCleanFilters: function () {
                this.getView().byId("fecha").setValue(null);
                this.getView().byId("orgVta").setValue(null);
                var aFilters = [];
                this.byId("interfaseTable").getBinding("items").filter(aFilters);

            },
            createColumnConfig: function () {
                var aCols = [];

                aCols.push({
                    label: 'Org. Ventas',
                    type: EdmType.String,
                    property: 'OrgVentas',
                    template: '{0}'
                });

                aCols.push({
                    label: 'Fecha',
                    type: EdmType.Number,
                    property: 'Fecha',
                    scale: 0
                });
                aCols.push({
                    label: 'Hora',
                    type: EdmType.Number,
                    property: 'Hora',
                    scale: 0
                });
                aCols.push({
                    label: 'Operacion',
                    type: EdmType.String,
                    property: 'Operacion',
                    scale: 0
                });
                aCols.push({
                    label: 'Mensaje',
                    type: EdmType.String,
                    property: 'Mensaje',
                    scale: 0
                });
                aCols.push({
                    label: 'Pedido SAP',
                    type: EdmType.Number,
                    property: 'PedidoSAP',
                    scale: 0
                });
                aCols.push({
                    label: 'Cliente SAP',
                    type: EdmType.Number,
                    property: 'ClienteSAP',
                    scale: 0
                });
                aCols.push({
                    label: 'Pedido Portal',
                    type: EdmType.Number,
                    property: 'PedidoPortal',
                    scale: 0
                });
                aCols.push({
                    label: 'Id Site',
                    type: EdmType.Number,
                    property: 'IdSite',
                    scale: 0
                });
                aCols.push({
                    label: 'Oportunidad',
                    type: EdmType.String,
                    property: 'Oportunidad',
                    scale: 0
                });


                return aCols;
            },

            exportToExcel: function () {
                var aCols, oRowBinding, oSettings, oSheet, oTable;

                if (!this._oTable) {
                    this._oTable = this.byId('interfaseTable');
                }

                oTable = this._oTable;
                oRowBinding = oTable.getBinding('items');
                aCols = this.createColumnConfig();

                oSettings = {
                    workbook: {
                        columns: aCols,
                        hierarchyLevel: 'Level'
                    },
                    dataSource: oRowBinding,
                    fileName: 'Table export sample.xlsx',
                    worker: false // We need to disable worker because we are using a MockServer as OData Service
                };

                oSheet = new Spreadsheet(oSettings);
                oSheet.build().finally(function () {
                    oSheet.destroy();
                });
            }

        })
    })

