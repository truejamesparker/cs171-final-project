
/*
 *  famousVis - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            --
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

		vis.margin = { top: 0, right: 40, bottom: 40, left: 20 };

		vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
		vis.height = 500 - vis.margin.top - vis.margin.bottom; //document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.top - vis.margin.bottom;

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

		vis.x = d3.scaleTime()
			.domain(d3.extent(vis.data, d => {return d.completed}))
			.range([0, vis.width])

		vis.xAxisGroup = vis.svg.append("g")
			.attr("class", "x-axis axis");



		vis.tooltip = d3.select("body").append('div')
			.attr('class', "tooltip")
			.attr('id', 'famousTooltip')

		vis.s = d3.scaleLinear()
			.range([10, Math.sqrt(5000)])
			.domain(d3.extent(vis.data, d => d.sqft))

		vis.wrangleData();
	}


	/*
	 *  Data wrangling
	 */
	wrangleData () {
		let vis = this;

		vis.displayData = vis.data

		// Update the visualization
		vis.updateVis();
	}

	updateVis() {
		let vis = this;

		function getRandomInt(min, max) {
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
		}

		vis.svg.selectAll(".home")
			.data(vis.displayData)
			.enter()
			.append("circle")
			.attr("fill", function(d) {
				if (d.sqft > 100000) {
					return "#DFAAFB"
				} else if (d.sqft > 90000) {
					return "#dbb7fc"
				}
			 	else if (d.sqft > 60000) {
					return "#d7c3fc"
				}
				else if (d.sqft > 40000) {
					return "#d3d1fc"
				}
				else {
					return "#cfe0fd"
				}
			})
			.attr("opacity", 0.6)
			.attr("cx", d => vis.x(d.completed))
			.attr("cy", (d,i) => d.sqft*0.0021)
			.attr("r", (d,i) => d.sqft*0.00015)
			.on('mouseover', function(event, d){
				d3.select(this)
					.attr('stroke-width', '2px')
					.attr('stroke', 'black')
					.attr("opacity", 1)
				vis.tooltip
					.style("opacity", 1)
					.style("left", event.pageX + 20 + "px")
					.style("top", event.pageY + "px")
					.html(`
         <div>
             <p><span class="tooltip-emphasis">Name:</span> ${d.name}</p>                
             <p><span class="tooltip-emphasis">Square Feet:</span> ${d.sqft}</p>   
             <p><span class="tooltip-emphasis">Architect:</span> ${d.architect}</p>   
             <p><span class="tooltip-emphasis">Built For:</span> ${d.builtfor}</p>   
		     <p><span class="tooltip-emphasis">Current Owner:</span> ${d.owner}</p>     
		     <p><span class="tooltip-emphasis">Rank:</span> ${d.rank}</p>  
			 <img src="${d.image}">

                      
         </div>`);
			})
			.on('mouseout', function(event, d){
				d3.select(this)
					.attr('stroke-width', '0px')
					.attr('opacity', 0.6)

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
			.attr("transform", "translate(" + vis.margin.left + ",470)")
			.style("stroke-width", 2)
			.transition()
			.call(vis.xAxis);


	}
}

