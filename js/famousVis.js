
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
			d.rank = +d.rank
		})

		console.log(vis.data)

		vis.x = d3.scaleTime()
			.domain(d3.extent(vis.data, d => {return d.completed}))
			.range([0, vis.width])

		vis.xAxisGroup = vis.svg.append("g")
			.attr("class", "x-axis axis");



		vis.tooltip = d3.select("body").append('div')
			.attr('class', "tooltip")
			.attr('id', 'famousTooltip')

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
		vis.displayData = vis.data

		// Update the visualization
		vis.updateVis();
	}

	updateVis() {
		let vis = this;

		console.log(vis.displayData)

		function getRandomInt(min, max) {
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
		}

		// TODO
		vis.svg.selectAll(".home")
			.data(vis.displayData)
			.enter()
			.append("svg:image")
			.attr("class", function(d) {
				let randomNumber = getRandomInt(0, 4);
				if (randomNumber == 1) {
					return "home"
				} else if (randomNumber == 2) {
					return "home-2"
				} else if (randomNumber == 3) {
					return "home-3"
				} else {
					return "home-4"
				}
			})
			.attr("xlink:href", "img/mansion.svg")
			.attr("x", d => vis.x(d.completed))
			.attr("y", (d,i) => 50)
			.attr("width", d => vis.s(d.sqft))
			.attr("height", d => vis.s(d.sqft))
			.on('mouseover', function(event, d){
				d3.select(this)
					.attr('stroke-width', '2px')
					.attr('stroke', 'black')
					.attr('fill', 'rgba(173,222,255,0.62)');
				vis.tooltip
					.style("opacity", 1)
					.style("left", event.pageX + 20 + "px")
					.style("top", event.pageY + "px")
					.html(`
         <div style="border: thin solid grey; border-radius: 5px; background: white; padding: 20px">
             <a href="https://en.wikipedia.org/wiki/${d.name.split(' ').join('_')}">${d.name}</a>      
             <h6>${d.sqft} square feet</h6>                    
         </div>`);
			})
			.on('mouseout', function(event, d){
				d3.select(this)
					.attr('stroke-width', '0px')
					.attr("fill", "#B22234")

				vis.tooltip
					.style("opacity", 0)
					.style("left", 0)
					.style("top", 0)
					.html(``);
			});

		vis.xAxis = d3.axisBottom()
			.scale(vis.x)
		vis.yAxis = d3.axisLeft()
			.scale(vis.y)

		vis.svg.select(".x-axis")
			.attr("transform", "translate(" + vis.margin.left + ",118)")
			.style("stroke-width", 2)
			.transition()
			.call(vis.xAxis);


	}
}

