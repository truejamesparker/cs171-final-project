/*
 *  MoldMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data
 */

class MoldMap {

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

        vis.map = L.map('mold-map').setView(vis.coordinates, 10);

        L.tileLayer( 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
            subdomains: ['a','b','c']
        }).addTo(vis.map );

        vis.moldReports = L.layerGroup().addTo(vis.map);

        let moldColorInfo = L.control({position: 'bottomright'});

        vis.moldColorDefinitions;

        moldColorInfo.onAdd = function (map) {

            vis.moldColorDefinitions = L.DomUtil.create('div', 'info mold-key');

            vis.moldColorDefinitions.innerHTML += '<i style="background: #DCAAE3"></i>' + "> 1500" + '<br>'
            vis.moldColorDefinitions.innerHTML += '<i style="background: #D9D5FF"></i>' + "> 1000" + '<br>'
            vis.moldColorDefinitions.innerHTML += '<i style="background: #DEE0FE"></i>' + "> 500" + '<br>'
            vis.moldColorDefinitions.innerHTML += '<i style="background: #E7EEFE"></i>' + "> 50" + '<br>'

            return vis.moldColorDefinitions;
        };

        moldColorInfo.addTo(vis.map);

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

        function revertHighlight(e) {
            let layer = e.target;

            vis.boroughs.resetStyle(e.target);

            moldMapBox.revealHover(layer.feature.properties);

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

            moldMapBox.revealHover(layer.feature.properties);
        }

        function onEachFeature(feature, layer) {
            layer.on({
                mouseover: createHighlight,
                mouseout: revertHighlight
            });
        }

        vis.boroughs  = L.geoJson(vis.geoJSONdata, {
            style: styleLines,
            weight: 2,
            fillOpacity: 0.7,
            onEachFeature: onEachFeature
        }).addTo(vis.map);

        let moldMapBox = L.control();

        moldMapBox.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'moldMapBoroughInfo'); // create a div with a class "info"
            this.revealHover();
            return this._div;
        };

        moldMapBox.revealHover = function (borough) {
            this._div.innerHTML =  (borough ?
                '<b><span class="moldMapBoroughName">' + " " + borough.boro_name + '</span></b><br /><div><span>' + ' Total Number of Violations:</span>' + ' ' + borough.total_count
                : 'Hover over a borough</div>');
        };

        moldMapBox.addTo(vis.map);

        function styleLines(feature) {
            if (feature.properties.total_count > 2500) {
                return {
                    fillColor: "#DCAAE3",
                    weight: 1,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                };
            } else if (feature.properties.total_count > 1200) {
                return {
                    fillColor: "#D9D5FF",
                    weight: 1,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                };
            } else if (feature.properties.total_count > 500) {
                return {
                    fillColor: "#DEE0FE",
                    weight: 1,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                };
            } else if (feature.properties.total_count > 50) {
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

        let markerClusters = L.markerClusterGroup();

        vis.displayData.forEach(function(d){

        function toTitleCase(str) {
            return str.replace(
                /\w\S*/g,
                function(txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                }
            );
        }

        let popupContent =  "<strong>Inspection Date </strong>";
            popupContent += d.InspectionDate;
            popupContent += "<br/><strong>Street Name: </strong>"
            popupContent += toTitleCase(d.StreetName);
            popupContent += "<br/><strong>Building ID: </strong>"
            popupContent += d.BuildingID;
            popupContent += "<br/><strong>Story: </strong>"
            popupContent += d.Story;
            popupContent += "<br/><strong>Borough: </strong>"
            popupContent += d.Borough;
            popupContent += "<br/><strong>Current Status: </strong>"
            popupContent += toTitleCase(d.CurrentStatus);
            popupContent += "<br/><strong>Complaint Description: </strong>"
            popupContent += toTitleCase(d.NOVDescription);

            let marker = L.marker([d.Latitude, d.Longitude])
                .bindPopup(popupContent);

            markerClusters.addLayer(marker);

        });

        vis.map.addLayer(markerClusters)
    }
}

