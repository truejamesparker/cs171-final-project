
d3.csv("data/ownrent.csv").then(csv => {
    let data = csv;
    let yearsGraph = new RentOwnVis("rentOwnYears", data, "years");
    let familyGraph = new RentOwnVis("rentOwnFamily", data, "family");
    let agesGraph = new RentOwnVis('rentOwnAges', data, "ages");

})

d3.select("#grouped-bars-choice").on("change", changeBarsType);

function changeBarsType(){
    let v = d3.select("#grouped-bars-choice").property("value");
    console.log('v')
    if (v === "years") {
        document.getElementById("rentOwnAges").style.display = "none";
        document.getElementById("rentOwnFamily").style.display = "none";
        document.getElementById("rentOwnYears").style.display = "inline";
    } else if (v === "family") {
        document.getElementById("rentOwnAges").style.display = "none";
        document.getElementById("rentOwnFamily").style.display = "inline";
        document.getElementById("rentOwnYears").style.display = "none";

    } else if (v === "ages") {
        document.getElementById("rentOwnAges").style.display = "inline";
        document.getElementById("rentOwnFamily").style.display = "none";
        document.getElementById("rentOwnYears").style.display = "none";
    }
}
