let pieChart;

d3.csv("data/moving-data.csv").then(csv => {
    let data = csv;
    inboundGraph = new StateMovementBarChart("#inboundGraphContainer", data, "inbound");
    // pieChart = new StateMovement_pieChart("pieContainer", data, "Oregon");
})


d3.csv("data/moving-data-2.csv").then(csv => {
    let data = csv;
    outboundGraph = new StateMovementBarChart("#outboundGraphContainer", data, "outbound");
})


d3.select("#movement-shipment-type").on("change", changeShipmentType);

function changeShipmentType(){
    let variable_value = d3.select("#movement-shipment-type").property("value");
    console.log(variable_value);
    if (variable_value == "outbound") {
        document.getElementById("inboundGraphContainer").style.display = "none";
        document.getElementById("outboundGraphContainer").style.display = "inline";
    } else if (variable_value == "inbound") {
        document.getElementById("inboundGraphContainer").style.display = "inline";
        document.getElementById("outboundGraphContainer").style.display = "none";

    }
}