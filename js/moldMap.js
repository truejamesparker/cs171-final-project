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

            info.revealHover(layer.feature.properties);

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

            info.revealHover(layer.feature.properties);
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

        let info = L.control();

        info.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'moldMapBoroughInfo'); // create a div with a class "info"
            this.revealHover();
            return this._div;
        };

        info.revealHover = function (borough) {
            this._div.innerHTML =  (borough ?
                '<b><span class="moldMapBoroughName">' + " " + borough.boro_name + '</span></b><br /><div><span>' + ' Total Number of Violations:</span>' + ' ' + borough.total_count
                : 'Hover over a borough</div>');
        };

        info.addTo(vis.map);

        function styleLines(feature) {
            if (feature.properties.total_count > 190) {
                return {
                    fillColor: "#DCAAE3",
                    weight: 1,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                };
            } else if (feature.properties.total_count > 170) {
                return {
                    fillColor: "#DFC3FD",
                    weight: 1,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                };
            } else if (feature.properties.total_count > 70) {
                return {
                    fillColor: "#D9D5FF",
                    weight: 1,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                };
            } else if (feature.properties.total_count > 60) {
                return {
                    fillColor: "#DEE0FE",
                    weight: 1,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                };
            } else if (feature.properties.total_count > 1) {
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
            popupContent += "<br/><strong>Building ID: </strong>"
            popupContent += d.BuildingID;
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

