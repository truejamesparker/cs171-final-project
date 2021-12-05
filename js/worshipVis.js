
/*
 *  HomePriceIndexMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

class WorshipVis {

    /*
     *  Constructor method
     */
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.displayData = null;
        console.log(this.data)
        this.initVis();
    }


    /*
     *  Initialize vis
     */
    initVis () {
        let vis = this;


        // TODO

        vis.margin = { top: 40, right: 20, bottom: 40, left: 20 };

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.top - vis.margin.bottom;


        // SVG drawing area


        L.Icon.Default.imagePath = 'img/';

        vis.map = L.map(vis.parentElement).setView([40.0902, -95.7129], 3.5);

        L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
                maxZoom: 6,
            }).addTo(vis.map);

        vis.states = L.layerGroup().addTo(vis.map);

        L.svg().addTo(vis.map);



// Select the svg area and add circles:




        var valueExtent = d3.extent(vis.data, function(d) { return +d.ATTENDANCE; })
        vis.size = d3.scaleSqrt()
            .domain(valueExtent)  // What's in the data
            .range([ 1, 50])  // Size in pixel


        vis.radius = d3.scaleSqrt([0, d3.max(vis.data, d => d.ATTENDANCE)], [0, 5])

        vis.wrangleData();
    }


    /*
     *  Data wrangling
     */
    wrangleData () {
        let vis = this;



        this.displayData = this.data.filter(d => d.ATTENDANCE > 2000);
        this.displayData = this.displayData.filter(d => d.DENOM != 'NOT AVAILABLE');
        console.log(vis.data)
        console.log("there!")
        console.log(vis.displayData)

        var denoms = d3.map(vis.displayData, function(d){return(d.DENOM)}).keys()
        vis.color = d3.scaleOrdinal()
            .domain(denoms)
            .range(d3.schemePaired);
        console.log(d3.map(vis.displayData, function(d){return(d.DENOM)}))
        console.log('hi')

        d3.select("#" + vis.parentElement)
            .select("svg")
            .selectAll("mycircle")
            .data(vis.displayData)
            .enter()
            .append("circle")
            .attr("cx", function(d){ return vis.map.latLngToLayerPoint([d.Y, d.X]).x })
            .attr("cy", function(d){ return vis.map.latLngToLayerPoint([d.Y, d.X]).y })
            .attr("r", d=>vis.radius(d.ATTENDANCE))
            .style("fill", d=>vis.color(d.DENOM))
            .attr("stroke", d=>vis.color(d.DENOM))
            .attr("stroke-width", 3)
            .attr("fill-opacity", .4)



        // Update the visualization


        vis.updateVis();
    }

    updateVis() {
        let vis = this;
        function update() {
            d3.select("#" + vis.parentElement)
                .selectAll("circle")
                .attr("cx", function(d){ return vis.map.latLngToLayerPoint([d.Y, d.X]).x })
                .attr("cy", function(d){ return vis.map.latLngToLayerPoint([d.Y, d.X]).y });

        }

        update();


        vis.map.on("moveend", update);

        // TODO
    }


}

