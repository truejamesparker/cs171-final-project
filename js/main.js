// Animate on scroll

AOS.init();

// VARIABLES

let globalData;

// URLS

let url = 'https://example.com/example.json';

// PROMISES

let promises = [
    // fetch(url).then(resp => resp.json()),
    d3.json('data/tv_data.json'),
    d3.csv('data/american_dream_data.csv')
];

// AWAIT

Promise.all(promises)
    .then( function(datasets){ initVisuals(datasets) })
    .catch( function (err){console.log(err)} );


function initVisuals(datasets) {
    
    console.log(datasets);

    let tvData = datasets[0];
    let dreamData = datasets[1];
    // let dataset1 = datasets[0];
    // let dataset2 = datasets[0];

    // INITIALIZE VISUALIZATIONS

    tvVis = new TvVis("tv", tvData);
    dreamVis = new AmericanDreamVis("american-dream-vis", dreamData)
    // dataVis1 = new TemplateViz("my-parent-element1", dataset1);
    // dataVis2 = new TemplateViz("my-parent-element2", dataset2);

    // INIT EVENT HANDLERS

    // eventHandler.bind("selectionChanged", function(event){
    //     let rangeStart = event.detail[0];
    //     let rangeEnd = event.detail[1];
    //     dataVis0.onSelectionChange(rangeStart, rangeEnd);
    // });
}
