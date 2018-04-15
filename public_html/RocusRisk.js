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
}

function radialProgress(selector) {
  const parent = d3.select(selector)
  const size = parent.node().getBoundingClientRect()
  const svg = parent.append('svg')
    .attr('width', size.width)
    .attr('height', size.height);
  const outerRadius = Math.min(size.width, size.height) * 0.45;
  const thickness = 10;
  let value = 0;
  
  const mainArc = d3.arc()
    .startAngle(0)
    .endAngle(Math.PI * 2)
    .innerRadius(outerRadius-thickness)
    .outerRadius(outerRadius)

  svg.append("path")
    .attr('class', 'progress-bar-bg')
    .attr('transform', `translate(${size.width/2},${size.height/2})`)
    .attr('d', mainArc())
  
  const mainArcPath = svg.append("path")
    .attr('class', 'progress-bar')
    .attr('transform', `translate(${size.width/2},${size.height/2})`)
  
  svg.append("circle")
    .attr('class', 'progress-bar')
    .attr('transform', `translate(${size.width/2},${size.height/2-outerRadius+thickness/2})`)
    .attr('width', thickness)
    .attr('height', thickness)
    .attr('r', thickness/2)

  const end = svg.append("circle")
    .attr('class', 'progress-bar')
    .attr('transform', `translate(${size.width/2},${size.height/2-outerRadius+thickness/2})`)
    .attr('width', thickness)
    .attr('height', thickness)
    .attr('r', thickness/2)
  
  let percentLabel = svg.append("text")
    .attr('class', 'progress-label')
    .attr('transform', `translate(${size.width/2},${size.height/2})`)
    .text('0')

  return {
    update: function(progressPercent) {
      const startValue = value
      const startAngle = Math.PI * startValue / 50
      const angleDiff = Math.PI * progressPercent / 50 - startAngle;
      const startAngleDeg = startAngle / Math.PI * 180
      const angleDiffDeg = angleDiff / Math.PI * 180
      const transitionDuration = 1500

      mainArcPath.transition().duration(transitionDuration).attrTween('d', function(){
        return function(t) {
          mainArc.endAngle(startAngle + angleDiff * t)
          return mainArc();
        }
      })
      end.transition().duration(transitionDuration).attrTween('transform', function(){
        return function(t) {
          return `translate(${size.width/2},${size.height/2})`+
            `rotate(${(startAngleDeg + angleDiffDeg * t)})`+
            `translate(0,-${outerRadius-thickness/2})`
        }
      })
      percentLabel.transition().duration(transitionDuration).tween('bla', function() {
        return function(t) {
          percentLabel.text(Math.round(startValue + (progressPercent - startValue) * t));
        }
      })
      value = progressPercent
    }
  }
}

window.onload=function(){
	var button = document.getElementById("calc");
	button.addEventListener("click",clickHandle);
        var numbers=[40, 130, 75, 170];
        var svg = d3.select("svg");

        var selection = svg.selectAll("g")
            .data(numbers)
            .enter().append("g")
            .attr("transform", (d,i) => {
                return "translate(" + 40*i + "," + (200-d) + ")"; });

        selection.append("rect")
            .attr("width", 39)
            .attr("height", (d,i) => {return d; });

        selection.append("text")
            .attr("x", 25)
            .attr("y", 25)
            .text((d) => {return d/10; });

        let chart = radialProgress('.widget')
        let progress = [100,0,5,20,35,70,90,100,0]
        let state = 0
        d3.interval(function(){
          chart.update(progress[state])
          state = (state + 1) % progress.length
        }, 2000)
}
