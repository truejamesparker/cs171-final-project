
/*
 *  HomePriceIndexMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

class HomePriceIndexMap {

	/*
	 *  Constructor method
	 */
	constructor(parentElement, geoJSONdata) {
		this.parentElement = parentElement;
		this.geoJSONdata = geoJSONdata;

		this.initVis();
	}


	/*
	 *  Initialize map
	 */
	initVis () {
		let vis = this;

		L.Icon.Default.imagePath = 'img/';

		vis.map = L.map(vis.parentElement).setView([40.0902, -95.7129], 3.5);

		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(vis.map);

		vis.states = L.layerGroup().addTo(vis.map);

		let priceControl = L.control({position: 'bottomright'});

		vis.priceKey;

		priceControl.onAdd = function (map) {

			vis.priceKey = L.DomUtil.create('div', 'info price-key');

			vis.priceKey.innerHTML += '<i style="background: #D394DD"></i>' + "> 1000" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #DFAAFB"></i>' + "> 900" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #D6B4FD"></i>' + "> 800" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #D1BFFE"></i>' + "> 700" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #CFCAFF"></i>' + "> 600" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #D5D9FF"></i>' + "> 500" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #E0E9FF"></i>' + "> 400" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #ECF5FF"></i>' + "> 300" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #F6F6F8"></i>' + "N/A" + '<br>'

			return vis.priceKey;
		};

		priceControl.addTo(vis.map);

		vis.wrangleData();
	}


	/*
	 *  Data wrangling
	 */
	wrangleData () {
		let vis = this;

		// No data wrangling/filtering needed

		// Update the visualization
		vis.updateVis();
	}

	updateVis(variable_type) {
		let vis = this;

		function activateHighlight(state) {
			let selected_state = state.target;

			selected_state.setStyle({
				fillOpacity: 0.4
			});

		}

		function turnOffHighlight(state) {
			vis.stateBoundaries.resetStyle(state.target);
		}

		function onEachFeature(feature, layer) {

			let popupContent = "";

			if (variable_type == "HPI_change") {
				popupContent += "<strong>2020 Yearly Percent HPI Change: </strong>"
				popupContent += feature.properties.HPI_change;
				popupContent += "%"
			} else {
				popupContent =  "<strong>2020 Home Price Index (HPI): </strong>";
				popupContent += feature.properties.HPI;

			}

			layer.on({
				mouseover: activateHighlight,
				mouseout: turnOffHighlight
			});

			layer.bindPopup(popupContent);

		}

		vis.stateBoundaries  = L.geoJson(vis.geoJSONdata, {
			style: styleLines,
			onEachFeature: onEachFeature,
			weight: 3,
			fillOpacity: 0.8
		}).addTo(vis.map);


		function styleLines(d) {

			if (variable_type == "HPI_change") {
				if (d.properties.HPI_change > 8) {
					return {
						color: "#D394DD"
					}
				} else if (d.properties.HPI_change > 6) {
					return {
						color: "#DFAAFB"
					}
				} else if (d.properties.HPI_change > 4) {
					return {
						color: "#D6B4FD"
					}
				} else if (d.properties.HPI_change > 3.5) {
					return {
						color: "#D1BFFE"
					}
				} else if (d.properties.HPI_change > 3) {
					return {
						color: "#CFCAFF"
					}
				} else if (d.properties.HPI_change > 2.5) {
					return {
						color: "#D5D9FF"
					}
				} else if (d.properties.HPI_change > 2) {
					return {
						color: "#E0E9FF"
					}
				} else if (d.properties.HPI_change > 0.5) {
					return {
						color: "#ECF5FF"
					}
				} else {
					return {
						color: "#F6F6F8"
					}
				}
			} else {
				if (d.properties.HPI > 1000) {
					return {
						color: "#D394DD"
					}
				} else if (d.properties.HPI > 900) {
					return {
						color: "#DFAAFB"
					}
				} else if (d.properties.HPI > 800) {
					return {
						color: "#D6B4FD"
					}
				} else if (d.properties.HPI > 700) {
					return {
						color: "#D1BFFE"
					}
				} else if (d.properties.HPI > 600) {
					return {
						color: "#CFCAFF"
					}
				} else if (d.properties.HPI > 500) {
					return {
						color: "#D5D9FF"
					}
				} else if (d.properties.HPI > 400) {
					return {
						color: "#E0E9FF"
					}
				} else if (d.properties.HPI > 300) {
					return {
						color: "#ECF5FF"
					}
				} else {
					return {
						color: "#F6F6F8"
					}
				}
			}
		}

		if (variable_type == "HPI_change") {
			vis.priceKey.innerHTML = '<i style="background: #D394DD"></i>' + "> 8" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #DFAAFB"></i>' + "> 6" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #D6B4FD"></i>' + "> 4" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #D1BFFE"></i>' + "> 3.5" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #CFCAFF"></i>' + "> 3" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #D5D9FF"></i>' + "> 2.5" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #E0E9FF"></i>' + "> 2" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #ECF5FF"></i>' + "> 0.5" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #F6F6F8"></i>' + "N/A" + '<br>'
		} else {
			vis.priceKey.innerHTML = '<i style="background: #D394DD"></i>' + "> 1000" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #DFAAFB"></i>' + "> 900" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #D6B4FD"></i>' + "> 800" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #D1BFFE"></i>' + "> 700" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #CFCAFF"></i>' + "> 600" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #D5D9FF"></i>' + "> 500" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #E0E9FF"></i>' + "> 400" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #ECF5FF"></i>' + "> 300" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #F6F6F8"></i>' + "N/A" + '<br>'
		}


	}
}


