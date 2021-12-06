
/*
 *  HomeMap- Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            --
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

		vis.margin = { top: 40, right: 30, bottom: 40, left: 30 };

		vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
		vis.height = 300 - vis.margin.top - vis.margin.bottom; //document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.top - vis.margin.bottom;

		// SVG drawing area
		vis.svg = d3.select("#" + vis.parentElement).append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
			.append("g")
			.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

		vis.tooltip = d3.select("body").append('div')
			.attr('id', 'interTooltip')
			.attr('class', 'tooltip')

		vis.projection = d3.geoAlbersUsa()
			.translate([vis.width / 2, vis.height / 2])
			.scale(600);

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

		vis.pp = d3.geoPath()
			.projection(vis.projection);

		vis.states = vis.svg.append("g")
		vis.states
			.selectAll(".map-point")
			.data(vis.displayData)
			.enter()
			.append("circle")
			.attr("class", "map-point")
			.attr("cx", d => vis.projection([d.longitude, d.latitude])[0])
			.attr("cy", d => vis.projection([d.longitude, d.latitude])[1])
			// .attr("transform", d => `translate(${vis.projection([d.longitude,d.latitude])})`)
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

		// SVG drawing area
		vis.svgLots = d3.select("#" + vis.parentElement).append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
			.append("g")
			.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

		vis.loty = d3.scaleLinear()
			.domain([0, 4])
			.range([vis.margin.top, vis.height]);

		vis.lotx = d3.scaleLinear()
			.domain([0, 9])
			.range([vis.margin.left, vis.width]);

		vis.lot2width = d3.scaleSqrt()
			.domain([0, d3.max(vis.displayData.map(d => d[vis.dataType]))])
			.range([0, vis.width/30])

		vis.wrangleData();
	}


	/*
	 *  Data wrangling
	 */
	wrangleData () {
		let vis = this;

		vis.displayData.sort((a,b) => a[vis.dataType] - b[vis.dataType])

		// Update the visualization
		vis.updateVis();
	}

	updateVis() {
		let vis = this;

		// compute the density data
		const densityData = d3.contourDensity()
			.x(d => vis.projection([d.longitude, d.latitude])[0]) // x and y = column name in .csv input data
			.y(d => vis.projection([d.longitude, d.latitude])[1])
			.weight(d => d[vis.dataType])
			.size([vis.width, vis.height])
			.bandwidth(15)(
				Object.values(vis.displayData)
			);

		const thresholds = densityData.map((r) => +r.value);
		let tmean = d3.mean(thresholds)
		let tmin = d3.min(thresholds)
		let tmax = d3.max(thresholds)
		let extents = [tmin, tmean, tmax]

		const color = d3
			.scaleLinear()
			.domain(extents)
			.range(["#cfe0fd", "white", "#DFAAFBFF"])

		// Add the contour: several "path"
		vis.paths = vis.contours.selectAll(".cont").data(densityData)

		vis.paths
			.enter()
			.append("path")
			.attr("class", "cont")
			.attr("stroke", "#ffffff")
			.attr("stroke-opacity", 0.25)
			.attr("d", d3.geoPath())
			.attr("fill", (d) => color(d.value))

		vis.paths
			.merge(vis.paths)
			.attr("d", d3.geoPath())
			.attr("fill", (d) => color(d.value))

		vis.paths.exit()
			.remove()

		vis.labels = vis.svgLots.selectAll(".state-label")
			.data(vis.displayData)

		vis.labels
			.enter()
			.append("text")
			.attr("class", "state-label")
			.text(d => d.state)
			.attr("x", (d,i) => vis.lotx(i % 10))
			.attr("y", (d,i) => vis.loty(Math.floor(i/10)) - 10)

		vis.labels
			.merge(vis.labels)
			.text(d => d.state)

		vis.lots = vis.svgLots.selectAll(".lot")
			.data(vis.displayData)

		vis.lots
			.enter()
			.append("rect")
			.attr("class", "lot")
			.attr("x", (d,i) => vis.lotx(i % 10) - vis.lot2width(d.lot)/2)
			.attr("y", (d,i) => vis.loty(Math.floor(i/10)))
			.attr("width", d => vis.lot2width(d[vis.dataType]))
			.attr("height", d => vis.lot2width(d[vis.dataType]))
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

		let max = d3.max(vis.displayData.map(d => d[vis.dataType]))
		vis.lot2width.domain([0, max])

		vis.lots
			.merge(vis.lots)
			.transition()
			.duration(1000)
			.attr("x", (d,i) => vis.lotx(i % 10) - vis.lot2width(d[vis.dataType])/2)
			.attr("y", (d,i) => vis.loty(Math.floor(i/10)))
			.attr("width", d => vis.lot2width(d[vis.dataType]))
			.attr("height", d => vis.lot2width(d[vis.dataType]))

	}
}

