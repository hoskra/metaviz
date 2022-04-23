import * as d3 from 'd3';

export function getPoints (width, height, cnt, radius = 40) {
  // based on: https://www.youtube.com/watch?v=XATr_jdh-44&ab_channel=TheCodingTrain
  let circles = [];
  let points = [];
  let maxNumberOfIterations = 10000;
  let iterations = 0;

  for(let i=0; circles.length < cnt; i++) {
    let circle = {
      x: random(width),
      y: random(height),
      r: random(radius, radius*1.2)
    }
    let overlapping = false;
    for (let j=0; j<circles.length; j++) {
      if (iterations > maxNumberOfIterations) break;
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
    }
  }
  return points;
}

export function getPolygons(points, W = width, H = height, offset = 0) {
  let polygons = [];
  const delaunay = d3.Delaunay.from(points);
  const voronoi = delaunay.voronoi([-W*offset, -H*offset, W*(1+offset), H*(1+offset)])

  for (let i = 0; i < points.length; i++) {
    let polygon = [];
    let center = points[i];

    for (let vt of voronoi.cellPolygon(i)) {
      let x = center[0]+(vt[0]-center[0]) * 0.9
      let y = center[1]+(vt[1]-center[1]) * 0.9

      polygon.push([x,y]);
    }
    polygons.push(polygon);
  }

  return polygons;
}

export class ColorTheme {
  constructor() {
    this.choice = floor(random(0, 5));
  }
  setFill(i, cnt) {
    let b = (i*10);
    let m = map(i, 0, cnt, 100, 225);

    switch(this.choice) {
      case 0: fill(m); break;
      case 1: fill(140, b, b/10); break;
      case 2: fill(b, b/10, 140); break;
      case 3: fill(b/10, b, 140); break;
      case 4: fill(100, m, 100); break;
    }
  }
  setBackground() {
    if(!this.choice) { background(255) }
    else {background(152, 229, 245)}
  }
}
