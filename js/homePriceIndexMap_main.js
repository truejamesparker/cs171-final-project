// Variable for the visualization instance
let homePriceMap;
let state_HPI_data = {};
let state_HPI_change_data = {};

d3.csv("data/HPI_AT_BDL_state.csv").then(csv=> {

    csv.forEach(function(d){
        state_HPI_data[d.FIPS] = d.HPI;
        state_HPI_change_data[d.FIPS] = d.HPI_change;
    });

    d3.json("data/us-states.json").then(jsonData =>{
        let states = jsonData;

        states.features.forEach(function(d){
            d.properties.HPI = state_HPI_data[d.id];
            d.properties.HPI_change = state_HPI_change_data[d.id];
        });


        homePriceMap = new HomePriceIndexMap("price-map", states);

    });

});


d3.select("#variable-type").on("change", changeFilter);

function changeFilter(){
    variable_value = d3.select("#variable-type").property("value");
    d3.select(".HPIMapStateInfo").remove();
    homePriceMap.updateVis(variable_value)
}