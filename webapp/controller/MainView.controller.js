sap.ui.define([
    "legacy/controller/BaseController",
    'sap/m/MessageToast',
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "legacy/utils/formatter",
    'sap/ui/export/library',
    'sap/ui/export/Spreadsheet',
    "sap/ui/core/format/NumberFormat"
],

    function (BaseController, MessageToast, JSONModel, Filter, FilterOperator, formatter, exportLibrary, Spreadsheet, NumberFormat) {
        "use strict";
        var EdmType = exportLibrary.EdmType

        return BaseController.extend("legacy.controller.MainView", {
            onInit: function () {
                this.getCounterError()
                var loading = false
            },
            getCounterError: function () {
                var oModel = new JSONModel("../model/tileError.json");
                var Errors = this.getOwnerComponent().getModel('oDataInterfasesModel')

                Errors.setHeaders({
                    "sap-client": "300"
                })

                Errors.read("/CantLogsSet", {
                    filters: [
                        new sap.ui.model.Filter("Interface", FilterOperator.EQ, '01'),
                    ],
                    success: function (data) {
                        if (data.results.length) {
                            console.log(data)
                            data.results.forEach(function (result, index) {
                                oModel.setProperty('/tiles/' + index + '/kpivalue', result.Cantidad.replace(".", ""));
                            })
                            oModel.refresh()
                            this.getView().setModel(oModel);
                            console.log(oModel)

                        } else {
                            MessageToast.show("No hay datos para mostrar")
                            this.getView().setModel(oModel);
                        }

                    }.bind(this),
                    error: function (e) {
                        //
                    }
                })

            },
            createTiles: function (sId, oContext) {
                var Cantidad = oContext.getProperty("kpivalue");
                switch (true) {
                    case (Cantidad == 0):
                        return new sap.m.GenericTile({
                            header: oContext.getProperty("id") + " - " + oContext.getProperty("title"),
                            subheader: oContext.getProperty("subtitle"),
                            frameType: "OneByHalf",
                            press: this.pressTile.bind(this),
                            sizeBehavior: "Small",
                            state : this.loading,
                                tileContent: new sap.m.TileContent({
                                    unit: oContext.getProperty("unit"),
                                    footer: oContext.getProperty("footer"),
                                    content: new sap.m.NumericContent({
                                        value: oContext.getProperty("kpivalue"),
                                        truncateValueTo: 8
                                    })
                                })
                        }).addStyleClass("goodTileBackground sapUiTinyMargin");

                    case (Cantidad > 0 && Cantidad < 50):
                        return new sap.m.GenericTile({
                            header: oContext.getProperty("id") + " - " + oContext.getProperty("title"),
                            subheader: oContext.getProperty("subtitle"),
                            frameType: "OneByHalf",
                            press: this.pressTile.bind(this),
                            sizeBehavior: "Small",
                            state : this.loading,
                            tileContent: new sap.m.TileContent({
                                unit: oContext.getProperty("unit"),
                                footer: oContext.getProperty("footer"),
                                content: new sap.m.NumericContent({
                                    value: oContext.getProperty("kpivalue"),
                                    truncateValueTo: 8
                                })
                            })
                        }).addStyleClass("criticalTileBackground sapUiTinyMargin");

                    case (Cantidad > 50):
                        return new sap.m.GenericTile({
                            header: oContext.getProperty("id") + " - " + oContext.getProperty("title"),
                            subheader: oContext.getProperty("subtitle"),
                            frameType: "OneByHalf",
                            press: this.pressTile.bind(this),
                            sizeBehavior: "Small",
                            state : this.loading,
                            tileContent: new sap.m.TileContent({
                                unit: oContext.getProperty("unit"),
                                footer: oContext.getProperty("footer"),
                                content: new sap.m.NumericContent({
                                    value: oContext.getProperty("kpivalue"),
                                    truncateValueTo: 8
                                })
                            })
                        }).addStyleClass("errorTileBackground sapUiTinyMargin");

                    default:
                        return null;
                }
            },
            pressTile: function (event) {
                var table = this.byId("tableVBox")
                var tiles = this.byId("TileContainerExpanded")
           
                this.getView().setModel(new JSONModel([]), "FilteredErrors")

                table.setBusy(true)
                tiles.setBusy(true)
                var sPath = event.getSource().getBindingContext().sPath
                var oModel = this.getView().getModel()
                var oContext = oModel.getProperty(sPath);

                if (oContext.id === '01' || oContext.id === '05') {
                    this.byId("PedidoPortal").setVisible(false)
                    this.byId("PedidoSap").setVisible(false)
                } else {
                    this.byId("PedidoPortal").setVisible(true)
                    this.byId("PedidoSap").setVisible(true)
                }

                var filterInterface = this.getOwnerComponent().getModel('oDataInterfasesModel')

                filterInterface.setHeaders({
                    "sap-client": "300"
                })

                filterInterface.read("/LogsSet", {
                    filters: [
                        new sap.ui.model.Filter("Interface", FilterOperator.EQ, oContext.id),
                    ],
                    success: function (data) {

                        if (data.results.length) {
                            console.log(data)
                            this.getView().setModel(new JSONModel(data.results), "FilteredErrors")
                        } else {
                            MessageToast.show("No hay datos para mostrar")
                            this.getView().setModel(new JSONModel(data.results), "FilteredErrors")
                        }
                        table.setBusy(false)
                        tiles.setBusy(false)
                    }.bind(this),
                    error: function (e) {
                        //
                    }
                })

                // Cambiar a visible los elementos
                this.getView().byId("table-title").setText("Interfase " + oContext.id)
                table.setVisible(true)
                this.onCleanFilters()
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


                this.getView().getModel("TempDataModel").setData(oSelectedData)

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this)
                oRouter.navTo("ErrorDetail", { IdLog: oSelectedData.IdLog || '00000' })
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

