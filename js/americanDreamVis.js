
class AmericanDreamVis {

    /*
     *  Constructor method
     */
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.displayData = data;
        this.initVis();
    }


    /*
     *  Initialize vis
     */
    initVis () {
        let vis = this;

        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'dreamTooltip')

        vis.margin = { top: 40, right: 20, bottom: 40, left: 20 };

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.x = d3.scaleBand()
            .rangeRound([0, vis.width])
            .paddingInner(0.1);
        vis.y = d3.scaleLinear()
            .domain([0, 100])
            // .domain([100, 0])
            .range([vis.height * 0.3, vis.height]);

        vis.svg.append("rect")
            .attr("x", vis.width/4)
            .attr("y", 0)
            .attr("width", 15 * 17)
            .attr("height", vis.height* 0.3)
            .attr("fill", "url(#blueFieldGradient)");

        for (let i = 0; i < 10; i++) {
            vis.svg.append("path")
                .attr("d", d3.symbol().type(d3.symbolStar).size(100))
                .attr("transform", "translate("+ ((vis.width/2+vis.margin.left/2)-(i*20) + 58)+ "," + vis.height*0.22+")")
                .attr("fill", "white")
        }

        for (let i = 0; i < 10; i++) {
            vis.svg.append("path")
                .attr("d", d3.symbol().type(d3.symbolStar).size(100))
                .attr("transform", "translate("+ ((vis.width/2+vis.margin.left/2)-(i*20) + 58)+ "," + vis.height*0.18+")")
                .attr("fill", "white")
        }


        for (let i = 0; i < 10; i++) {
            vis.svg.append("path")
                .attr("d", d3.symbol().type(d3.symbolStar).size(100))
                .attr("transform", "translate("+ ((vis.width/2+vis.margin.left/2)-(i*20) + 58)+ "," + vis.height*0.14+")")
                .attr("fill", "white")
        }

        for (let i = 0; i < 10; i++) {
            vis.svg.append("path")
                .attr("d", d3.symbol().type(d3.symbolStar).size(100))
                .attr("transform", "translate("+ ((vis.width/2+vis.margin.left/2)-(i*20) + 58)+ "," + vis.height*0.1+")")
                .attr("fill", "white")
        }

        for (let i = 0; i < 10; i++) {
            vis.svg.append("path")
                .attr("d", d3.symbol().type(d3.symbolStar).size(100))
                .attr("transform", "translate("+ ((vis.width/2+vis.margin.left/2)-(i*20) + 58)+ "," + vis.height*0.06+")")
                .attr("fill", "white")
        }

        vis.xAxisGroup = vis.svg.append("g")
            .attr("class", "x-axis axis");
        vis.yAxisGroup = vis.svg.append("g")
            .attr("class", "y-axis axis");

        vis.wrangleData();
    }


    /*
     *  Data wrangling
     */
    wrangleData () {
        let vis = this;

        // TODO

        vis.displayData = vis.data;
        vis.bars = vis.svg.selectAll(".stripe")
            .data(vis.displayData,d=>d)
        vis.bars.enter().append("rect")
            .attr("class", "stripe")
            .attr("x", (d,i)=> i * 30+vis.width/4)
            .attr("y", vis.height * 0.3)
            .attr("width", 15)
            // .attr("height", d=> vis.y(100 - d.Percent))
            .attr("height", d=> vis.y(d.Percent - 42))
            // .attr("fill", "#B22234")
            .attr("fill", "url(#stripeGradient)")
            .on('mouseover', function(event, d){
                d3.select(this)
                    .attr('fill', "url(#stripeGradientSelected)");
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                         <div>
                             <p>In<span class="tooltip-emphasis"> ${d.Year}</span>, a reported<span class="tooltip-emphasis"> ${d.Percent}%</span> of surveyed Americans associated home ownership with the American dream.</p>
                         </div>`);
            })
            .on('mouseout', function(event, d){
                d3.select(this)
                    .attr("fill", "url(#stripeGradient)")

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            });


        // Update the visualization
        vis.updateVis();
    }

    updateVis() {




        let vis = this;

        vis.xScale = d3.scaleOrdinal()
            .domain(vis.data.map(d=>d.Year))
            .range(vis.data.map((d,i)=>i*30+vis.width/4-12))
        vis.xAxis = d3.axisBottom()
            .scale(vis.xScale)
        vis.yAxis = d3.axisLeft()
            .scale(vis.y)

        vis.svg.select(".x-axis")
            .attr("transform", "translate(" + vis.margin.left + "," + (vis.height) + ")")
            .style("stroke-width", 2)
            .transition()
            .call(vis.xAxis);

        vis.svg.select(".y-axis")
            .attr("transform", "translate(" + (vis.width/4-vis.margin.left ) + ",0)")
            .style("stroke-width", 2)
            .transition()
            .call(vis.yAxis);


    }
}
