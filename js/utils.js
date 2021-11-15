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


// Function to convert date objects to strings or reverse
let dateFormatter = d3.timeFormat("%Y-%m-%d");
let dateParser = d3.timeParse("%Y-%m-%d");


