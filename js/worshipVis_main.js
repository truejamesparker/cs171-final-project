// Variable for the visualization instance
let newWorshipVis;
let state_worship_data = {
    "AL": 0,
    "AK": 0,
    "AZ": 0,
    "AR": 0,
    "CA": 0,
    "CO": 0,
    "CT": 0,
    "DE": 0,
    "DC": 0,
    "FL": 0,
    "GA": 0,
    "HI": 0,
    "ID": 0,
    "IL": 0,
    "IN": 0,
    "IA": 0,
    "KS": 0,
    "KY": 0,
    "LA": 0,
    "ME": 0,
    "MD": 0,
    "MA": 0,
    "MI": 0,
    "MN": 0,
    "MS": 0,
    "MO": 0,
    "MT": 0,
    "NE": 0,
    "NV": 0,
    "NH": 0,
    "NJ": 0,
    "NM": 0,
    "NY": 0,
    "NC": 0,
    "ND": 0,
    "OH": 0,
    "OK": 0,
    "OR": 0,
    "PA": 0,
    "PR": 0,
    "RI": 0,
    "SC": 0,
    "SD": 0,
    "TN": 0,
    "TX": 0,
    "UT": 0,
    "VT": 0,
    "VA": 0,
    "WA": 0,
    "WV": 0,
    "WI": 0,
    "WY": 0
};
let initial_threshold = 8000;

d3.csv("data/All_Places_of_Worship.csv").then(csv=> {

    csv = csv.filter(d => d.ATTENDANCE > initial_threshold);
    csv = csv.filter(d => d.DENOM != 'NOT AVAILABLE');

    csv.forEach(function(d){

        state_worship_data[d.STATE] += 1;

    });

    d3.json("data/us-states.json").then(jsonData =>{
        let states = jsonData;

        states.features.forEach(function(d){
            d.properties.worshipCount = state_worship_data[d.properties.abbreviation];
        });

        new new_worshipVis("worship-vis-new", csv, [37.0902, -95.7129], states);

    });


});
