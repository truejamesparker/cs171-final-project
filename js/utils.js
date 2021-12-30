// Utility and helper functions

/*
* Debug function for downloading json to file
*/
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Example usage
// d3.json(url).then(jsonData =>{
//     // Start file download.
//     download("example.json", JSON.stringify(jsonData));
// });

function choose(choices) {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
}

// Function to convert date objects to strings or reverse
let dateFormatter = d3.timeFormat("%Y-%m-%d");
let dateParser = d3.timeParse("%Y-%m-%d");
let yearParser = d3.timeParse("%Y");

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}