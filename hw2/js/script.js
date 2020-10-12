const width = 1000;
const height = 500;
const margin = 30;
const svg  = d3.select('#scatter-plot')
            .attr('width', width)
            .attr('height', height);

let xParam = 'fertility-rate';
let yParam = 'child-mortality';
let radius = 'gdp';
let year = '2000';

const params = ['child-mortality', 'fertility-rate', 'gdp', 'life-expectancy', 'population'];
const colors = ['aqua', 'lime', 'gold', 'hotpink']

const x = d3.scaleLinear().range([margin*2, width-margin]);
const y = d3.scaleLinear().range([height-margin, margin]);

const xLable = svg.append('text').attr('transform', `translate(${width/2}, ${height})`);
const yLable = svg.append('text').attr('transform', `translate(${margin/2}, ${height/2}) rotate(-90)`);

const xAxis = svg.append('g').attr('transform', `translate(0, ${height-margin})`);
const yAxis = svg.append('g').attr('transform', `translate(${margin*2}, 0)`);


const color = d3.scaleOrdinal(colors);
const r = d3.scaleSqrt();

d3.select('#radius').selectAll('option').data(params).enter().append("option")
.text(function(d) {return d;})
.attr("value", function(d) {return d;})
.attr("selected", function(d) {if (d == xParam) return true;});

d3.select('#x').selectAll('option').data(params).enter().append("option")
.text(function(d) {return d;})
.attr("value", function(d) {return d;})
.attr("selected", function(d) {if (d == xParam) return true;})

d3.select('#y').selectAll('option').data(params).enter().append("option")
.text(function(d) {return d;})
.attr("value", function(d) {return d;})
.attr("selected", function(d) {if (d == yParam) return true;})


loadData().then(data => {

    console.log(data)

    let regions = d3.nest()
    .key(function(d) { return d["region"]; })
    .entries(data);

    color.domain(regions);

    d3.select('.slider').on('change', newYear);
    d3.select('#radius').on('change', newRadius);
    d3.select('#x').on('change', newX);
    d3.select('#y').on('change', newY);

    function newYear(){
        year = this.value;
        updateChart()
    }

    function newRadius(){
        radius = this.value;
        updateChart()
    }

    function newX(){
        xParam = this.value;
        updateChart();
    }

    function newY(){
        yParam = this.value;
        updateChart();
    }

    function updateChart(){
        xLable.text(xParam);
        yLable.text(yParam);
        d3.select('.year').text(year);

        let xRange = data.map(d=> +d[xParam][year]);
        x.domain([d3.min(xRange), d3.max(xRange)]);

        xAxis.call(d3.axisBottom(x));  

        let yRange = data.map(d=> +d[yParam][year]);
        y.domain([d3.min(yRange), d3.max(yRange)]);

        yAxis.call(d3.axisLeft(y));  

        let rRange = data.map(d=> +d[radius][year]);
        r.domain([d3.min(rRange), d3.max(rRange)]).range([1, 15]);

        selection = svg.selectAll("circle").data(data)
      
        selection.join("circle")
        .attr("r", function(d) { return r(+d[radius][year]); })
        .attr("fill", function(d) { return color(d["region"]); })
        .attr("cx", function(d) { return x(+d[xParam][year]); })
        .attr("cy", function(d) { return y(+d[yParam][year]); });
    }
    
    updateChart();
});


async function loadData() {
    const population = await d3.csv('data/pop.csv');
    const rest = { 
        'gdp': await d3.csv('data/gdppc.csv'),
        'child-mortality': await d3.csv('data/cmu5.csv'),
        'life-expectancy': await d3.csv('data/life_expect.csv'),
        'fertility-rate': await d3.csv('data/tfr.csv')
    };
    const data = population.map(d=>{
        return {
            geo: d.geo,
            country: d.country,
            region: d.region,
            population: {...d},
            ...Object.values(rest).map(v=>v.find(r=>r.geo===d.geo)).reduce((o, d, i)=>({...o, [Object.keys(rest)[i]]: d }), {})
        }
    })
    return data
}