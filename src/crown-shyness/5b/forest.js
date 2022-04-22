// import p5 from "p5";
import * as d3 from 'd3';
import { Tree } from './tree';

export class Forest {
  constructor(width, height, cnt, radius = 40) {
    this.points = [];
    this.trees = [];
    this.areas = [];
    this.areaCoordinates = [];
    this.areasX;
    this.areasY;
    this.winX;
    this.winY;
    this.areaCnt; // tree count

    // get random points that are not closer that defined radius
    this.getPoints(width, height, cnt, radius);
    this.generate();
  }

  generate() {
    let offset = 10;
    const delaunay = d3.Delaunay.from(this.points);
    const voronoi = delaunay.voronoi([-offset, -offset, width+offset, height+offset])

    // initialize trees
    for(let i=0; i<this.areaCnt; i++) this.trees.push(new Tree());

    // get coordinates of all polygons and save them to corresponding tree
    for (let i = 0; i < this.points.length; i++) {
      let index = this.areas[i];
      let polygonCoordinates = [];
      for (let vt of voronoi.cellPolygon(i)) {
        polygonCoordinates.push([parseInt(vt[0]), parseInt(vt[1])]);
      }
      console.log(polygonCoordinates)
      this.trees[index].addPolygon(this.points[i], polygonCoordinates);
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
      let a = 0.2*cos(i+f)*noise(f)
      let b = 0.2*sin(f)*noise(f+i)
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
      tree.vertices.forEach((v,i) => {
          v[0] += 0.2*cos(f+i)*noise(f);
          v[1] += 0.2*sin(f)*noise(f+i);
      });
    });

  }

  drawAll() {
    stroke(152, 229, 245)
    background(0, 125, 30)
    strokeWeight(15)
    noFill()

    // this.drawEnvelopes()

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
    let maxNumberOfIterations = 10000;
    let iterations = 0;
    let min_tree_size = 300;
    let tree_size = width < height ? width : height;
    tree_size = min_tree_size < tree_size ? min_tree_size : tree_size;
    this.areasX = Math.floor(width / tree_size);
    this.areasY = Math.floor(height / tree_size);
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
