// import p5 from "p5";
import { getRandomColor } from "./utils";
import polybooljs from "polybooljs";
import PolyBool from "polybooljs";

export class Forest {
  constructor(points, areas, areaCnt, voronoi) {
    this.trees = [];
    for(let i=0; i<areaCnt; i++) {
      this.trees.push(new Tree());
    }

    for (let i = 0; i < points.length; i++) {
      let index = areas[i];

      let polygon = [];
      for (let vt of voronoi.cellPolygon(i)) {
        polygon.push([Math.floor(vt[0]), Math.floor(vt[1])]);
      }

      this.trees[index].points.push( points[i] );
      this.trees[index].polygons.push( polygon );
    }
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
    for (let tree of this.trees) {
      tree.drawEnvelope();
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
    this.polygon.forEach(element => {
      vertex(element[0], element[1]); 
    });
    endShape(CLOSE);
  }

  draw(color = true) {
    this.polygons.forEach( (polygon, i) => {
      if(color)
        fill(this.color);
      beginShape();
      for (let p of polygon) {
        vertex(p[0], p[1]);
      }
      endShape(CLOSE);
    });

    this.points.forEach( (p, i) => {
      ellipse(p[0], p[1], 5, 5);
    })

  }
}