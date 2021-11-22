/*
 * StateMovementBarChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the bar charts
 * @param _data						-- the dataset
 */


class StateMovementBarChart {

	constructor(parentElement, data, type) {
		this.parentElement = parentElement;
		this.data = data;
		this.type = type;

		this.initVis();
	}

	initVis() {
		let vis = this;

		vis.margin = {top: 20, right: 30, bottom: 70, left: 90},
			vis.width = 600 - vis.margin.left - vis.margin.right,
			vis.height = 400 - vis.margin.top - vis.margin.bottom;

		vis.svg = d3.select(vis.parentElement)
			.append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
			.append("g")
			.attr("transform",
				"translate(" + vis.margin.left + "," + vis.margin.top + ")");

		vis.x = d3.scaleBand()
			.range([ 0, vis.width ])
			.domain(vis.data.map(function(d) { return d.StateName; }))
			.padding(0.2);

		vis.svg.append("g")
			.attr("transform", "translate(0," + vis.height + ")")
			.call(d3.axisBottom(vis.x))
			.selectAll("text")
			.attr("transform", "translate(-10,0)rotate(-45)")
			.style("text-anchor", "end");

		vis.colorGradient = d3.scaleSequential()
			.interpolator(d3.interpolate("#EBF3FF", "#DFAAFB"));

		vis.colorGradient.domain([60, 70]);


		vis.wrangleData();
	}

	wrangleData() {
		let vis = this;

		// Update the visualization
		vis.updateVis();
	}

	updateVis() {
		let vis = this;

		/*vis.title = vis.svg.append('g')
			.attr('class', 'title bar-title')
			.append('text')
			.text(function(d) {
				if (vis.type == "inbound") {
					return "Top 10 States by Percentage of Inbound Shipments"
				} else if (vis.type == "outbound") {
					return "Top 10 States by Percentage of Outbound Shipments"
				}
			})
			.attr('transform', `translate(${vis.width / 2}, -25)`)
			.attr('text-anchor', 'middle');*/

		vis.yLabel = vis.svg.append("text")
			.attr("class", "y label")
			.attr("text-anchor", "end")
			.attr("x", 0)
			.attr("y", -60)
			.attr("dy", "0.5em")
			.attr("transform", "rotate(-90)")
			.text(function(d) {
				if (vis.type == "inbound") {
					return "Percentage of Shipments Inbound (%)";
				}
				else if (vis.type == "outbound") {
					return "Percentage of Shipments Outbound (%)";
				}
			});

		let domain_min;
		let domain_max;

		if (vis.type == "inbound") {
			domain_min = 55;
			domain_max = 70;
		} else if (vis.type == "outbound") {
			domain_min = 50;
			domain_max = 70;
		}

		vis.y = d3.scaleLinear()
			.domain([domain_min, domain_max])
			.range([ vis.height, 0]);
		vis.svg.append("g")
			.call(d3.axisLeft(vis.y));

		vis.svg.selectAll("mybar")
			.data(vis.data)
			.enter()
			.append("rect")
			.attr("x", function(d) { return vis.x(d.StateName); })
			.attr("y", function(d) {
				if (vis.type == "inbound") {
					return vis.y(d.Inbound_Percent);
				} else if (vis.type == "outbound") {
					return vis.y(d.Outbound_Percent);
				}

			})
			.attr("width", vis.x.bandwidth())
			.attr("height", function(d) {
				if (vis.type == "inbound") {
					return vis.height - vis.y(d.Inbound_Percent);
				} else if (vis.type == "outbound") {
					return vis.height - vis.y(d.Outbound_Percent);
				}
			})
			.attr("fill", function(d) {
				if (vis.type == "inbound") {
					return vis.colorGradient(d.Inbound_Percent)
				} else if (vis.type == "outbound") {
					return vis.colorGradient(d.Outbound_Percent)
				}
			});

	}


}
