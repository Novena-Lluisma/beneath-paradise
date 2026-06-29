// ================================
// BENEATH PARADISE
// CHAPTER 1 - OCEAN IS CHANGING
// ================================

const svg = d3.select("#chart");

const width = 1150;
const height = 800;

const margin = {
    top: 50,
    right: 50,
    bottom: 120,
    left: 130
};

const chartWidth = width - margin.left - margin.right;
const chartHeight = height - margin.top - margin.bottom;

svg.attr("viewBox", `0 0 ${width} ${height}`);

const chart = svg.append("g")
    .attr(
        "transform",
        `translate(${margin.left},${margin.top})`
    );

const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip");

d3.csv("data/SPC,DF_CLIMATE_CHANGE,1.0,filtered,2026-06-28 23-56-14.csv")
.then(function(data){

    data.forEach(function(d){

        d.Country = d["Pacific Island Countries and territories"];
        d.Year = +d.TIME_PERIOD;
        d.Value = +d.OBS_VALUE;

    });

    data = data.filter(function(d){

        return d.Country &&
               !isNaN(d.Value) &&
               d.Year >= 1990;

    });

    const countries = [
        ...new Set(
            data.map(d=>d.Country)
        )
    ].sort();

    const select = d3.select("#countrySelect");

    select.selectAll("option")
        .data(countries)
        .enter()
        .append("option")
        .attr("value",d=>d)
        .text(d=>d);

    drawChart(countries[0]);

    select.on("change",function(){

        drawChart(this.value);

    });

    function drawChart(country){

    chart.selectAll("*").remove();

    const filtered = data
        .filter(d => d.Country === country)
        .sort((a,b) => a.Year - b.Year);

    // ======================
    // SCALE
    // ======================

    const x = d3.scaleLinear()
        .domain(d3.extent(filtered,d=>d.Year))
        .range([0,chartWidth]);

    const y = d3.scaleLinear()
        .domain(d3.extent(filtered,d=>d.Value))
        .nice()
        .range([chartHeight,0]);

    // ======================
    // X AXIS
    // ======================

    chart.append("g")
    .attr("transform", `translate(0,${chartHeight})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("d")))
    .call(g => g.select(".domain").attr("stroke","#0A4F96").attr("stroke-width",4))
    .call(g => g.selectAll(".tick line").attr("stroke","#0A4F96"))
    .selectAll("text")
    .style("font-size","24px")
    .style("font-weight","700")
    .style("fill","white")
    .attr("dy","1.6em"); 

    // ======================
    // Y AXIS
    // ======================

    chart.append("g")
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").attr("stroke","#0A4F96").attr("stroke-width",4))
    .call(g => g.selectAll(".tick line").attr("stroke","#0A4F96"))
    .selectAll("text")
    .style("font-size","24px")
    .style("font-weight","700")
    .style("fill","white")
    .attr("dx","-0.8em");

    // warna garis axis

    chart.selectAll(".domain,.tick line")
        .attr("stroke","#FAFFF7")
        .attr("stroke-width",4);

    // ======================
    // LINE
    // ======================

    const line = d3.line()
        .x(d => x(d.Year))
        .y(d => y(d.Value));

    const path = chart.append("path")
        .datum(filtered)
        .attr("fill","none")
        .attr("stroke","#0A3D91")
        .attr("stroke-width",6)
        .attr("d",line);

    const totalLength = path.node().getTotalLength();

    path
        .attr("stroke-dasharray",totalLength)
        .attr("stroke-dashoffset",totalLength)
        .transition()
        .duration(1800)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset",0);

    // ======================
    // POINT
    // ======================

    chart.selectAll("circle")
        .data(filtered)
        .enter()
        .append("circle")
        .attr("cx",d=>x(d.Year))
        .attr("cy",d=>y(d.Value))
        .attr("r",10)
        .attr("fill","#FFD95A")
        .attr("stroke","white")
        .attr("stroke-width",4)

        .on("mouseover",function(event,d){

            tooltip
                .style("opacity",1)
                .html(
                    "<b>"+country+"</b><br><br>"+
                    "Year : "+d.Year+"<br>"+
                    "Temperature : "+d.Value.toFixed(2)+" °C"
                );

        })

        .on("mousemove",function(event){

            tooltip
                .style("left",(event.pageX+15)+"px")
                .style("top",(event.pageY-20)+"px");

        })

        .on("mouseout",function(){

            tooltip
                .style("opacity",0);

        });

// ======================
// INSIGHT
// ======================

let insight = "";

switch(country){

case "American Samoa":

insight = `
<b>American Samoa</b> experienced an overall upward sea surface temperature trend between <b>1990</b> and <b>2025</b>. Although temperatures fluctuated across several years, sea surface temperature anomalies became consistently higher after the early 2000s, indicating a gradual warming of surrounding ocean waters. Continued warming may increase stress on coral reefs, marine biodiversity, and coastal ecosystems.
`;

break;


case "Cook Islands":

insight = `
<b>Cook Islands</b> experienced a clear upward sea surface temperature trend between <b>1990</b> and <b>2025</b>. Despite several short-term fluctuations, sea surface temperature anomalies remained predominantly positive after the early 2000s, suggesting persistent ocean warming that could threaten marine ecosystems over time.
`;

break;


case "Fiji":

insight = `
<b>Fiji</b> experienced a strong upward sea surface temperature trend between <b>1990</b> and <b>2025</b>. Following relatively cooler conditions during the early 1990s, temperatures increased substantially and reached several peak anomalies in recent years. This pattern reflects significant ocean warming that may intensify pressure on coral reefs and coastal biodiversity.
`;

break;


case "French Polynesia":

insight = `
<b>French Polynesia</b> experienced a slightly upward sea surface temperature trend between <b>1990</b> and <b>2025</b>. While annual temperatures fluctuated considerably, the long-term pattern shows gradually warmer ocean conditions, with several higher temperature anomalies occurring after 2015.
`;

break;


case "Guam":

insight = `
<b>Guam</b> experienced an overall upward sea surface temperature trend between <b>1990</b> and <b>2025</b>. Although year-to-year variability is evident, higher temperature anomalies became more frequent in recent decades, indicating progressive warming of the surrounding ocean.
`;

break;

case "Kiribati":

insight = `
<b>Kiribati</b> experienced highly variable sea surface temperatures between <b>1990</b> and <b>2025</b>. Despite pronounced fluctuations and several extreme warm and cool anomalies, higher temperature peaks became more frequent in recent years, indicating a gradual warming trend of the surrounding ocean.
`;

break;

case "Marshall Islands":

insight = `
<b>Marshall Islands</b> experienced an overall upward sea surface temperature trend between <b>1990</b> and <b>2025</b>. Sea surface temperatures generally increased after the late 1990s, with warmer conditions becoming more common despite occasional short-term fluctuations.
`;

break;

case "Micronesia, Federated State of":

insight = `
<b>Micronesia</b> experienced a strong upward sea surface temperature trend between <b>1990</b> and <b>2025</b>. After relatively cooler conditions in the early 1990s, sea surface temperatures steadily increased, reaching consistently high anomalies during the last decade.
`;

break;

case "Nauru":

insight = `
<b>Nauru</b> experienced an overall upward sea surface temperature trend between <b>1990</b> and <b>2025</b>. Although annual temperatures fluctuated substantially, warmer anomalies became more frequent after the mid-2010s, reflecting continued ocean warming.
`;

break;

case "New Caledonia":

insight = `
<b>New Caledonia</b> experienced an overall upward sea surface temperature trend between <b>1990</b> and <b>2025</b>. While sea surface temperatures varied from year to year, recent decades recorded several higher anomalies, indicating progressively warmer ocean conditions.
`;

break;

case "Niue":

insight = `
<b>Niue</b> experienced a moderate upward sea surface temperature trend between <b>1990</b> and <b>2025</b>. Following relatively cooler conditions during the late 1990s, sea surface temperatures became consistently warmer, suggesting a gradual increase in ocean temperature over time.
`;

break;

case "Northern Mariana Islands":

insight = `
<b>Northern Mariana Islands</b> experienced an overall upward sea surface temperature trend between <b>1990</b> and <b>2025</b>. Sea surface temperatures increased steadily after the mid-1990s, with warmer conditions becoming more frequent during the last decade despite occasional fluctuations.
`;

break;

case "Palau":

insight = `
<b>Palau</b> experienced a clear upward sea surface temperature trend between <b>1990</b> and <b>2025</b>. Following relatively cooler conditions in the early 1990s, sea surface temperatures gradually increased and remained consistently high in recent years, indicating persistent ocean warming.
`;

break;

case "Papua New Guinea":

insight = `
<b>Papua New Guinea</b> experienced an overall upward sea surface temperature trend between <b>1990</b> and <b>2025</b>. Although year-to-year variability is evident, higher temperature anomalies became more frequent after 2015, suggesting continued warming of surrounding waters.
`;

break;

case "Pitcairn":

insight = `
<b>Pitcairn</b> experienced relatively stable sea surface temperatures between <b>1990</b> and <b>2025</b>. While several warm and cool anomalies occurred throughout the observed period, no strong long-term warming or cooling trend is clearly visible.
`;

break;

case "Samoa":

insight = `
<b>Samoa</b> experienced an overall upward sea surface temperature trend between <b>1990</b> and <b>2025</b>. Despite periodic fluctuations, sea surface temperatures generally increased over time, indicating gradual warming of the surrounding ocean.
`;

break;

case "Solomon Islands":

insight = `
<b>Solomon Islands</b> experienced a steady upward sea surface temperature trend between <b>1990</b> and <b>2025</b>. After relatively variable conditions during the early years, sea surface temperatures became consistently warmer, reaching their highest values near the end of the observation period.
`;

break;

case "Tokelau":

insight = `
<b>Tokelau</b> experienced an overall upward sea surface temperature trend between <b>1990</b> and <b>2025</b>. Although temperatures fluctuated considerably from year to year, warmer anomalies became more frequent after the early 2000s, indicating gradual ocean warming.
`;

break;

case "Tonga":

insight = `
<b>Tonga</b> experienced a gradual increase in sea surface temperature between <b>1990</b> and <b>2025</b>. Following cooler conditions during the early 1990s, sea surface temperatures generally increased and reached several high-temperature peaks in recent years.
`;

break;

case "Tuvalu":

insight = `
<b>Tuvalu</b> experienced an overall upward sea surface temperature trend between <b>1990</b> and <b>2025</b>. Despite periodic fluctuations, higher sea surface temperature anomalies became increasingly common during the last decade, reflecting continued ocean warming.
`;

break;

case "Vanuatu":

insight = `
<b>Vanuatu</b> experienced a steady upward sea surface temperature trend between <b>1990</b> and <b>2025</b>. After cooler conditions in the early years, temperatures gradually increased, with several pronounced warm anomalies observed after 2020.
`;

break;

case "Wallis and Futuna":

insight = `
<b>Wallis and Futuna</b> experienced a gradual upward sea surface temperature trend between <b>1990</b> and <b>2025</b>. Sea surface temperatures became consistently warmer after the early 2000s, although moderate year-to-year fluctuations remained throughout the observation period.
`;

break;

default:

insight = `
Sea surface temperature data are available from
<b>${filtered[0].Year}</b> to
<b>${filtered[filtered.length-1].Year}</b>.
`;

}

document.getElementById("insightText").innerHTML = insight;

    }
});

// ======================================================
// CHAPTER 2 - RISING SEAS
// ======================================================

const seaSvg = d3.select("#seaGauge");

seaSvg.attr("viewBox","0 0 1100 1400");

// Posisi
const tubeX = 380;
const tubeY = 80;

// Ukuran thermometer
const tubeWidth = 280;
const tubeHeight = 980;

// Bulatan bawah
const bulbX = tubeX + tubeWidth/2;
const bulbY = tubeY + tubeHeight + 120;
const bulbR = 150;

// Tube
seaSvg.append("rect")
    .attr("x", tubeX)
    .attr("y", tubeY)
    .attr("width", tubeWidth)
    .attr("height", tubeHeight)
    .attr("rx", 140)
    .attr("fill", "#e5eef7")
    .attr("stroke", "white")
    .attr("stroke-width", 8);

// Bulb
seaSvg.append("circle")
    .attr("cx", bulbX)
    .attr("cy", bulbY)
    .attr("r", bulbR)
    .attr("fill", "#e5eef7")
    .attr("stroke", "white")
    .attr("stroke-width", 8);

// Water
const water = seaSvg.append("rect")
    .attr("x", tubeX + 35)
    .attr("width", tubeWidth - 70)
    .attr("y", tubeY + tubeHeight)
    .attr("height", 0)
    .attr("rx", 100)
    .attr("fill", "#0A6BD9");

// Water Bulb
seaSvg.append("circle")
    .attr("cx", bulbX)
    .attr("cy", bulbY)
    .attr("r", 115)
    .attr("fill", "#0A6BD9");

// =========================
// MINI BAR CHART
// =========================

const miniBar = d3.select("#miniBarChart");

miniBar.attr("viewBox","0 0 1200 650");

// =======================

d3.csv("data/SPC,DF_CLIMATE_CHANGE,1.0,filtered,2026-06-29 06-19-49.csv")
.then(function(data){

    data.forEach(function(d){

        d.Country = d["Pacific Island Countries and territories"];
        d.Year = +d.TIME_PERIOD;
        d.Value = +d.OBS_VALUE;

    });

    data = data.filter(d => d.Country && !isNaN(d.Value));

    // ambil nilai min & max seluruh dataset
    const minValue = d3.min(data,d=>d.Value);
    const maxValue = d3.max(data,d=>d.Value);

    const countries = [...new Set(data.map(d=>d.Country))].sort();

    const select = d3.select("#countrySelect2");

    select.selectAll("*").remove();

    select.selectAll("option")
        .data(countries)
        .enter()
        .append("option")
        .attr("value",d=>d)
        .text(d=>d);

    updateCountry(countries[0]);

    select.on("change",function(){

        updateCountry(this.value);

    });

    function updateCountry(country){

        const filtered = data
            .filter(d=>d.Country===country)
            .sort((a,b)=>a.Year-b.Year);

        if(filtered.length===0) return;

// =========================
// MINI BAR CHART
// =========================

miniBar.selectAll("*").remove();

// biar SVG bener-bener besar
miniBar.attr("viewBox","0 0 1600 900");

const sample = [
    filtered[0],
    filtered[Math.floor(filtered.length*0.25)],
    filtered[Math.floor(filtered.length*0.5)],
    filtered[Math.floor(filtered.length*0.75)],
    filtered[filtered.length-1]
];

// Background
miniBar.append("rect")
    .attr("x",40)
    .attr("y",40)
    .attr("width",1520)
    .attr("height",820)
    .attr("rx",35)
    .attr("fill","rgba(255,255,255,0.18)");

// Scale X
const x = d3.scaleBand()
    .domain(sample.map(d=>d.Year))
    .range([120,1480])
    .padding(0.25);

// Scale Y
const y = d3.scaleLinear()
    .domain([
        d3.min(sample,d=>d.Value)-0.05,
        d3.max(sample,d=>d.Value)+0.05
    ])
    .range([700,140]);

// Batang
miniBar.selectAll(".bar")
    .data(sample)
    .enter()
    .append("rect")
    .attr("class","bar")
    .attr("x",d=>x(d.Year))
    .attr("width",150)
    .attr("y",700)
    .attr("height",0)
    .attr("rx",18)
    .attr("fill","#0A6BD9")
    .transition()
    .duration(800)
    .attr("y",d=>y(d.Value))
    .attr("height",d=>700-y(d.Value));

// Nilai
miniBar.selectAll(".value")
    .data(sample)
    .enter()
    .append("text")
    .attr("x",d=>x(d.Year)+75)
    .attr("y",d=>y(d.Value)-20)
    .attr("text-anchor","middle")
    .attr("fill","white")
    .style("font-size","50px")
    .style("font-weight","700")
    .text(d=>d.Value.toFixed(2));

// Tahun
miniBar.selectAll(".year")
    .data(sample)
    .enter()
    .append("text")
    .attr("x",d=>x(d.Year)+75)
    .attr("y",790)
    .attr("text-anchor","middle")
    .attr("fill","white")
    .style("font-size","46px")
    .style("font-weight","700")
    .text(d=>d.Year);

// Judul
miniBar.append("text")
    .attr("x",800)
    .attr("y",95)
    .attr("text-anchor","middle")
    .attr("fill","white")
    .style("font-size","85px")
    .style("font-family","EB Garamond")
    .style("font-weight","700")
    .text("Sea Level Anomaly");

        const value = d3.max(filtered, d => d.Value);

        document.getElementById("seaValue").innerHTML =
            d3.format("+.2f")(value)+" m";

        // Skala thermometer (biar tidak terlalu penuh)

const minDisplay = -0.30;
const maxDisplay = 0.80;

let percent = (value - minDisplay) / (maxDisplay - minDisplay);

// beri ruang atas & bawah
percent = percent * 0.75 + 0.10;

// batasi maksimal
percent = Math.max(0.10, Math.min(0.85, percent));

const fillHeight = tubeHeight * percent;

// Thermometer
water.transition()
    .duration(800)
    .attr("height", fillHeight)
    .attr("y", tubeY + tubeHeight - fillHeight);

let insight="";

        if(value < 0){

    insight = `
    <b>${country}</b> recorded sea levels below the long-term average during the observed period.
    `;

}
else if(value < 0.2){

    insight = `
    <b>${country}</b> recorded relatively stable sea level conditions with only minor anomalies.
    `;

}
else if(value < 0.5){

    insight = `
    <b>${country}</b> has experienced a moderate rise in sea level anomaly, indicating increasing coastal vulnerability.
    `;

}
else{

    insight = `
    <b>${country}</b> has experienced high sea level anomalies, increasing the risk of coastal flooding and shoreline erosion.
    `;

}

document.getElementById("seaInsight").innerHTML = insight;
    }

// ======================================================
// CHAPTER 3 - RED LIST INDEX
// ======================================================

const redBar = d3.select("#redBarChart");

redBar.attr("viewBox","0 0 1200 700");

d3.csv("data/SPC,DF_SDG_15,3.0,filtered,2026-06-29 08-41-08.csv").then(function(data){

    data.forEach(function(d){

        d.Country = d["Pacific Island Countries and territories"];
        d.Year = +d.TIME_PERIOD;
        d.Value = +d.OBS_VALUE;

    });

    data = data.filter(d=>d.Country && !isNaN(d.Value));

    const countries = [...new Set(data.map(d=>d.Country))].sort();

    const select = d3.select("#countrySelect3");

    select.selectAll("*").remove();

    select.selectAll("option")
        .data(countries)
        .enter()
        .append("option")
        .attr("value",d=>d)
        .text(d=>d);

    updateCountry(countries[0]);

    select.on("change",function(){

        updateCountry(this.value);

    });

    function updateCountry(country){

        const filtered = data
            .filter(d=>d.Country===country)
            .sort((a,b)=>a.Year-b.Year);

        if(filtered.length==0) return;

        const latest = filtered[filtered.length-1];

        document.getElementById("redValue").innerHTML =
            latest.Value.toFixed(2);

        // =========================
        // MINI BAR CHART
        // =========================

        redBar.selectAll("*").remove();

        const sample = [
            filtered[0],
            filtered[Math.floor(filtered.length*0.25)],
            filtered[Math.floor(filtered.length*0.5)],
            filtered[Math.floor(filtered.length*0.75)],
            filtered[filtered.length-1]
        ];

        redBar.append("rect")
            .attr("x",40)
            .attr("y",40)
            .attr("width",1120)
            .attr("height",560)
            .attr("rx",25)
            .attr("fill","rgba(255,255,255,.12)");

        const x = d3.scaleBand()
            .domain(sample.map(d=>d.Year))
            .range([120,1080])
            .padding(0.25);

        const y = d3.scaleLinear()
            .domain([
                d3.min(sample,d=>d.Value)-0.02,
                d3.max(sample,d=>d.Value)+0.02
            ])
            .range([500,100]);

        redBar.selectAll(".bar")
            .data(sample)
            .enter()
            .append("rect")
            .attr("x",d=>x(d.Year))
            .attr("width",100)
            .attr("y",500)
            .attr("height",0)
            .attr("rx",10)
            .attr("fill","#2ECC71")
            .transition()
            .duration(900)
            .attr("y",d=>y(d.Value))
            .attr("height",d=>500-y(d.Value));

        redBar.selectAll(".value")
            .data(sample)
            .enter()
            .append("text")
            .attr("x",d=>x(d.Year)+50)
            .attr("y",d=>y(d.Value)-18)
            .attr("text-anchor","middle")
            .attr("fill","white")
            .style("font-size","34px")
            .style("font-weight","700")
            .text(d=>d.Value.toFixed(2));

        redBar.selectAll(".year")
            .data(sample)
            .enter()
            .append("text")
            .attr("x",d=>x(d.Year)+50)
            .attr("y",540)
            .attr("text-anchor","middle")
            .attr("fill","white")
            .style("font-size","30px")
            .style("font-weight","700")
            .text(d=>d.Year);

        redBar.append("text")
            .attr("x",600)
            .attr("y",80)
            .attr("text-anchor","middle")
            .attr("fill","white")
            .style("font-size","62px")
            .style("font-family","EB Garamond")
            .style("font-weight","700")
            .text("Red List Index");

        // =========================
        // Insight
        // =========================

        let insight="";

        if(latest.Value>=0.90){

            insight=`<b>${country}</b> has a very healthy biodiversity condition. Most native species remain at low extinction risk.`;

        }

        else if(latest.Value>=0.80){

            insight=`<b>${country}</b> still maintains relatively healthy biodiversity, although conservation efforts remain important.`;

        }

        else if(latest.Value>=0.70){

            insight=`<b>${country}</b> shows moderate biodiversity pressure, indicating that several species face increasing threats.`;

        }

        else{

            insight=`<b>${country}</b> has relatively low Red List Index values, suggesting higher extinction risks and the need for stronger conservation actions.`;

        }

        document.getElementById("redInsight").innerHTML = insight;

    }

});

});