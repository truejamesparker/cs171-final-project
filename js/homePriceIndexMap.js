
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

		L.tileLayer( 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
			subdomains: ['a','b','c']
		}).addTo(vis.map );

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

		if (variable_type != "HPI_change") {
			variable_type = "HPI";
		}

		function activateHighlight(state) {
			let selected_state = state.target;

			selected_state.setStyle({
				fillOpacity: 0.4
			});

			if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
				selected_state.bringToFront();
			}

			HPIMapBox.revealHover(selected_state.feature.properties);

		}

		function turnOffHighlight(state) {
			vis.stateBoundaries.resetStyle(state.target);

			HPIMapBox.revealHover(state.target.feature.properties);

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
			fillOpacity: 0.95
		}).addTo(vis.map);




		let HPIMapBox = L.control();

		HPIMapBox.onAdd = function (map) {
			this._div = L.DomUtil.create('div', 'HPIMapStateInfo'); // create a div with a class "info"
			this.revealHover();
			return this._div;
		};

		HPIMapBox.revealHover = function (state) {
			if (variable_type == "HPI_change") {
				this._div.innerHTML =  (state ?
					'<b><span class="HPIMapValueContainer">' + " " + state.name + '</span></b><br /><div><span>' + ' HPI Change:</span>' + ' ' + state.HPI_change
					: 'Hover over a state</div>');
			} else {
				this._div.innerHTML =  (state ?
					'<b><span class="HPIMapValueContainer">' + " " + state.name + '</span></b><br /><div><span>' + ' HPI:</span>' + ' ' + state.HPI
					: 'Hover over a state</div>');
			}

		};

		HPIMapBox.addTo(vis.map);

		function styleLines(d) {

			if (variable_type == "HPI_change") {
				if (d.properties.HPI_change > 8) {
					return {
						fillColor: "#D394DD",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else if (d.properties.HPI_change > 6) {
					return {
						fillColor: "#DFAAFB",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else if (d.properties.HPI_change > 4) {
					return {
						fillColor: "#D6B4FD",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else if (d.properties.HPI_change > 3.5) {
					return {
						fillColor: "#D1BFFE",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else if (d.properties.HPI_change > 3) {
					return {
						fillColor: "#CFCAFF",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else if (d.properties.HPI_change > 2.5) {
					return {
						fillColor: "#D5D9FF",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else if (d.properties.HPI_change > 2) {
					return {
						fillColor: "#E0E9FF",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else if (d.properties.HPI_change > 0.5) {
					return {
						fillColor: "#ECF5FF",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else {
					return {
						fillColor: "#F6F6F8",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				}
			} else {
				if (d.properties.HPI > 1000) {
					return {
						fillColor: "#D394DD",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else if (d.properties.HPI > 900) {
					return {
						fillColor: "#DFAAFB",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else if (d.properties.HPI > 800) {
					return {
						fillColor: "#D6B4FD",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else if (d.properties.HPI > 700) {
					return {
						fillColor: "#D1BFFE",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else if (d.properties.HPI > 600) {
					return {
						fillColor: "#CFCAFF",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else if (d.properties.HPI > 500) {
					return {
						fillColor: "#D5D9FF",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else if (d.properties.HPI > 400) {
					return {
						fillColor: "#E0E9FF",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else if (d.properties.HPI > 300) {
					return {
						fillColor: "#ECF5FF",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else {
					return {
						fillColor: "#F6F6F8",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
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


