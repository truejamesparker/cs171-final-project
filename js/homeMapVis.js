
/*
 *  HomePriceIndexMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

class HomeMapVis {

	/*
	 *  Constructor method
	 */
	constructor(parentElement, data) {
		this.parentElement = parentElement;
		this.data = data;
		this.displayData = null;

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
		vis.height = 500 - vis.margin.top - vis.margin.bottom; //document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.top - vis.margin.bottom;

		// SVG drawing area
		vis.svg = d3.select("#" + vis.parentElement).append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
			.append("g")
			.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

		vis.tooltip = d3.select("body").append('div')
			.attr('id', 'interTooltip')
			.attr('class', 'tooltip')

		vis.wrangleData();
	}


	/*
	 *  Data wrangling
	 */
	wrangleData () {
		let vis = this;

		// TODO

		this.displayData = this.data;

		// Update the visualization
		vis.updateVis();
	}

	updateVis() {
		let vis = this;

		const data = [
			{ x: 3.4, y: 4.2 },
			{ x: -0.1, y: 4.2 },
			{ x: 3.8, y: 2.8 },
			{ x: 3.6, y: 4.3 },
			{ x: -0.1, y: 3.7 },
			{ x: 4.7, y: 2.5 },
			{ x: 0.8, y: 3.6 },
			{ x: 4.7, y: 3.7 },
			{ x: -0.4, y: 4.2 },
			{ x: 0.1, y: 2.2 },
			{ x: 0.5, y: 3 },
			{ x: 4.3, y: 4.5 },
			{ x: 3.4, y: 2.7 },
			{ x: 4.4, y: 3.6 },
			{ x: 3.3, y: 0.6 },
			{ x: 3, y: 3.4 },
			{ x: 4.7, y: 0 },
			{ x: -0.7, y: 2.7 },
			{ x: 2.6, y: 2 },
			{ x: 0, y: -1 },
			{ x: 3.4, y: 4.5 },
			{ x: 3.9, y: 4.6 },
			{ x: 0.7, y: 3.9 },
			{ x: 3, y: 0.2 }
		];

		// let lat = d3.extent(vis.displayData.map(d => d.latitude))
		// let long = d3.extent(vis.displayData.map(d => d.longitude))
		let long = [-130, -60]
		let lat = [26, 51]

		// Add X axis
		const x = d3.scaleLinear().domain(long).range([vis.margin.left, vis.width]);
		x.clamp(true);
		// Add Y axis
		const y = d3.scaleLinear().domain(lat).range([vis.height, vis.margin.top]);
		y.clamp(true);

		// compute the density data
		const densityData = d3
			.contourDensity()
			.x(function (d) {
				return x(d.longitude);
			}) // x and y = column name in .csv input data
			.y(function (d) {
				return y(d.latitude);
			})
			.weight(() => Math.random() * (300 - 100) + 10)
			.size([vis.width, vis.height])
			.bandwidth(15)(
				// smaller = more precision in lines = more lines
				Object.values(vis.displayData)
			);

		const thresholds = densityData.map((r) => r.value);
		// let extents = d3.extent(thresholds);
		let extents = [0.2, 0.03, 0.06];
		extents.push(d3.median(thresholds));
		const color = d3
			.scaleLinear()
			.domain(extents.sort())
			.range(["#DEE0FE", "white", "#DCAAE3"])
			// .interpolate(d => {return interpolateRgb("#4f74b7", "red")})
		// .interpolate(d3.interpolateHcl)

		// Add the contour: several "path"
		vis.svg
			.selectAll("path")
			.data(densityData)
			.enter()
			.append("path")
			.attr("d", d3.geoPath())
			.attr("fill", (d) => color(d.value))
			.attr("stroke", "#e3e3e3")
			// .attr("stroke-linejoin", "round")
			.attr("stroke-opacity", 0.15);

		vis.svg
			.selectAll(".map-point")
			.data(vis.displayData)
			.enter()
			.append("circle")
			.attr("class", "map-point")
			.attr("cx", d => x(d.longitude))
			.attr("cy", d => y(d.latitude))
			.attr("r", 3)
			.on('mouseover', function(event, d) {
				d3.select(this)
				vis.tooltip
					.style("opacity", 1)
					.style("left", event.pageX + 20 + "px")
					.style("top", event.pageY + "px")
					.html(`
                         <div>
                         	<div></div>
                             <p><span class="tooltip-emphasis">State:</span> ${d.state}</p>
                         </div>`);
			})
			.on('mouseout', function (event, d) {
				d3.select(this)
				vis.tooltip
					.style("opacity", 0)
					.style("left", 0)
					.style("top", 0)
					.html(``);

			})
	}
}

