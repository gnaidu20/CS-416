document.addEventListener("DOMContentLoaded", function () {
    const scenes = document.querySelectorAll(".scene");
    let currentScene = 0;

    const nextButton = document.getElementById("nextButton");
    const backButton = document.getElementById("backButton");

    nextButton.addEventListener("click", () => {
        scenes[currentScene].classList.remove("active");
        currentScene = (currentScene + 1) % scenes.length;
        scenes[currentScene].classList.add("active");
        updateButtons();
    });

    backButton.addEventListener("click", () => {
        scenes[currentScene].classList.remove("active");
        currentScene = (currentScene - 1 + scenes.length) % scenes.length;
        scenes[currentScene].classList.add("active");
        updateButtons();
    });

    function updateButtons() {
        if (currentScene === 0) {
            backButton.style.display = "none";
        } else {
            backButton.style.display = "inline-block";
        }

        if (currentScene === scenes.length - 1) {
            nextButton.textContent = "Restart";
        } else {
            nextButton.textContent = "Next";
        }
    }

    const tooltip = d3.select("#tooltip");

    function showTooltip(event, d) {
        tooltip.transition().duration(200).style("opacity", .9);
        tooltip.html(`Make: ${d.Make}<br>Fuel: ${d.Fuel}<br>Engine Cylinders: ${d.EngineCylinders}<br>Highway MPG: ${d.AverageHighwayMPG}<br>City MPG: ${d.AverageCityMPG}`)
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

    function updateVoronoi(g3, data, xScale, yScale, width, height) {
        const voronoi = d3.Delaunay.from(
            data.map(d => ({
                x: xScale(d.AverageCityMPG),
                y: yScale(d.AverageHighwayMPG)
            })),
            d => d.x,
            d => d.y
        ).voronoi([0, 0, width, height]);

        const voronoiGroup = g3.select(".voronoi");

        if (voronoiGroup.empty()) {
            g3.append("g")
                .attr("class", "voronoi");
        } else {
            voronoiGroup.selectAll("path").remove();
        }

        g3.select(".voronoi").selectAll("path")
            .data(data)
            .join("path")
            .attr("d", (d, i) => voronoi.renderCell(i))
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", function(event, d) {
                const point = d;
                showTooltip(event, point);
                d3.select(g3.selectAll("circle").nodes()[data.indexOf(point)])
                    .transition()
                    .duration(200)
                    .attr("r", 10);
            })
            .on("mouseout", function(event, d) {
                const point = d;
                hideTooltip();
                d3.select(g3.selectAll("circle").nodes()[data.indexOf(point)])
                    .transition()
                    .duration(200)
                    .attr("r", 5);
            });
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

        const bars1 = svg1.append("g")
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", d => x1(d.Make))
            .attr("y", d => y1(0))
            .attr("height", 20)
            .attr("width", x1.bandwidth())
            .attr("fill", d => colorScale(d.Fuel))
            .on("mouseover", function(event, d) {
                showTooltip(event, d);
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("y", d => y1(d.AverageHighwayMPG) - 10)
                    .attr("height", d => y1(0) - y1(d.AverageHighwayMPG) + 10);
            })
            .on("mousemove", showTooltip)
            .on("mouseout", function(event, d) {
                hideTooltip();
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("y", d => y1(d.AverageHighwayMPG))
                    .attr("height", d => y1(0) - y1(d.AverageHighwayMPG));
            });

        bars1.transition()
            .duration(3000)
            .delay(1000)
            .attr("height", d => y1(0) - y1(d.AverageHighwayMPG))
            .attr("y", d => y1(d.AverageHighwayMPG));

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

        const bars2 = svg2.append("g")
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", d => x2(d.Make))
            .attr("y", d => y2(0))
            .attr("height", 20)
            .attr("width", x2.bandwidth())
            .attr("fill", d => colorScale(d.Fuel))
            .on("mouseover", function(event, d) {
                showTooltip(event, d);
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("y", d => y2(d.EngineCylinders) - 10)
                    .attr("height", d => y2(0) - y2(d.EngineCylinders) + 10);
            })
            .on("mousemove", showTooltip)
            .on("mouseout", function(event, d) {
                hideTooltip();
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("y", d => y2(d.EngineCylinders))
                    .attr("height", d => y2(0) - y2(d.EngineCylinders));
            });

        bars2.transition()
            .duration(3000)
            .delay(1000)
            .attr("height", d => y2(0) - y2(d.EngineCylinders))
            .attr("y", d => y2(d.EngineCylinders));

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

        const g3 = svg3.append("g");

        const updateChart3 = (filteredData) => {
            g3.selectAll("circle").remove();
            g3.selectAll("circle")
                .data(filteredData)
                .join("circle")
                .attr("cx", d => x3(d.AverageCityMPG))
                .attr("cy", d => y3(d.AverageHighwayMPG))
                .attr("r", 5)
                .attr("fill", d => colorScale(d.Fuel))
                .on("mouseover", function(event, d) {
                    showTooltip(event, d);
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr("r", 10);
                })
                .on("mousemove", showTooltip)
                .on("mouseout", function(event, d) {
                    hideTooltip();
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr("r", 5);
                });
            
            updateVoronoi(g3, filteredData, x3, y3, width, height);
        };

        g3.append("g")
            .call(d3.axisLeft(y3))
            .attr("transform", `translate(${margin.left},0)`)
            .style("color", "white");

        g3.append("g")
            .call(d3.axisBottom(x3))
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .style("color", "white");

        addLegend(svg3, colorScale, width, height, margin);
        addAxisLabels(svg3, width, height, margin, "Average City MPG", "Average Highway MPG");

        const zoom = d3.zoom()
            .scaleExtent([1, 10])
            .translateExtent([[0, 0], [width, height]])
            .extent([[0, 0], [width, height]])
            .on("zoom", zoomed);

        svg3.call(zoom);

        function zoomed(event) {
            const {transform} = event;
            g3.attr("transform", transform);
            g3.attr("stroke-width", 1 / transform.k);
            g3.selectAll("circle").attr("r", d => 5 / transform.k);
            updateVoronoi(g3, filteredData, x3, y3, width, height);
        }

        const carMakes = [...new Set(data.map(d => d.Make))];

        const carMakeFilter = d3.select("#carMakeFilter");

        carMakes.forEach(make => {
            carMakeFilter.append("option")
                .attr("value", make)
                .text(make);
        });

        d3.select("#applyFilterButton").on("click", () => {
            const selectedMakes = Array.from(carMakeFilter.node().selectedOptions, option => option.value);
            const filteredData = selectedMakes.length > 0 ? data.filter(d => selectedMakes.includes(d.Make)) : data;
            updateChart3(filteredData);
        });

        d3.select("#refreshButton").on("click", () => {
            updateChart3(data);
        });

        updateChart3(data); // Initial Chart
    });
});
