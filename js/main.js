// Animate on scroll

AOS.init();

// VARIABLES

let globalData;

// URLS

let url = 'https://example.com/example.json';

// PROMISES

let promises = [
    // fetch(url).then(resp => resp.json()),
    // d3.json('data/example.json')
];

// AWAIT

Promise.all(promises)
    .then( function(datasets){ initVisuals(datasets) })
    .catch( function (err){console.log(err)} );


function initVisuals(datasets) {
    
    // console.log(datasets);

    let dataset0 = datasets[0];
    // let dataset1 = datasets[0];
    // let dataset2 = datasets[0];

    // INITIALIZE VISUALIZATIONS

    dataVis0 = new TemplateVis("vis0", dataset0);
    // dataVis1 = new TemplateViz("my-parent-element1", dataset1);
    // dataVis2 = new TemplateViz("my-parent-element2", dataset2);

    // INIT EVENT HANDLERS

    // eventHandler.bind("selectionChanged", function(event){
    //     let rangeStart = event.detail[0];
    //     let rangeEnd = event.detail[1];
    //     dataVis0.onSelectionChange(rangeStart, rangeEnd);
    // });
}
