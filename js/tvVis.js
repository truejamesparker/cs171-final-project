
/*
 *  StationMap - Object constructor function
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

		// TODO

		vis.margin = { top: 100, right: 50, bottom: 0, left: 50 };

		vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
		vis.height = 500 - vis.margin.top - vis.margin.bottom; //document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.top - vis.margin.bottom;

		// SVG drawing area
		vis.svg = d3.select("#" + vis.parentElement).append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
			.append("g")
			.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

		var defs = vis.svg.append("defs")

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
			.range([0, 60]);

		vis.selectedTime = null;


		vis.bmargin = { top: 20, bottom: 50 }
		vis.bheight = 200 - vis.margin.top - vis.bmargin.bottom

		vis.brush = d3.brushX()
			.extent([[vis.margin.left,0], [vis.width - vis.margin.right, vis.bheight]])
			.on("brush", function (event) {
				vis.selectedTime = event.selection.map(vis.timeScale.invert)
				console.log(vis.selectedTime)
				vis.wrangleData();
			})

		vis.bSvg = d3.select("#" + vis.parentElement).append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.bheight + vis.bmargin.bottom + vis.bmargin.top)
			.append("g")
			.attr("transform", `translate(${vis.margin.left}, ${vis.bmargin.top})`)

		vis.timeline = vis.bSvg
			.append("g")
			.attr("class", "x brush")
			.call(vis.brush)


		vis.xAxis = d3.axisBottom()
			.scale(vis.timeScale)

		vis.bSvg
			.append('g')
			.attr("transform", `translate(0,${vis.bheight})`)
			.attr("class", "x x-axis")
			.call(vis.xAxis)

		vis.simulation = d3.forceSimulation()
			.force('charge', d3.forceManyBody().strength(0.25))
			.force('center', d3.forceCenter(vis.width / 2, vis.height / 2))
			.force('collision', d3.forceCollide().radius(d => vis.radiusScale(d.episodes)))

		vis.wrangleData();
	}


	/*
	 *  Data wrangling
	 */
	wrangleData () {
		let vis = this;

		// TODO

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

		// TODO

		// vis.radiusScale.domain([0, d3.max(vis.displayData, d => {return d.episodes})])

        let shows = vis.svg.selectAll(".show").data(vis.displayData, d => d.id);

		shows.exit()
			.remove()

		let newCircles = shows
            .enter()
            .append("circle")
            .attr("class", "show")
            .attr("fill", "whitesmoke")
			.attr("r", d => vis.radiusScale(d.episodes))
            .attr("cx", vis.width/2)
            .attr("cy", vis.height/2)
			.on('click', function(event, d) {
				d3.select(this)
					.attr("fill", function(d) { return `url(#${d.id})`; })
				document.querySelector("#tv-stats h3").innerText = d.title;
				document.querySelector("#tv-stats img").src = d.photo ? d.photo : "https://upload.wikimedia.org/wikipedia/commons/e/ea/No_image_preview.png";
			})
			.on('mouseout', function(event, d) {
				d3.select(this).attr("fill", "whitesmoke")
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
			.force('charge', d3.forceManyBody().strength(1))
			.force('center', d3.forceCenter(vis.width / 2, vis.height / 2))
			.force("x", d3.forceX(vis.width/2).strength(0.005))
			.force("y", d3.forceY(vis.height/2).strength(0.005))
			.force('collision', d3.forceCollide().radius(d => vis.radiusScale(d.episodes)))


		vis.simulation.alpha(1).alphaTarget(0).restart();

	}
}

