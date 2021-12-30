
/*
 *  rentOwnVis - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data
 */

class RentOwnVis {

    /*
     *  Constructor method
     */
    constructor(parentElement, data, type) {
        this.parentElement = parentElement;
        this.data = data;
        this.displayData = null;
        this.type = type;
        this.initVis();

    }


    /*
     *  Initialize vis
     */
    initVis () {
        let vis = this;

        if (vis.type === 'years') {
            vis.cols = vis.data.columns
            vis.displayData = vis.data.filter(d=>d.group === 'Current Job Tenure' || d.group === 'Work Experience')
            vis.displayData.push(vis.cols)
        }
        if (vis.type === 'family') {
            vis.cols = vis.data.columns
            vis.displayData = vis.data.filter(d=>d.group === 'Two Adults in Household' || d.group === 'Child in Household')
            vis.displayData.push(vis.cols)

        }
        if (vis.type === 'ages') {
            vis.cols = vis.data.columns
            vis.displayData = vis.data.filter(d=>d.group != 'Two Adults in Household' && d.group != 'Child in Household'&& d.group != 'Work Experience' && d.group != 'Current Job Tenure')
            vis.displayData.push(vis.cols)

        }


        vis.margin = { top: 40, right: 20, bottom: 60, left: 90 };
        vis.width = 600 - vis.margin.left - vis.margin.right,
            vis.height = 400 - vis.margin.top - vis.margin.bottom;
        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.subgroups = vis.data.columns.slice(1)
        vis.displayData = vis.displayData.slice(0, -1)

        // List of groups = species here = value of the first column called group -> I show them on the X axis
        vis.groups = d3.map(vis.displayData, function(d){return(d['group'])})

        // Add X axis
        vis.x = d3.scaleBand()
            .domain(vis.groups)
            .range([0, vis.width])
            .padding([0.2])
        vis.svg.append("g")
            .attr("transform", "translate(0," + vis.height + ")")
            .call(d3.axisBottom(vis.x).tickSize(0));
        vis.formatPercent = d3.format(".0%");

        // Add Y axis
        if (vis.type === 'years') {
            vis.y = d3.scaleLinear()
                .domain([0, 20])
                .range([vis.height, 0]);
        } else if (vis.type == 'family') {
            vis.y = d3.scaleLinear()
                .domain([0, 1])
                .range([vis.height, 0]);
        } else {
            vis.y = d3.scaleLinear()
                .domain([0, 0.4])
                .range([vis.height, 0]);
        }

        if (vis.type === 'years') {
            vis.svg.append("g")
                .call(d3.axisLeft(vis.y))
                .attr("transform", "translate(5, 0)");
        }
        else {
            vis.svg.append("g")
                .call(d3.axisLeft(vis.y).tickFormat(vis.formatPercent))
                .attr("transform", "translate(14, 0)");

        }


        // Another scale for subgroup position?
        vis.xSubgroup = d3.scaleBand()
            .domain(vis.subgroups)
            .range([0, vis.x.bandwidth()])
            .padding([0.05])

        // color palette = one color per subgroup
        vis.color = d3.scaleOrdinal()
            .domain(vis.subgroups)
            .range(['#E9C4FD','#EAF3FF'])

        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'jobstooltip')

        vis.wrangleData();
    }


    /*
     *  Data wrangling
     */
    wrangleData () {
        let vis = this;

        // Update the visualization
        vis.updateVis();
    }

    updateVis() {
        let vis = this;


        vis.svg.append("g")
            .selectAll("g")
            // Enter in data = loop group per group
            .data(vis.displayData)
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

        vis.yLabel = vis.svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("x", -110)
            .attr("y", -70)
            .attr("dy", "0.5em")
            .attr("transform", "rotate(-90)")
            .text(function(d) {
                if (vis.type === 'years') {
                    return "Number of Years";
                }
                else if (vis.type === 'family') {
                    return "Percentage (%)";
                } else if (vis.type == "ages") {
                    return "Percentage (%)";
                }
            });

        vis.xLabel = vis.svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", 320)
            .attr("y", 345)
            .attr("dy", "0.5em")
            .text(function(d) {
                if (vis.type === 'years') {
                    return "";
                }
                else if (vis.type === 'family') {
                    return "";
                } else if (vis.type == "ages") {
                    return "Age Group (in years)";
                }
            });

        vis.svg.selectAll("rect").on('mouseover', function(event, d) {


            d3.select(this)
                .attr('stroke-width', '3px')
                .attr('stroke', 'lightgrey')
                .attr('opacity', 0.7)

            vis.tooltipstring = roundToTwo(d.value * 100) + "%"
            if (vis.type === 'years') {
                vis.tooltipstring = d.value + " years"
            }
            vis.tooltip
                .style("opacity", 1)
                .style("left", event.pageX + 20 + "px")
                .style("top", event.pageY + "px")
                .html(`
                         <div>
                 
                             <p id="social-demo-tooltip-label"><span class="tooltip-emphasis">${toTitleCase(d.key)}</span>: ${vis.tooltipstring}</p>                                                        
                           
 
                         </div>`);
        })
            .on('mouseout', function (event, d) {
                d3.select(this)
                    .attr('stroke-width', '0px')
                    .attr("opacity", 1)
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);

            })

    }
}

