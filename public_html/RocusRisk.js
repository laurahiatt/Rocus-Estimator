/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function clickHandle() {
    var rev = document.getElementById("estRev");
    var r = Number(rev.value);
    var emp = document.getElementById("numEmp");
    var ep = Number(emp.value);
    var spe = document.getElementById("cybSpend");
    var c = Number(spe.value);
    var poin = document.getElementById("points");
    var p = Number(poin.value);
    var lost = document.getElementById("lostC");
    var l = Number(lost.value);
	
	
    var probability = (0.01024*ep)-(0.00000004345*r)+(0.0000264*c)-(0.01087*p)+0.211;
    if (probability>1){
	probability = 1;
    }
    if (probability<0) {
	probability=0;
    }
	//console.log(probability);
    var cost = l*r;
    var rocusPrice = 0.4*ep;
    document.getElementById("prob").value = probability;
    var costW = c+0.001*probability*cost + rocusPrice;
    var costWO = c+0.43*probability*cost + c;
    document.getElementById("costWith").value = costW;
    document.getElementById("costWithout").value = costWO;
    
    //chart.update(probability);
}

function radialProgress(selector) {
  const parent = d3.select(selector);
  const size = parent.node().getBoundingClientRect();
  const svg = parent.append('svg')
    .attr('width', size.width)
    .attr('height', size.height);
  const outerRadius = Math.min(size.width, size.height) * 0.45;
  const thickness = 10;
  let value = 0;
  
  var color = d3.scaleSequential(d3.interpolateOrRd).domain([0,100]);
  
  const mainArc = d3.arc()
    .startAngle(0)
    .endAngle(Math.PI * 2)
    .innerRadius(outerRadius-thickness)
    .outerRadius(outerRadius);
    

  svg.append("path")
    .attr('class', 'progress-bar-bg')
    .attr('transform', `translate(${size.width/2},${size.height/2})`)
    .attr('d', mainArc());
  
  const mainArcPath = svg.append("path")
    .attr('class', 'progress-bar')
    .attr('fill', "blue")
    .attr('transform', `translate(${size.width/2},${size.height/2})`);
  
  svg.append("circle")
    .attr('class', 'progress-bar')
    .attr('transform', `translate(${size.width/2},${size.height/2-outerRadius+thickness/2})`)
    .attr('width', thickness)
    .attr('height', thickness)
    .attr('r', thickness/2);

  const end = svg.append("circle")
    .attr('class', 'progress-bar')
    .attr('transform', `translate(${size.width/2},${size.height/2-outerRadius+thickness/2})`)
    .attr('width', thickness)
    .attr('height', thickness) 
    .attr('r', thickness/2);
  
  let percentLabel = svg.append("text")
    .attr('class', 'progress-label')
    .attr('transform', `translate(${size.width/2},${size.height/2})`)
    .text('0');
  
  return {
    update: function(progressPercent) {
      const startValue = value;
      const startAngle = Math.PI * startValue / 50;
      const angleDiff = Math.PI * progressPercent / 50 - startAngle;
      const startAngleDeg = startAngle / Math.PI * 180;
      const angleDiffDeg = angleDiff / Math.PI * 180;
      const transitionDuration = 1500;

      mainArcPath.transition().duration(transitionDuration).attrTween('d', function(){
        return function(t) {
          mainArc.endAngle(startAngle + angleDiff * t);
          return mainArc();
        };
      });
      end.transition().duration(transitionDuration).attrTween('transform', function(){
        return function(t) {
          return `translate(${size.width/2},${size.height/2})`+
            `rotate(${(startAngleDeg + angleDiffDeg * t)})`+
            `translate(0,-${outerRadius-thickness/2})`;
        };
      });
      percentLabel.transition().duration(transitionDuration).tween('bla', function() {
        return function(t) {
          percentLabel.text(Math.round(startValue + (progressPercent - startValue) * t));
        };
      });
      value = progressPercent;
    }
  };
}


window.onload=function(){
	var button = document.getElementById("calc");
        button.addEventListener("click",clickHandle);
        button.addEventListener("click", function() {
            chart = radialProgress('.widget');
            var p = document.getElementById("prob");
            var pval = p.value * 100;
            let progress = [pval];
            let state = 0;
            d3.interval(function(){
            chart.update(progress[state]);
            //state = (state + 1) % progress.length
            }, 2000);
        });
        
};

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var formatPercent = d3.format(".0%");

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1, 1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatPercent);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("data.tsv", function(error, data) {

  data.forEach(function(d) {
    d.frequency = +d.frequency;
  });

  x.domain(data.map(function(d) { return d.letter; }));
  y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.letter); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.frequency); })
      .attr("height", function(d) { return height - y(d.frequency); });

  d3.select("input").on("change", change);

  var sortTimeout = setTimeout(function() {
    d3.select("input").property("checked", true).each(change);
  }, 2000);

  function change() {
    clearTimeout(sortTimeout);

    // Copy-on-write since tweens are evaluated after a delay.
    var x0 = x.domain(data.sort(this.checked
        ? function(a, b) { return b.frequency - a.frequency; }
        : function(a, b) { return d3.ascending(a.letter, b.letter); })
        .map(function(d) { return d.letter; }))
        .copy();

    svg.selectAll(".bar")
        .sort(function(a, b) { return x0(a.letter) - x0(b.letter); });

    var transition = svg.transition().duration(750),
        delay = function(d, i) { return i * 50; };

    transition.selectAll(".bar")
        .delay(delay)
        .attr("x", function(d) { return x0(d.letter); });

    transition.select(".x.axis")
        .call(xAxis)
      .selectAll("g")
        .delay(delay);
  }
});