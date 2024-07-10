// script.js
document.addEventListener("DOMContentLoaded", function () {
    const scenes = document.querySelectorAll(".scene");
    let currentScene = 0;

    document.getElementById("nextButton").addEventListener("click", () => {
        scenes[currentScene].classList.remove("active");
        currentScene = (currentScene + 1) % scenes.length;
        scenes[currentScene].classList.add("active");
    });

    const tooltip = d3.select("#tooltip");

    function showTooltip(event, d) {
        tooltip.transition().duration(200).style("opacity", .9);
        tooltip.html(`Make: ${d.Make}<br>Highway MPG: ${d.AverageHighwayMPG}<br>City MPG: ${d.AverageCityMPG}`)
            .style("left", (event.pageX + 5) + "px")
            .style("top", (event.pageY - 28) + "px");
    }

    function hideTooltip() {
        tooltip.transition().duration(500).style("opacity", 0);
    }

    function addLegend(svg, color, width, height, margin) {
        const legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${width - margin.right - 100}, ${margin.top})`);

        legend.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", color);

        legend.append("text")
            .attr("x", 20)
            .attr("y", 10)
            .attr("dy", "0.32em")
            .text("Car Data")
            .style("fill", "white");
    }

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
            .domain([0, d3.max(data, d => +d.AverageHighwayMPG)]).nice()
            .range([height - margin.bottom, margin.top]);

        svg1.append("g")
            .attr("fill", "steelblue")
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", d => x1(d.Make))
            .attr("y", d => y1(d.AverageHighwayMPG))
            .attr("height", d => y1(0) - y1(d.AverageHighwayMPG))
            .attr("width", x1.bandwidth())
            .on("mouseover", showTooltip)
            .on("mousemove", showTooltip)
            .on("mouseout", hideTooltip);

        svg1.append("g")
            .call(d3.axisLeft(y1))
            .attr("transform", `translate(${margin.left},0)`)
            .style("color", "white");

        svg1.append("g")
            .call(d3.axisBottom(x1))
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end")
            .style("color", "white");

        addLegend(svg1, "steelblue", width, height, margin);

        // Scene 2: Engine Cylinders Distribution
        const svg2 = d3.select("#chart2").append("svg")
            .attr("viewBox", [0, 0, width, height]);

        const x2 = d3.scaleBand()
            .domain(data.map(d => d.Make))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const y2 = d3.scaleLinear()
            .domain([0, d3.max(data, d => +d.EngineCylinders)]).nice()
            .range([height - margin.bottom, margin.top]);

        svg2.append("g")
            .attr("fill", "orange")
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", d => x2(d.Make))
            .attr("y", d => y2(d.EngineCylinders))
            .attr("height", d => y2(0) - y2(d.EngineCylinders))
            .attr("width", x2.bandwidth())
            .on("mouseover", showTooltip)
            .on("mousemove", showTooltip)
            .on("mouseout", hideTooltip);

        svg2.append("g")
            .call(d3.axisLeft(y2))
            .attr("transform", `translate(${margin.left},0)`)
            .style("color", "white");

        svg2.append("g")
            .call(d3.axisBottom(x2))
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end")
            .style("color", "white");

        addLegend(svg2, "orange", width, height, margin);

        // Scene 3: City MPG vs Highway MPG
        const svg3 = d3.select("#chart3").append("svg")
            .attr("viewBox", [0, 0, width, height]);

        const x3 = d3.scaleLinear()
            .domain([0, d3.max(data, d => +d.AverageCityMPG)]).nice()
            .range([margin.left, width - margin.right]);

        const y3 = d3.scaleLinear()
            .domain([0, d3.max(data, d => +d.AverageHighwayMPG)]).nice()
            .range([height - margin.bottom, margin.top]);

        svg3.append("g")
            .selectAll("circle")
            .data(data)
            .join("circle")
            .attr("cx", d => x3(d.AverageCityMPG))
            .attr("cy", d => y3(d.AverageHighwayMPG))
            .attr("r", 5)
            .attr("fill", "green")
            .on("mouseover", showTooltip)
            .on("mousemove", showTooltip)
            .on("mouseout", hideTooltip);

        svg3.append("g")
            .call(d3.axisLeft(y3))
            .attr("transform", `translate(${margin.left},0)`)
            .style("color", "white");

        svg3.append("g")
            .call(d3.axisBottom(x3))
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .style("color", "white");

        addLegend(svg3, "green", width, height, margin);
    });
});
