
/*
 *  physVis - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data
 */

class PhysVis {

	/*
	 *  Constructor method
	 */
	constructor(parentElement, data) {
		this.parentElement = parentElement;
		this.data = data;
		this.displayData = null;
		this.selectedTime = null;
		this.dataType = 'bath';
		this.colors = ["#98BAE7", "#6E3CBC", "#B8E4F0", "#7267CB"]

		this.field2label = {
			"1_5_minus_bath": "<1.5 baths",
			"2_baths": "2 baths",
			"2_5_baths": "2.5 baths",
			"3_plus_baths": ">3 baths",
			"2_minus_beds": "<2 baths",
			"3_beds": "3 beds",
			"4_plus_beds": ">4 beds",
			"1_car_garage": "1 car garage",
			"2_car_garage": "2 car garage",
			"3_plus_car_garage": ">3 car garage",
			"carport": "carport",
			"no_garage_carport": "no garage/carport",
			"1_story": "1-story",
			"2_story": "2-story",
			"3_story": "3-story",
			"avg_sq_ft": "average sq ft",
			"med_sq_ft": "median sq ft"
		}

		this.initVis();
	}


	/*
	 *  Initialize vis
	 */
	initVis () {
		let vis = this;

		vis.margin = { top: 30, right: 50, bottom: 10, left: 50 };

		vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
		vis.height = 300 - vis.margin.top - vis.margin.bottom; //document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.top - vis.margin.bottom;

		// SVG drawing area
		vis.svg = d3.select("#" + vis.parentElement).append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
			.append("g")
			.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

		vis.timelineSvgMargin = { top: 10, bottom: 30 }
		vis.timelineSvgHeight = 120 - vis.margin.top - vis.timelineSvgMargin.bottom

		vis.timelineSvg = d3.select("#" + vis.parentElement).append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.timelineSvgHeight + vis.timelineSvgMargin.bottom + vis.timelineSvgMargin.top)
			.append("g")
			.attr("transform", `translate(${vis.margin.left}, ${vis.timelineSvgMargin.top})`)

		vis.timelineSvg.append("text")
			.attr("class", "y label")
			.attr("text-anchor", "end")
			.attr("x", vis.width - vis.margin.left)
			.attr("y", vis.timelineSvgHeight - vis.timelineSvgMargin.top)
			.attr("fill", "darkgrey")
			.attr("font-size", "small")
			.text("Year")

		vis.ytext = vis.svg.append("text")
			.attr("class", "x label")
			.attr("text-anchor", "middle")
			.attr("transform", () => `translate(0,${vis.height/2}) rotate(-90)`)
			.attr("fill", "darkgrey")
			.attr("font-size", "small")
			.text("# of houses (in thousands)")

		vis.brush = d3.brushX()
			.extent([[vis.margin.left,0], [vis.width - vis.margin.right, vis.timelineSvgHeight]])
			.on("brush", function (event) {
				vis.selectedTime = event.selection.map(vis.timeScale.invert)
				vis.wrangleData();
			})

		vis.timelineSvg
			.append("g")
			.attr("class", "x brush")
			.call(vis.brush)

		vis.data.forEach(d => d["year"] = yearParser(d["year"]))

		vis.timeScale = d3.scaleTime()
			.domain(d3.extent(vis.data, d => {return d.year}))
			.range([vis.margin.left, vis.width - vis.margin.right])

		vis.colorScale = d3.scaleOrdinal()
			.range(this.colors)

		vis.legend = d3.legendColor()
			.scale(vis.colorScale)

		vis.legendGroup = vis.svg.append("g")
			.attr("transform", `translate(${vis.width - vis.margin.left},${0})`)

		vis.xScale = d3.scaleLinear()
			.domain(d3.extent(vis.data, d => {return d.year}))
			.range([vis.margin.left, vis.width - vis.margin.right])

		vis.yScale = d3.scaleLinear()
			.range([vis.height, vis.margin.top])

		vis.xAxis = d3.axisBottom()
			.scale(vis.timeScale)

		vis.yAxis = d3.axisLeft()
			.scale(vis.yScale)

		vis.timelineSvg
			.append('g')
			.attr("transform", `translate(0,${vis.timelineSvgHeight})`)
			.attr("class", "x x-axis")
			.call(vis.xAxis)

		vis.yGroup = vis.svg
			.append('g')
			.attr("transform", `translate(${vis.margin.left},0)`)
			.attr("class", "y y-axis")

		// Add the line
		vis.paths = []
		vis.fields = [null, null, null, null, null]

		let btn = d3.select("#physButtonGroup")
		btn.on("click", (event) => {
			let e = document.querySelector("#physButtonGroup > .btn:focus")
			vis.dataType = e.id
			vis.paths.forEach(p => p.attr("d", null))
			vis.wrangleData()
		})

		vis.selectedTime = d3.extent(vis.data.map(d => d.year))

		vis.fields.forEach((f,i) =>
			vis.paths[i] = vis.svg
			.append("path")
			.attr("class", "gPath")
			.attr("stroke", vis.colors[i])
		)

		vis.trend = vis.timelineSvg.append("g").append("path")

		vis.wrangleData();
	}


	/*
	 *  Data wrangling
	 */
	wrangleData () {
		let vis = this;

		// TODO
		switch (vis.dataType) {
			case "bath":
				vis.fields = ["1_5_minus_bath", "2_baths", "2_5_baths", "3_plus_baths"]
				break
			case "bed":
				vis.fields = ["2_minus_beds", "3_beds", "4_plus_beds"]
				break
			case "garage":
				vis.fields = ["1_car_garage", "2_car_garage", "3_plus_car_garage", "carport", "no_garage_carport"]
				break
			case "story":
				vis.fields = ["1_story", "2_story", "3_story"]
				break
			case "sqft":
				vis.fields = ["avg_sq_ft", "med_sq_ft"]
				break
		}

		if (vis.selectedTime) {
			vis.displayData = vis.data.filter(d => (d.year > vis.selectedTime[0] && d.year < vis.selectedTime[1]))
		} else {
			vis.displayData = vis.data
		}


		// Update the visualization
		vis.updateVis();
	}

	updateVis() {
		let vis = this;

		function getMax(data) {
			let list = []
			data.forEach(d => {
				vis.fields.forEach(f => {
					list.push(d[f])
				})
			})
			let max = d3.max(list)
			return max
		}

		vis.yScale
			.domain([0, getMax(vis.displayData)])

		vis.xScale
			.domain(vis.selectedTime)

		vis.yAxis.ticks(5)
		vis.yGroup
			.transition()
			.duration(1000)
			.call(vis.yAxis)

		vis.colorScale.domain(vis.fields.map(field => vis.field2label[field]))
		vis.legendGroup.call(vis.legend)

		vis.totalData = []
		if (vis.dataType != "sqft") {
			vis.ytext.text("# of houses (in thousands)")
			vis.totalData = vis.data.map(d => {
				let sum = 0
				vis.fields.forEach(k => {
					if (d[k] != null) {
						sum += d[k]
					}
				})
				return {year: d.year, value: sum}
			})
		} else {
			vis.ytext.text("Square feet")
		}

		let y = d3.scaleLinear()
			.domain(d3.extent(vis.totalData, d => { return d.value }))
			.range([vis.timelineSvgHeight, vis.timelineSvgMargin.top])

		vis.trend
			.datum(vis.totalData)
			.attr("class", "gPath")
			.attr("stroke", "grey")
			.attr("d", d3.line()
				.x(function (d) {
					return vis.timeScale(d.year)
				})
				.y(function (d) {
					return y(d.value)
				})
			)

		vis.fields.forEach((l, i) => {
			let data = vis.displayData.map(d => {
				return {year: d.year, value: d[l]}
			}).filter(d => d.value != null)
			vis.paths[i]
				.datum(data)
				.transition()
				.ease(d3.easeSin)
				.duration(300)
				.attr("d", d3.line()
					.x(function (d) {
						return vis.xScale(d.year)
					})
					.y(function (d) {
						return vis.yScale(d.value)
					})
				)
			}
		)
	}
}

