// data.js
d3.csv("cars2017.csv").then(function(data) {
    window.carData = data;
    console.log(data);
});
