document.addEventListener("DOMContentLoaded", function () {
    const scenes = document.querySelectorAll(".scene");
    let currentScene = 0;

    document.getElementById("nextButton").addEventListener("click", () => {
        scenes[currentScene].classList.remove("active");
        currentScene = (currentScene + 1) % scenes.length;
        scenes[currentScene].classList.add("active");
    });

    // Data
    const data = [
        {"Make":"Audi", "Model":"A3", "Year":2017, "Horsepower":220, "Price":31000},
        {"Make":"BMW", "Model":"3 Series", "Year":2017, "Horsepower":180, "Price":33000},
        {"Make":"Chevrolet", "Model":"Cruze", "Year":2017, "Horsepower":153, "Price":18000}
    ];

    // Scene 1: Overview
    const svg1 = d3.select("#chart1").append("svg")
        .attr("width", 600)
        .attr("height", 400);

    svg1.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d, i) => (i + 1) * 150)
        .attr("cy", 200)
        .attr("r", 20)
        .style("fill", "steelblue")
        .append("title")
        .text(d => `${d.Make} ${d.Model}`);

    // Scene 2: Horsepower Distribution
    const svg2 = d3.select("#chart2").append("svg")
        .attr("width", 600)
        .attr("height", 400);

    svg2.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d, i) => i * 150)
        .attr("y", d => 400 - d.Horsepower)
        .attr("width", 100)
        .attr("height", d => d.Horsepower)
        .style("fill", "orange")
        .append("title")
        .text(d => `${d.Make} ${d.Model}: ${d.Horsepower} HP`);

    // Scene 3: Price vs Horsepower
    const svg3 = d3.select("#chart3").append("svg")
        .attr("width", 600)
        .attr("height", 400);

    svg3.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => d.Horsepower)
        .attr("cy", d => 400 - d.Price / 100)
        .attr("r", 10)
        .style("fill", "green")
        .append("title")
        .text(d => `${d.Make} ${d.Model}: $${d.Price}`);
});
