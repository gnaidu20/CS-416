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
        tooltip.html(`Make: ${d.Make}<br>Fuel: ${d.Fuel}<br>Highway MPG: ${d.AverageHighwayMPG}<br>City MPG: ${d.AverageCityMPG}`)
            .style("left", (event.pageX + 5) + "px")
            .style("top", (event.pageY - 28) + "px");
    }

    function hideTooltip() {
        tooltip.transition().duration(500).style("opacity", 0);
    }

    function addLegend(svg, colorScale, width, height, margin) {
        const legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${width - margin.right + 10}, ${margin.top})`);

        const fuelTypes = colorScale.domain();
        const legendHeight = 20;

        fuelTypes.forEach((fuel, i) => {
            legend.append("rect")
                .attr("x", 0)
                .attr("y", i * legendHeight)
                .attr("width", 10)
                .attr("height", 10)
                .style("fill", colorScale(fuel));

            legend.append("text")
                .attr("x", 20)
                .attr("y", i * legendHeight + 10)
                .attr("dy", "0.32em")
                .text(fuel)
                .style("fill", "white");
        });
    }

    function addAxisLabels(svg, width, height, margin, xlabel, ylabel) {
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height - margin.bottom / 4)
            .style("fill", "white")
            .text(xlabel);

        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "middle")
            .attr("x", -height / 2)
            .attr("y", margin.left / 3)
            .attr("dy", "-1em")
            .attr("transform", "rotate(-90)")
            .style("fill", "white")
            .text(ylabel);
    }

    // Wait until the data is loaded
    d3.csv("cars2017.csv").then(function(data) {
        const colorScale = d3.scaleOrdinal()
            .domain(["Gasoline", "Diesel", "Electricity"])
            .range(["steelblue", "orange", "green"]);

        // Scene 1: Overview
        const svg1 = d3.select("#chart1").append("svg");
        const width = 1000;
        const height = 500;
        const margin = {top: 20, right: 180, bottom: 100, left: 60};

        svg1.attr("viewBox", [0, 0, width, height]);

        const x1 = d3.scaleBand()
            .domain(data.map(d => d.Make))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const y1 = d3.scaleLinear()
            .domain([0, d3.max(data, d => +d.AverageHighwayMPG)]).nice()
            .range([height - margin.bottom, margin.top]);

        svg1.append("g")
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", d => x1(d.Make))
            .attr("y", d => y1(d.AverageHighwayMPG))
            .attr("height", d => y1(0) - y1(d.AverageHighwayMPG))
            .attr("width", x1.bandwidth())
            .attr("fill", d => colorScale(d.Fuel))
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
            .attr("dx", "-0.8em")
            .attr("dy", "0.15em")
            .style("text-anchor", "end")
            .style("color", "white");

        addLegend(svg1, colorScale, width, height, margin);
        addAxisLabels(svg1, width, height, margin, "Car Make", "Average Highway MPG");

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
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", d => x2(d.Make))
            .attr("y", d => y2(d.EngineCylinders))
            .attr("height", d => y2(0) - y2(d.EngineCylinders))
            .attr("width", x2.bandwidth())
            .attr("fill", d => colorScale(d.Fuel))
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
            .attr("dx", "-0.8em")
            .attr("dy", "0.15em")
            .style("text-anchor", "end")
            .style("color", "white");

        addLegend(svg2, colorScale, width, height, margin);
        addAxisLabels(svg2, width, height, margin, "Car Make", "Engine Cylinders");

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
            .attr("fill", d => colorScale(d.Fuel))
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

        addLegend(svg3, colorScale, width, height, margin);
        addAxisLabels(svg3, width, height, margin, "Average City MPG", "Average Highway MPG");
    });
});
