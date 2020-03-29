
$.getJSON("https://api.rootnet.in/covid19-in/stats/latest",
function(data) {
    
    Obj = data.data.summary;
    
    
    
    $("div#latest_confirmed").html(Obj.total);
    $("div#latest_death").html(Obj.deaths);
    $("div#latest_discharged").html(Obj.discharged);
    $("div#latest_active").html(Obj.total-Obj.discharged-Obj.deaths);
    
});

var all_data = [];
var statewise = {};
var maxConfirmed = 0;
var lastUpdated = "";

var confirmed_delta = 0;
var deaths_delta = 0;
var recovered_delta = 0;
var states_delta = 0;
let total = {};
var key_values = 0;
var numStatesInfected = 0;
var stateWiseTableData;
var sort_field = 0;
var sort_order;

var table_columns = [
    {
        key: "state",
        display_name: "State"
    },
    {
        key: "confirmed",
        display_name: "Confirmed"
    },
    {
        key: "recovered",
        display_name: "Recovered"
    },
    {
        key: "deaths",
        display_name: "Deaths"
    },
    {
        key: "active",
        display_name: "Active"
    }
];

$.getJSON("https://api.covid19india.org/data.json",
function(result) {
    stateWiseTableData = result.statewise;
    key_values = result.key_values[0];
    stateWiseTableData.forEach((stateData) => {
        if(stateData.state === "Total") {
            total = stateData;
        } else {
            if(parseInt(stateData.confirmed) > 0) {
                numStatesInfected++;
            }
            maxConfirmed = stateData.confirmed > maxConfirmed ? stateData.confirmed : maxConfirmed;
            statewise[stateData.state] = stateData;
        }
    });

    tablehtml = constructTable(stateWiseTableData);
    
    $("div#states-value").html(numStatesInfected);
    $("div#confvalue").html(total.confirmed);
    $("div#deathsvalue").html(total.deaths);
    $("div#recoveredvalue").html(total.recovered);
    $("strong#last-updated").html(key_values.lastupdatedtime);

    if(key_values.confirmeddelta)$("div#confirmed_delta").html("( +"+key_values.confirmeddelta+")");
    if(key_values.deceaseddelta) $("div#deaths_delta").html("( +"+key_values.deceaseddelta+")");
    if(key_values.recovereddelta)$("div#recovered_delta").html("( +"+key_values.recovereddelta+")");
    if(key_values.statesdelta)$("div#states_delta").html("( +"+key_values.statesdelta+")");



});



function constructTable(stateWiseTableData) {
    var tablehtml = "<thead>";

    /* Construct Table Header */
    tablehtml += "<tr>";
    table_columns.forEach(function(column, i) {
        tablehtml += "<th><a href='' col_id='" + i + "' onclick='sort(this,event)'>" + column.display_name + "</a></th>";
    });
    tablehtml += "</tr></thead><tbody>";

    /* Construct Table Body */
    stateWiseTableData.forEach((stateData, index) => {
        if(stateData.state === "Total"){
            return;
        }

        tablehtml += "<tr>";
        table_columns.forEach(column => {
            if(parseInt(stateData.confirmed) > 0) {
                tablehtml += "<td>" + stateData[column.key] + "</td>";
            }
        })
        tablehtml += "</tr>";

    });

    /* Adding Total Row at end */
    tablehtml += '<tr class="totals">';
    table_columns.forEach(column => {
        tablehtml += "<td>" + total[column.key] + "</td>";
    });
    tablehtml += "</tr></tbody";

    $("table#prefectures-table").html(tablehtml);
    return tablehtml;
}

function sort(column, event) {
    event.stopPropagation();
    event.preventDefault();

    const col_id = $(column).attr("col_id");

    var total_ele = stateWiseTableData.splice(0, 1);
    
    sort_order = col_id == sort_field? sort_order : undefined;

    if(!sort_order) {
        sort_order = col_id == 0? "A" : "D"
    }

    const columnKey = table_columns[col_id].key;

    stateWiseTableData.sort((StateData1, StateData2) => {
        let value1 = StateData1[columnKey];
        let value2 = StateData2[columnKey];
        
        if(columnKey != "state") {
            value1 = parseInt(value1);
            value2 = parseInt(value2);
        }

        if(sort_order == "D"){
            return value1 > value2? -1 : 1;
        } else {
            return value1 > value2? 1 : -1;
        }
    })

    stateWiseTableData.unshift(total_ele[0]);

    sort_field = col_id;

    sort_order = sort_order == "A"? "D" : "A";

    constructTable(stateWiseTableData);
}
