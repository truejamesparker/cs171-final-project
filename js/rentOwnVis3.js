
/*
 *  HomePriceIndexMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

class RentOwnVis {

    /*
     *  Constructor method
     */
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.displayData = null;
        this.selected = 'years'
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
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.subgroups = vis.data.columns.slice(1)

        // List of groups = species here = value of the first column called group -> I show them on the X axis
        vis.groups = d3.map(vis.data, function(d){return(d['group'])})

        // Add X axis
        vis.x = d3.scaleBand()
            .domain(vis.groups)
            .range([0, vis.width])
            .padding([0.2])
        vis.svg.append("g")
            .attr("transform", "translate(0," + vis.height + ")")
            .call(d3.axisBottom(vis.x).tickSize(0));

        // Add Y axis
        vis.y = d3.scaleLinear()
            .domain([0, 100])
            .range([vis.height, 0 ]);
        vis.svg.append("g")
            .call(d3.axisLeft(vis.y));

        // Another scale for subgroup position?
        vis.xSubgroup = d3.scaleBand()
            .domain(vis.subgroups)
            .range([0, vis.x.bandwidth()])
            .padding([0.05])

        // color palette = one color per subgroup
        vis.color = d3.scaleOrdinal()
            .domain(vis.subgroups)
            .range(['#e41a1c','#377eb8','#4daf4a'])



        vis.wrangleData();
    }


    /*
     *  Data wrangling
     */
    wrangleData () {
        let vis = this;

        // TODO

        // Update the visualization
        vis.updateVis();
    }

    updateVis() {
        let vis = this;


        vis.svg.append("g")
            .selectAll("g")
            // Enter in data = loop group per group
            .data(vis.data)
            .enter()
            .append("g")
            .attr("transform", function(d) { return "translate(" + vis.x(d.group) + ",0)"; })
            .selectAll("rect")
            .data(function(d) { return vis.subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
            .enter().append("rect")
            .attr("x", function(d) { return vis.xSubgroup(d.key); })
            .attr("y", function(d) { return vis.y(d.value); })
            .attr("width", vis.xSubgroup.bandwidth())
            .attr("height", function(d) { return vis.height - vis.y(d.value); })
            .attr("fill", function(d) { return vis.color(d.key); });

        // TODO

    }
}

