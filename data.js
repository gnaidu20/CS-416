// to load the CSV data
d3.csv("https://flunky.github.io/cars2017.csv").then(function(data) {
    window.carData = data;
    console.log(data);
});
