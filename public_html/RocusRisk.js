/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



function clickHandle() {
    
    var name = document.getElementById("name");
    var comp = document.getElementById("company");
    var mail = document.getElementById("emailA");
    
    var contact = name.value;
    var company = comp.value;
    var email = mail.value;
    
    if (contact == NaN || company == NaN || email == NaN) {
                alert("You must input your contact information to get a risk assessment");
                window.location.reload(true);
            }
    
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

    if (isNaN(r) || isNaN(ep) || isNaN(c) || isNaN(p) || isNaN(l)) {
        alert("Please input only numbers, and do not use commas or symbols such as $ or %.");
        window.location.reload(true);
    }
	
    var probability = (0.01024*ep)-(0.00000004345*r)+(0.0000264*c)-(0.01087*p)+0.211;    
    if (probability > 1 && probability <= 1.05){
	probability = 1;
    }
    if (probability < 0 && probability >= -0.05) {
	probability=0;
    }
	//console.log(probability);
    var cost = l*r;
    var rocusPrice = 50*p;
    var probSuccessAttack =45.5;
    if (c < 15000 && c > 1500){
        probSuccessAttack = -0.000003 * c + 0.455;
    }
    if (c < 1500) {
        probSuccessAttack = 0.41;
    }
    probability = probability.toFixed(2);
    document.getElementById("prob").value = probability;
    //var p = probability;
    console.log(p);
    var costW = c+0.001*probability*cost + rocusPrice;
    var costWO = c+probSuccessAttack*probability*cost;
    document.getElementById("costWith").value = costW.toFixed(0);
    document.getElementById("costWithout").value = costWO.toFixed(0);
    
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
            console.log("here");
            if (clicked === false) {
                clicked = true;
                chart = radialProgress('.widget');
            }
            
            var p = document.getElementById("prob");
            pval = p.value * 100;
            //pval = p*100;
            
            console.log(p);
            if (pval > 105 || pval < -5) {
                alert("Your company characteristics are outside the bounds of Rocus' current customers, so we cannot definitively calculate your risk.");
                window.location.reload(true);
            }
            
            let progress = [pval];
            let state = 0;
            d3.interval(function(){
            chart.update(pval);
                //state = (state + 1) % progress.length
            }, 2000);
            
        });
        
};

var clicked = false;
var pval = 0;
var progress=[pval];

