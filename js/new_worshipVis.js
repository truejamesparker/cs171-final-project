/*
 *  new_worshipVis - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data
 */

class new_worshipVis {

    /*
     *  Constructor method
     */
    constructor(parentElement, displayData, coordinates, geoJSONdata) {
        this.parentElement = parentElement;
        this.displayData = displayData;
        this.coordinates = coordinates;
        this.geoJSONdata = geoJSONdata;

        this.initVis();
    }

    /*
     *  Initialize station map
     */

    initVis () {
        let vis = this;

        L.Icon.Default.imagePath = 'img/';

        vis.greenIcon = new L.Icon({
            iconUrl: 'img/marker-icon-2x-purple.png',
            shadowUrl: 'img/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        vis.map = L.map('worship-vis-new').setView(vis.coordinates, 4);

        L.tileLayer( 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
            subdomains: ['a','b','c']
        }).addTo(vis.map );

        vis.placesOfWorship = L.layerGroup().addTo(vis.map);

        let worshipColorInfo = L.control({position: 'bottomright'});

        vis.worshipColorDefinitions;

        worshipColorInfo.onAdd = function (map) {

            vis.worshipColorDefinitions = L.DomUtil.create('div', 'info worship-key');

            vis.worshipColorDefinitions.innerHTML += '<i style="background: #DCAAE3"></i>' + "> 10" + '<br>'
            vis.worshipColorDefinitions.innerHTML += '<i style="background: #DFC3FD"></i>' + "> 5" + '<br>'
            vis.worshipColorDefinitions.innerHTML += '<i style="background: #DFC3FD"></i>' + "4" + '<br>'
            vis.worshipColorDefinitions.innerHTML += '<i style="background: #DFC3FD"></i>' + "3" + '<br>'
            vis.worshipColorDefinitions.innerHTML += '<i style="background: #D9D5FF"></i>' + "2" + '<br>'
            vis.worshipColorDefinitions.innerHTML += '<i style="background: #DEE0FE"></i>' + "1" + '<br>'
            vis.worshipColorDefinitions.innerHTML += '<i style="background: #E7EEFE"></i>' + "0" + '<br>'

            return vis.worshipColorDefinitions;
        };

        worshipColorInfo.addTo(vis.map);

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

    updateVis() {
        let vis = this;

        vis.states  = L.geoJson(vis.geoJSONdata, {
            style: styleLines,
            weight: 2,
            fillOpacity: 0.7,
            onEachFeature: onEachFeature
        }).addTo(vis.map);

        function styleLines(feature) {
            if (feature.properties.worshipCount > 10) {
                return {
                    fillColor: "#DCAAE3",
                    weight: 1,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                };
            } else if (feature.properties.worshipCount > 5) {
                return {
                    fillColor: "#E6BCFC",
                    weight: 1,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                };
            } else if (feature.properties.worshipCount == 4) {
                return {
                    fillColor: "#DFC3FD",
                    weight: 1,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                };
            } else if (feature.properties.worshipCount == 3) {
                return {
                    fillColor: "#DBCCFF",
                    weight: 1,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                };
            } else if (feature.properties.worshipCount == 2) {
                return {
                    fillColor: "#D9D5FF",
                    weight: 1,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                };
            } else if (feature.properties.worshipCount == 1) {
                return {
                    fillColor: "#DEE0FE",
                    weight: 1,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                };
            } else if (feature.properties.worshipCount == 0) {
                return {
                    fillColor: "#E7EEFE",
                    weight: 1,
                    opacity: 0.2,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                };
            }
        }

        function revertHighlight(e) {
            let layer = e.target;

            vis.states.resetStyle(e.target);

            worshipMapBox.revealHover(layer.feature.properties);

        }

        function createHighlight(e) {
            let layer = e.target;

            layer.setStyle({
                weight: 5,
                fillOpacity: 0.7
            });

            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
            }

            worshipMapBox.revealHover(layer.feature.properties);
        }

        function onEachFeature(feature, layer) {
            layer.on({
                mouseover: createHighlight,
                mouseout: revertHighlight
            });
        }

        let worshipMapBox = L.control();

        worshipMapBox.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'worshipMapStateInfo'); // create a div with a class "info"
            this.revealHover();
            return this._div;
        };

        worshipMapBox.revealHover = function (state) {
            this._div.innerHTML =  (state ?
                '<span>' + "In " + '<span class="worship-emphasis">' + '' + state.name + '</span>' + '' + ', there are ' + '<span class="worship-emphasis">' + '' + state.worshipCount + '</span>' + '' + ' churches with a weekly <br>attendance count that exceeds ' + '<span class="worship-emphasis">' + '' + '8,000' + '</span>' + '' + ' people </span>' + ' '
                : 'Hover over a borough</div>');
        };

        worshipMapBox.addTo(vis.map);

        vis.displayData.forEach(function(d){

            let popupContent =  "<strong>Church Name: </strong>";
            popupContent += toTitleCase(d.NAME);
            popupContent += "<br/><strong>Denomination: </strong>"
            popupContent += toTitleCase(d.DENOM);
            popupContent += "<br/><strong>Address: </strong>"
            popupContent += toTitleCase(d.ADDRESS);
            popupContent += "<br/><strong>Telephone: </strong>"
            popupContent += d.TELEPHONE;
            popupContent += "<br/><strong>Attendance: </strong>"
            popupContent += d.ATTENDANCE;

            let marker;

            if (d.DENOM == "NONDENOM") {
                marker = L.marker([d.Y, d.X], {icon: vis.greenIcon})
                    .bindPopup(popupContent);
            } else {
                marker = L.marker([d.Y, d.X])
                    .bindPopup(popupContent);
            }

              vis.map.addLayer(marker);

         });

    }
}

