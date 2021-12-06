// Animate on scroll

AOS.init();

// VARIABLES

let globalData;
let rentOwnSelected;

// URLS

let url = 'https://example.com/example.json';

// PROMISES

let promises = [
    // fetch(url).then(resp => resp.json()),
    d3.json('data/tv_data.json'),
    d3.csv('data/american_dream_data.csv'),
    d3.json('data/home_phys_data.json'),
    d3.csv('data/famous_homes.csv'),
    d3.json('data/states.json'),
    d3.csv('data/lotsizes.csv'),
    d3.csv('data/All_Places_of_Worship.csv'),
];

// AWAIT

Promise.all(promises)
    .then( function(datasets){ initVisuals(datasets) })
    .catch( function (err){console.log(err)} );


function initVisuals(datasets) {

    console.log(datasets);

    let tvData = datasets[0];
    let dreamData = datasets[1];
    let physData = datasets[2];
    let famousData = datasets[3];
    let stateData = datasets[4];
    let lotData = datasets[5];
    let worshipData = datasets[6]
    let rentOwnData = datasets[7]

    // INITIALIZE VISUALIZATIONS

    tvVis = new TvVis("tv", tvData);
    dreamVis = new AmericanDreamVis("american-dream-vis", dreamData)
    physVis = new PhysVis("physical", physData);
    famousVis = new FamousVis("famous", famousData);
    homeMapVis = new HomeMapVis("home-map", stateData, lotData);


}
