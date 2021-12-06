class StateMovement_pieChart {

    constructor(parentElement, data, state) {
        this.parentElement = parentElement;
        this.circleColors = ['#E0A9FB', '#E9E4FE'];
        this.data = data;
        this.state = state;

        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 10, right: 50, bottom: 10, left: 50};
        vis.width = 100;
        vis.height = 100;

        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.svg.append('g')
            .attr('class', 'title pie-title')
            .append('text')
            .attr('transform', `translate(${vis.width / 2}, 20)`)
            .attr('text-anchor', 'middle');

        vis.color = d3.scaleOrdinal(['#b2182b', '#d6604d', '#f4a582', '#fddbc7']);

        vis.pieChartGroup = vis.svg
            .append('g')
            .attr('class', 'pie-chart')
            .attr("transform", "translate(" + vis.width / 2 + "," + vis.height / 2 + ")");

        vis.outerRadius = vis.width / 2.8;
        vis.innerRadius = 0;

        vis.pie = d3.pie()
            .value(d => d.value);


        vis.arc = d3.arc()
            .innerRadius(vis.innerRadius)
            .outerRadius(vis.outerRadius);

        this.wrangleData();
    }

    wrangleData() {
        let vis = this

        vis.displayData = []

        vis.data.forEach(function(state, index) {
            if (state.StateName == vis.state) {
                vis.displayData.push({
                    type: "Inbound",
                    state: state.StateName,
                    value: state.Inbound_Shipments,
                    rel: state.Inbound_Percent,
                    color: vis.circleColors[0]
                })
                vis.displayData.push({
                    type: "Outbound",
                    state: state.StateName,
                    value: state.Outbound_Shipments,
                    rel: state.Outbound_Percent,
                    color: vis.circleColors[1]
                })
            }
        })

        vis.updateVis()

    }

    updateVis() {
        let vis = this;

        vis.arcs = vis.pieChartGroup.selectAll(".arc")
            .data(vis.pie(vis.displayData))

        vis.arcs.enter()
            .append("path")
            .attr("d", vis.arc)
            .style("fill", function(d, index) {
                return d.data.color;
            })

    }
}