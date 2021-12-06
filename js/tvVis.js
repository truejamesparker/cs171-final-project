
/*
 *  tvVis - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

class TvVis {

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

		vis.margin = { top: 20, right: 20, bottom: 0, left: 20 };

		vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
		vis.height = 300 - vis.margin.top - vis.margin.bottom; //document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.top - vis.margin.bottom;

		// SVG drawing area
		vis.svg = d3.select("#" + vis.parentElement).append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
			.append("g")
			.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

		var defs = vis.svg.append("defs")

		vis.colors = ["#cfe0fe", "#ebf2ff", "#ebf2ff", "#dfabfb"]

		defs.selectAll(".show-photo")
			.data(vis.data.filter(d => d.photo != null))
			.enter()
			.append("pattern")
			.attr("class", "show-photo")
			.attr("id", d => d.id)
			.attr("height", "100%")
			.attr("width", "100%")
			.attr("patternContentUnits", "objectBoundingBox")
			.append("image")
			.attr("height", 1)
			.attr("width", 1)
			.attr("preserveAspectRatio", "none")
			.attr("xmlns:xlink", "http://w3.org/1999/xlink")
			.attr("xlink:href", d => d.photo)



		vis.data.forEach(d => d["year"] = yearParser(d["year"]))

		vis.timeScale = d3.scaleTime()
			.domain(d3.extent(vis.data, d => {return d.year}))
			.range([vis.margin.left, vis.width - vis.margin.right])

		vis.radiusScale = d3.scaleSqrt()
			.domain(d3.extent(vis.data, d => {return d.episodes}))
			.range([5, 5]);

		vis.colorScale = d3.scaleLinear()
			.range(["#cfe0fe", "#dfabfb"])

		vis.selectedTime = null;

		vis.bmargin = { top: 0, bottom: 20 }
		vis.bheight = 100 - vis.margin.top - vis.bmargin.bottom

		vis.brush = d3.brushX()
			.extent([[vis.margin.left,0], [vis.width - vis.margin.right, vis.bheight]])
			.on("brush", function (event) {
				vis.selectedTime = event.selection.map(vis.timeScale.invert)
				vis.wrangleData();
			})

		vis.timelineSvg = d3.select("#" + vis.parentElement).append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.bheight + vis.bmargin.bottom + vis.bmargin.top)
			.append("g")
			.attr("transform", `translate(${vis.margin.left}, ${vis.bmargin.top})`)

		/* vis.svg.append("text")
			.attr("x", (vis.width / 2))
			.attr("y", 10 - (vis.margin.top / 2))
			.attr("class", "visualization-title")
			.attr("text-anchor", "middle")
			.style("font-size", "16px")
			.text("Housing TV Show Popularity vs. Time");

		 */

		vis.legend = d3.legendColor()
			.labelFormat(".0f")
			.scale(vis.colorScale)

		vis.legend.title("# TV episodes")



		vis.legendGroup = vis.svg.append("g")
			.attr("transform", `translate(${vis.margin.left},${0})`)

		vis.timelineSvg
			.append("g")
			.attr("class", "x brush")
			.call(vis.brush)

		vis.xAxis = d3.axisBottom()
			.scale(vis.timeScale)

		vis.timelineSvg
			.append('g')
			.attr("transform", `translate(0,${vis.bheight})`)
			.attr("class", "x x-axis")
			.call(vis.xAxis)

		vis.simulation = d3.forceSimulation()
			// .force('charge', d3.forceManyBody().strength(0.25))
			// .force('center', d3.forceCenter(vis.width / 2, vis.height / 2))
			.force('y', d3.forceY().y(vis.height).strength(5))
			.force('collision', d3.forceCollide(5))
			// .force('collision', d3.forceCollide().radius(d => vis.radiusScale(d.episodes)))

		vis.tooltip = d3.select("body").append('div')
			.attr('class', "tooltip")
			.attr('id', 'tvTooltip')

		vis.wrangleData();
	}


	/*
	 *  Data wrangling
	 */
	wrangleData () {
		let vis = this;

		if (vis.selectedTime) {
			vis.displayData = this.data.filter(d => d.year > vis.selectedTime[0] && d.year < vis.selectedTime[1])
		} else {
			vis.displayData = vis.data
		}

		// Update the visualization
		vis.updateVis();
	}

	updateVis() {
		let vis = this;

		// vis.radiusScale.domain([0, d3.max(vis.displayData, d => {return d.episodes})])

        let shows = vis.svg.selectAll(".show").data(vis.displayData, d => d.id);

		shows.exit()
			.remove()

		vis.colorScale.domain([0,100])
		vis.colorScale.clamp(true)
		vis.legendGroup.call(vis.legend)

		let newCircles = shows
            .enter()
            .append("circle")
            .attr("class", "show")
            .attr("fill", d => vis.colorScale(d.episodes))
			.attr("r", d => vis.radiusScale(d.episodes))
            .attr("cx", vis.width/2)
            .attr("cy", vis.height/2)
			.on('mousedown', function(event, d) {
				event.target.setAttribute("defaultFill", event.target.getAttribute("fill"))
				d3.select(this)
					.attr("fill", function(d) { return `url(#${d.id})`; })
			})
			.on('mouseup', function(event, d) {
				d3.select(this).attr("fill", event.target.getAttribute("defaultFill"))
			})

		let allCircles = shows
			.merge(newCircles)
			// .attr("r", d => vis.radiusScale(d.episodes));

        function tick() {
			allCircles
                .attr("cx", function(d) {return d.x})
                .attr("cy", function(d) {return d.y})
        }

        vis.simulation
			.nodes(vis.displayData, d => d.id)
            .on("tick", tick)

		vis.simulation
			// .force('charge', d3.forceManyBody().strength(0.25))
			// .force('center', d3.forceCenter(vis.width / 2, vis.height / 2))
			// .force("x", d3.forceX(vis.width/2).strength(0.0025))
			.force("x", d3.forceX().x(d => vis.timeScale(d.year)).strength(1))
			// .force("y", d3.forceY(vis.height/2).strength(0.0025))
			.force("y", d3.forceY().y(vis.height/2).strength(0.025))
			.force('collision', d3.forceCollide(5).iterations(10).strength(2))
			// .force('collision', d3.forceCollide().radius(d => vis.radiusScale(d.episodes)))

		vis.svg.selectAll("circle").on('mouseover', function(event, d) {
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
                             <p><span class="tooltip-emphasis">Show Name:</span> ${d.title}</p>
                              <p><span class="tooltip-emphasis">Episode Count:</span> ${d.episodes}</p>
                              <p><span class="tooltip-emphasis">Genre(s):</span> ${d.genres}</p>
                              <p><span class="tooltip-emphasis">Rating:</span> ${d.rating}</p>
						  	  <div id="tv-stats" style="text-align: center">
								<img src=${d.photo ? d.photo : "https://upload.wikimedia.org/wikipedia/commons/e/ea/No_image_preview.png"} style="max-width: 100%; max-height: 10em">			
							  </div>                                                          
                         </div>`);
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




	vis.simulation.alpha(1).alphaTarget(0).restart();
	// 	vis.simulation.alpha(1).alphaDecay(0.001).restart();
	}
}

