// script.js
document.addEventListener("DOMContentLoaded", function () {
    const scenes = document.querySelectorAll(".scene");
    let currentScene = 0;

    document.getElementById("nextButton").addEventListener("click", () => {
        scenes[currentScene].classList.remove("active");
        currentScene = (currentScene + 1) % scenes.length;
        scenes[currentScene].classList.add("active");
    });

    // Wait until the data is loaded
    d3.csv("cars2017.csv").then(function(data) {
        // Scene 1: Overview
        const svg1 = d3.select("#chart1").append("svg");
        const width = 800;
        const height = 400;
        const margin = {top: 20, right: 30, bottom: 30, left: 40};

        svg1.attr("viewBox", [0, 0, width, height]);

        const x1 = d3.scaleBand()
            .domain(data.map(d => d.Make))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const y1 = d3.scaleLinear()
            .domain([0, d3.max(data, d => +d.AvgMPG)]).nice()
            .range([height - margin.bottom, margin.top]);

        svg1.append("g")
            .attr("fill", "steelblue")
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", d => x1(d.Make))
            .attr("y", d => y1(d.AvgMPG))
            .attr("height", d => y1(0) - y1(d.AvgMPG))
            .attr("width", x1.bandwidth());

        svg1.append("g")
            .call(d3.axisLeft(y1))
            .attr("transform", `translate(${margin.left},0)`);

        svg1.append("g")
            .call(d3.axisBottom(x1))
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        // Scene 2: Horsepower Distribution
        const svg2 = d3.select("#chart2").append("svg")
            .attr("viewBox", [0, 0, width, height]);

        const x2 = d3.scaleBand()
            .domain(data.map(d => d.Make))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const y2 = d3.scaleLinear()
            .domain([0, d3.max(data, d => +d.Horsepower)]).nice()
            .range([height - margin.bottom, margin.top]);

        svg2.append("g")
            .attr("fill", "orange")
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", d => x2(d.Make))
            .attr("y", d => y2(d.Horsepower))
            .attr("height", d => y2(0) - y2(d.Horsepower))
            .attr("width", x2.bandwidth());

        svg2.append("g")
            .call(d3.axisLeft(y2))
            .attr("transform", `translate(${margin.left},0)`);

        svg2.append("g")
            .call(d3.axisBottom(x2))
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        // Scene 3: Price vs Horsepower
        const svg3 = d3.select("#chart3").append("svg")
            .attr("viewBox", [0, 0, width, height]);

        const x3 = d3.scaleLinear()
            .domain([0, d3.max(data, d => +d.Horsepower)]).nice()
            .range([margin.left, width - margin.right]);

        const y3 = d3.scaleLinear()
            .domain([0, d3.max(data, d => +d.AvgPrice)]).nice()
            .range([height - margin.bottom, margin.top]);

        svg3.append("g")
            .selectAll("circle")
            .data(data)
            .join("circle")
            .attr("cx", d => x3(d.Horsepower))
            .attr("cy", d => y3(d.AvgPrice))
            .attr("r", 5)
            .attr("fill", "green");

        svg3.append("g")
            .call(d3.axisLeft(y3))
            .attr("transform", `translate(${margin.left},0)`);

        svg3.append("g")
            .call(d3.axisBottom(x3))
            .attr("transform", `translate(0,${height - margin.bottom})`);
    });
});
