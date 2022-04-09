function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getPoints (width, height, cnt, radius=40) {
  // based on: https://www.youtube.com/watch?v=XATr_jdh-44&ab_channel=TheCodingTrain
  let circles = [];
  let points = [];
  let areas = [];
  let maxNumberOfIterations = 10000;
  let iterations = 0;
  let min_tree_size = 300;
  let tree_size = W < H ? W : H;
  tree_size = min_tree_size < tree_size ? min_tree_size : tree_size;
  let areasX = Math.floor(W / tree_size);
  let areasY = Math.floor(H / tree_size);
  let winX = width / areasX;
  let winY = height / areasY;
  let areaCnt = areasX * areasY;

  for(let i=0; circles.length < cnt; i++) {
    let circle = {
      x: random(width),
      y: random(height),
      r: random(radius, radius*1.2)
    } 

    let overlapping = false;

    for (let j=0; j<circles.length; j++) {

      if (iterations > maxNumberOfIterations) {
        break;
      }

      let other = circles[j];
      let d = dist(circle.x, circle.y, other.x, other.y)
      if (d < circle.r + other.r) {
        overlapping = true;
        break;
      }
      iterations++;
    }

    if (iterations > maxNumberOfIterations) {
      console.log("max number of iterations reached, " + circles.length + " points generated"); 
      break;
    }
    
    if (!overlapping) {
      circles.push(circle) 
      points.push([circle.x, circle.y])
      let x = Math.floor(circle.x / winX)
      let y = Math.floor(circle.y / winY) * areasX;
      areas.push(x+y);
    }
  }

  for(let i = 0; i < areaCnt; i++) 
    colors.push(getRandomColor())

  return  {areas, points, colors };
}