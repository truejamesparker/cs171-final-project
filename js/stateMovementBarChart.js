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
				"translate(" + vis.margin.left + "," + vis.margin.top + ")")

		vis.x = d3.scaleBand()
			.range([ 0, vis.width])
			.domain(vis.data.map(function(d) { return d.StateName; }))
			.padding(0.2);

		vis.svg.append("g")
			.attr("transform", "translate(0," + vis.height + ")")
			.call(d3.axisBottom(vis.x))
			.selectAll("text")
			.attr("transform", "translate(-10,0)rotate(-45)")
			.style("text-anchor", "end");

		vis.tooltip = d3.select("body").append('div')
			.attr('class', "tooltip")
			.attr('id', 'barTooltip')

		vis.wrangleData();
	}

	wrangleData() {
		let vis = this;

		// Update the visualization
		vis.updateVis();
	}

	updateVis() {
		let vis = this;

		vis.yLabel = vis.svg.append("text")
			.attr("class", "y label")
			.attr("text-anchor", "end")
			.attr("x", -20)
			.attr("y", -70)
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


		vis.colorGradient = d3.scaleSequential()
			.interpolator(d3.interpolate("#EBF3FF", "#DFAAFB"));

		vis.colorGradient.domain([domain_min+5, domain_max]);


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

		vis.svg.selectAll("rect").on('mouseover', function(event, d) {


			d3.select(this)
				.attr('stroke-width', '3px')
				.attr('stroke', 'lightgrey')
				.attr('opacity', 0.7)



			vis.tooltip
				.style("opacity", 1)
				.style("left", event.pageX + 20 + "px")
				.style("top", event.pageY + "px")
				.html(`
                         <div>
                             <p class="first-text"><span class="tooltip-emphasis">State:</span> ${d.StateName}</p>
                             <p><span class="tooltip-emphasis">Total Shipments:</span> ${d.Total_Shipments}</p>                 
                             <p><span class="tooltip-emphasis">Inbound Shipments:</span> ${d.Inbound_Shipments}</p>                                              
                             <p><span class="tooltip-emphasis">Outbound Shipments:</span> ${d.Outbound_Shipments}</p> 
                             <p><span class="tooltip-emphasis">Inbound Percent:</span> ${d.Inbound_Percent}%</p>                                              
                             <p><span class="tooltip-emphasis">Outbound Percent:</span> ${d.Outbound_Percent}%</p>  
                             <div id="pieDivRight"></div>   
                             <div class="row" id="statePieGraphContainer">
                             	<div class="col-md-2">
                             		<div class="statePieGraphRectangle" style="background:#E0A9FB"></div>
								 	<div class="statePieGraphRectangle" style="background:#E9E4FE"></div>   
								</div>
								<div class="col-md-10">
									<span>inbound<br></span>    
									<span>outbound</span>
								</div>
							</div>                         
                         </div>`);

			pieChart = new StateMovement_pieChart("pieDivRight", vis.data, d.StateName);

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
