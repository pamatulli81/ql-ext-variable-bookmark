define(['qlik', 'jquery', './config', 'text!./style.css'],

    function (qlik, $, config, style) {

        _this = this;

        var app = qlik.currApp(_this);
        var enigmaModel = app.model.enigmaModel;

        $('<style>').html(style).appendTo('head');

        return {
            definition: config.definition,
            initialProperties: config.initialProperties,
            paint: main
        };

        function main($element, layout) {

            var html = "";

            $element.empty();
            buildGrid();

            /********************************************************************************************************************************************
              PAM: Functions and Events Handling      
            ********************************************************************************************************************************************/

            function buildGrid() {

                $element.empty();

                var qParamVarList = {
                    "qInfo": {
                        "qType": "VariableList",
                        "qId": ""
                    },
                    "qVariableListDef": {
                        "qType": "variable",
                        "qData": {
                            "tags": "/tags"
                        }
                    }
                };

                html = '<input type="text" id="searchInput" onkeyup="searchByName()" placeholder="Search for names.." class="lui-input"></input>';
                html += '<div id="table-wrapper"></div>';
                html += '<div id="table-scroll">';
                html += "<table id='varTable'><thead><tr>";
                html += '<th>' + 'Name' + '</th>';
                html += '<th>' + 'Definition' + '</th>'
                html += '<th>' + 'IncludeBookmark' + '</th>'
                html += '<th></th>';
                html += '</thead></tr>';

                enigmaModel.createSessionObject(qParamVarList).then(function (qObject) {
                    qObject.getLayout().then(function (qProp) {
                        console.log(qProp.qVariableList);
                        if (qProp.qVariableList.qItems.length > 0) {
                            var l = qProp.qVariableList.qItems.length;
                            var i = 0;
                            qProp.qVariableList.qItems.forEach(item => {
                                enigmaModel.getVariableByName(item.qName).then(function (v) {
                                    v.getProperties().then(function (p) {
                                        i = i + 1;
                                        html += '<tr>';
                                        html += '<td align="center">' + p.qName + '</td>';
                                        html += '<td align="center">' + p.qDefinition + '</td>';
                                        html += '<td align="center">' + p.qIncludeInBookmark + '</td>';
                                        if (p.qIncludeInBookmark) {
                                            html += '<td align="center"><button class="lui-button  lui-button--rounded  lui-button--success">Exclude</button></td>';
                                        }
                                        else {
                                            html += '<td align="center"><button class="lui-button  lui-button--rounded  lui-button--danger">Include</button></td>';
                                        }
                                        html += '</tr>';

                                        if (l == i) {
                                            html += "</table>";
                                            html += "</div>";
                                            html += "</div>";
                                            $element.append(html);
                                            addEvents();
                                            sortTable();
                                        }
                                    });
                                });
                            });
                        }
                        else {
                            html += "</table>";
                            $element.append(html);
                        }
                    });
                });
            }

            function sortTable() {
                var table, rows, switching, i, x, y, shouldSwitch;
                table = document.getElementById("varTable");
                switching = true;
                while (switching) {
                  switching = false;
                  rows = table.rows;
                  for (i = 1; i < (rows.length - 1); i++) {
                    shouldSwitch = false;
                    x = rows[i].getElementsByTagName("TD")[0];
                    y = rows[i + 1].getElementsByTagName("TD")[0];
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                      shouldSwitch = true;
                      break;
                    }
                  }
                  if (shouldSwitch) {
                    rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                    switching = true;
                  }
                }
              }

            function addEvents() {

                 $('#varTable').on('click', 'tr', function (event) {

                    var qName = $(this).find("td:eq(0)").text();
                    var qIncludeBookmark = $(this).find("td:eq(2)").text();
                    enigmaModel.getVariableByName(qName).then(function (v) {
                        v.getProperties().then(function (p) {
                            var qProp = {
                                "qInfo": {
                                    "qId": p.qInfo.qId,
                                    "qType": p.qInfo.qType
                                },
                                "qMetaDef": p.qMetaDef,
                                "qName": p.qName,
                                "qIncludeInBookmark": qIncludeBookmark == "true" ? false : true,
                                "qDefinition": p.qDefinition,
                                "qComment": p.qComment,
                                "qNumberPresentation": p.qNumberPresentation
                            };

                            v.setProperties(qProp).then(function () {
                                buildGrid();
                            });

                        });
                    });
                });
            }
        }
    });

    function searchByName() {
        // Declare variables 
        var input, filter, table, tr, td, i, txtValue;
        input = document.getElementById("searchInput");
        filter = input.value.toUpperCase();
        table = document.getElementById("varTable");
        tr = table.getElementsByTagName("tr");

        // Loop through all table rows, and hide those who don't match the search query
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[0];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }