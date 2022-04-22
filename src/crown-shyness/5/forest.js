// import p5 from "p5";
import { getRandomColor } from "../utils";
import PolyBool from "polybooljs";
import * as d3 from 'd3';
import { Delaunay } from 'd3-delaunay';

// ?? polybooljs.v1.2.0.js:784 Uncaught (in promise) Error: PolyBool: Zero-length segment detected; your epsilon is probably too small or too large
export class Forest {
  constructor(width, height, cnt) {
    this.getPoints(width, height, cnt, 80);
    this.generate();
  }
  generate() {
    this.trees = [];
    let offset = 0.9;
    const delaunay = d3.Delaunay.from(this.points);
    const voronoi = delaunay.voronoi([-width*offset, -height*offset, width*(1+offset), height*(1+offset)])

    for(let i=0; i<this.areaCnt; i++) this.trees.push(new Tree());

    for (let i = 0; i < this.points.length; i++) {
      let index = this.areas[i];

      let polygon = [];
      for (let vt of voronoi.cellPolygon(i)) {
        polygon.push([Math.floor(vt[0]), Math.floor(vt[1])]);
      }

      this.trees[index].points.push( this.points[i] );
      this.trees[index].polygons.push( polygon );
    }
    for(let i=0;i<this.areaCnt;i++) {
      this.trees[i].center[0] = this.areaCoordinates[i].xMin + (this.areaCoordinates[i].xMax - this.areaCoordinates[i].xMin)/2;
      this.trees[i].center[1] = this.areaCoordinates[i].yMin + (this.areaCoordinates[i].yMax - this.areaCoordinates[i].yMin)/2;
    }
    this.createEnvelopes();
  }
  moveAndRegenerate(f) {
    for (let i = 0; i < this.points.length; i++) {
      let x = this.points[i][0];
      let y = this.points[i][1];

      // dont run away from area
      let ar = this.areaCoordinates[this.areas[i]];
      let can = x > ar.xMin && x < ar.xMax && y > ar.yMin && y < ar.yMax;
      if(!can) continue;

      // dont come near another point
      let a = 0.6*cos(frameCount*0.01) *noise(frameCount*0.01);
      let b = 0.6*sin(frameCount*0.01) *noise(frameCount*0.01);
      for (let j=0; j<this.points.length; j++) {
        if(i == j) continue;
        let other = this.points[j];
        let d = dist(x, y, other[0], other[1])
        if (d < 40) {
          can = false;
          break;
        }
      }

      if (can) {
        this.points[i][0] += a;
        this.points[i][1] += b;
      }
    }
    this.generate();
  }
  move(f) {

    this.trees.forEach(tree => {
      tree.polygons.forEach(polygon => {
        polygon.forEach((v,i) => {
          v[0] += 0.2*cos(f+i)*noise(f);
          v[1] += 0.2*sin(f)*noise(f+i);
        });
      });
    });

  }
  drawAll() {
    stroke(152, 229, 245)
    background(0, 125, 30)

    strokeWeight(30)
    this.drawEnvelopes()

    strokeWeight(1)
    this.drawTrees(false);

    // draw areas
    // this.areaCoordinates.forEach(c => {
    //   line(c.xMin, c.yMin, c.xMin, c.yMax);
    //   line(c.xMin, c.yMin, c.xMax, c.yMin);
    //   line(c.xMax, c.yMin, c.xMax, c.yMax);
    //   line(c.xMin, c.yMax, c.xMax, c.yMax);
    // });
  }

  drawTrees(color = true) {
    for (let tree of this.trees) {
      tree.draw(color);
    }
  }

  createEnvelopes() {
    for (let tree of this.trees) {
      tree.createEnvelope();
    }
  }

  drawEnvelopes() {
    noFill()
    this.trees.forEach((tree, i) => {
      tree.drawEnvelope();
    });
  }

  drawThrunks() {
    for (let tree of this.trees) {
      tree.drawBasicThrunk();
    }
  }

  getPoints (width, height, cnt, radius) {
    // based on: https://www.youtube.com/watch?v=XATr_jdh-44&ab_channel=TheCodingTrain
    let circles = [];
    this.points = [];
    this.areas = [];
    let maxNumberOfIterations = 10000;
    let iterations = 0;
    let min_tree_size = 400;
    let tree_size = width < height ? width : height;
    tree_size = min_tree_size < tree_size ? min_tree_size : tree_size;
    this.areasX = Math.floor(width / tree_size);
    this.areasY = Math.floor(height / tree_size);

    if(this.areasX % 2) this.areasX++;
    if(this.areasY % 2) this.areasY++;

    this.winX = width / this.areasX;
    this.winY = height / this.areasY;
    this.areaCnt = this.areasX * this.areasY;

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
        this.points.push([circle.x, circle.y])
        let x = Math.floor(circle.x / this.winX)
        let y = Math.floor(circle.y / this.winY) * this.areasX;
        this.areas.push(x+y);
      }
    }
    this.areaCoordinates = [];
    for (let i=0; i<this.areaCnt; i++) {
      let x = i % this.areasX;
      let y = Math.floor(i / this.areasX);
      let xMin = x * this.winX;
      let yMin = y * this.winY;
      let xMax = xMin + this.winX;
      let yMax = yMin + this.winY;

      this.areaCoordinates.push({xMin, yMin, xMax, yMax});
    }
  }
}
export class Tree {
  constructor() {
    this.points   = [];
    this.polygons = [];
    this.color = getRandomColor();
    this.faces = [];
    this.polygon;
    this.center = [0, 0];
    this.far = -500;
  }

  createEnvelope() {
    let toPoly = [];
    this.polygons.forEach(polygon => {
      toPoly.push( { regions: [polygon ], inverted: false} )
    });

    var segments = PolyBool.segments(toPoly[0]);
    for (var i = 1; i < toPoly.length; i++){
      var seg2 = PolyBool.segments(toPoly[i]);
      var comb = PolyBool.combine(segments, seg2);
      segments = PolyBool.selectUnion(comb);
    }

    this.polygon = PolyBool.polygon(segments).regions[0];
  }

  drawEnvelope() {
    beginShape();
    this.polygon.forEach(v => vertex(v[0], v[1], this.far));
    endShape(CLOSE);
  }

  draw(color = true) {
    this.polygons.forEach( (polygon, i) => {
      if(color)
        fill(this.color);
      // fill(100,map(i,0,this.polygons.length,140,255),100)
      beginShape();
      for (let p of polygon) {
        vertex(p[0], p[1], this.far);
      }
      endShape(CLOSE);
    });
  }

  drawBasicThrunk() {

    push();
    translate(this.center[0], this.center[1], 500);
    let a = 0.007*cos(frameCount*0.01);
    let b = 0.007*sin(frameCount*0.01);
    rotateZ(a);
    rotateX(b);
    rotateX(3*PI/2);

    strokeWeight(10);
    stroke(0)
    beginShape();
    vertex(0, 0, 0);
    translate(a, b, 0);
    vertex(0, 600, 0);
    endShape();

    this.points.forEach(p => {
      beginShape();
      vertex(0, 600, 0);
      vertex(p[0] - this.center[0], 1000, p[1] - this.center[1]);
      endShape();
    });

    pop()

    push();
    translate(0,0, this.far);
    pop()

    // box(500, 70, 70);
    // cone(20, 700);


  }
}