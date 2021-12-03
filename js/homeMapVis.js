
/*
 *  HomePriceIndexMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

class HomeMapVis {

	/*
	 *  Constructor method
	 */
	constructor(parentElement, stateData, lotData) {
		this.parentElement = parentElement;
		this.stateData = stateData;
		this.lotData = lotData;
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

		// lat/lon bounds of continental US
		let long = [-130, -60]
		let lat = [26, 51]

		// Add X axis
		vis.x = d3.scaleLinear().domain(long).range([vis.margin.left, vis.width]);
		vis.x.clamp(true); // Keep Hawaii and Alaska close

		// Add Y axis
		vis.y = d3.scaleLinear().domain(lat).range([vis.height, vis.margin.top]);
		vis.y.clamp(true); // Keep Hawaii and Alaska close

		vis.dataType = "yard"

		let btn = d3.select("#lotButtonGroup")
		btn.on("click", (event) => {
			let e = document.querySelector("#lotButtonGroup > .btn:focus")
			vis.dataType = e.id
			vis.wrangleData()
		})

		let tempData = {}

		this.stateData.forEach(d => tempData[d.state] = d)
		this.lotData.forEach(d => {
			tempData[d.state].lot = +d.lot
			tempData[d.state].home = +d.home
			tempData[d.state].yard = +d.yard
		})

		vis.displayData = Object.keys(tempData).map(function(k){return tempData[k]});

		vis.contours = vis.svg.append("g")

		vis.states = vis.svg.append("g")
		vis.states
			.selectAll(".map-point")
			.data(vis.displayData)
			.enter()
			.append("circle")
			.attr("class", "map-point")
			.attr("cx", d => vis.x(d.longitude))
			.attr("cy", d => vis.y(d.latitude))
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
                             <p><span class="tooltip-emphasis">Yard:</span> ${(d.yard).toLocaleString()} sqft</p>
                             <p><span class="tooltip-emphasis">Home:</span> ${(d.home).toLocaleString()} sqft</p>
                             <p><span class="tooltip-emphasis">Lot:</span> ${(d.lot).toLocaleString()} sqft</p>
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

		// compute the density data
		const densityData = d3
			.contourDensity()
			.x(function (d) {
				return vis.x(d.longitude);
			}) // x and y = column name in .csv input data
			.y(function (d) {
				return vis.y(d.latitude);
			})
			.weight(d => {
				switch (vis.dataType) {
					case "yard":
						return d.yard;
					case "home":
						return d.home;
					case "lot":
						return d.lot;
				}
			})
			.size([vis.width, vis.height])
			.bandwidth(15)(
				// smaller = more precision in lines = more lines
				Object.values(vis.displayData)
			);

		const thresholds = densityData.map((r) => +r.value);
		let med = d3.median(thresholds)
		let mean = d3.mean(thresholds)
		let dev = d3.deviation(thresholds)
		let extents = [mean - dev, med, mean + dev]
		extents.sort((a, b) => a - b);

		const color = d3
			.scaleLinear()
			.domain(extents)
			.range(["#cfe0fd", "white", "#DCAAE3"])

		// Add the contour: several "path"
		vis.paths = vis.contours.selectAll(".cont").data(densityData)

		vis.paths
			.enter()
			.append("path")
			.attr("class", "cont")
			.attr("stroke", "#e3e3e3")
			.attr("stroke-opacity", 0.15)
			.attr("d", d3.geoPath())
			.attr("fill", (d) => color(d.value))

		vis.paths
			.merge(vis.paths)
			.attr("d", d3.geoPath())
			.attr("fill", (d) => color(d.value))

		vis.paths.exit()
			.remove()

	}
}

