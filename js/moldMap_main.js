// Variable for the visualization instance
let moldMap;

d3.csv("data/new_mold.csv").then(csv=> {

    gettingStarted(csv);

});

function gettingStarted(data) {

    d3.json("data/Borough-Boundaries.geojson"). then(jsonData=>{
        let geoJSONdata = jsonData;
        moldMap = new MoldMap("mold-map", data, [40.7128, -74.0060], geoJSONdata);

    });


}
