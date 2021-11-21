
/*
 *  StationMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

class FamousVis {

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
		vis.height = 300 - vis.margin.top - vis.margin.bottom; //document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.top - vis.margin.bottom;

		// SVG drawing area
		vis.svg = d3.select("#" + vis.parentElement).append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
			.append("g")
			.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

		vis.data.forEach(d => {
			d.completed = yearParser(d.completed)
			d.sqft = +d.sqft
		})

		console.log(vis.data)

		vis.x = d3.scaleTime()
			.domain(d3.extent(vis.data, d => {return d.completed}))
			.range([0, vis.width])


		vis.s = d3.scaleLinear()
			.range([0, Math.sqrt(5000)])
			.domain(d3.extent(vis.data, d => d.sqft))

		vis.wrangleData();
	}


	/*
	 *  Data wrangling
	 */
	wrangleData () {
		let vis = this;

		// TODO

		vis.displayData = vis.data;

		// Update the visualization
		vis.updateVis();
	}

	updateVis() {
		let vis = this;

		console.log(vis.displayData)

		// TODO
		vis.svg.selectAll(".home")
			.data(vis.displayData)
			.enter()
			.append("svg:image")
			.attr("class", "home")
			.attr("xlink:href", "img/mansion.svg")
			.attr("x", d => vis.x(d.completed))
			.attr("y", (d,i) => 50)
			.attr("width", d => vis.s(d.sqft))
			.attr("height", d => vis.s(d.sqft))


	}
}

