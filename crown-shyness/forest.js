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

  drawTrees() {
    for (let tree of this.trees) {
      tree.draw();
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

function getKey(x,y, polygonIndex) {
  let strX = x.toString();
  if(strX.length == 1) {
    strX = "000" + strX;
  } else if (strX.length == 2) {
    strX = "00" + strX;
  } else if (strX.length == 3) {
    strX = "0" + strX;
  }
  let strY = y.toString();
  if(strY.length == 1) {
    strY = "000" + strY;
  } else if (strY.length == 2) {
    strY = "00" + strY;
  } else if (strY.length == 3) {
    strY = "0" + strY;
  }
  let polygonIndexStr = polygonIndex.toString();
  if(polygonIndexStr.length == 1) { 
    polygonIndexStr = "0" + polygonIndexStr;
  }
  return strX + strY + polygonIndexStr;
}

function getVal(key) {
  return [parseInt(key.substring(0,4)), parseInt(key.substring(4,8)), parseInt(key.substring(8,10))];
}

export class Tree {
  constructor() {
    this.points   = [];
    this.envelope = [];
    this.polygons = [];
    this.color = getRandomColor(); 
    this.center;
    this.envelopePoints = [];
    this.faces = [];
  }

  createEnvelope() {
    let tmp = new Map();
    
    for (let polygon of this.polygons) {
      for (let point of polygon) {
        let key = getKey(point[0], point[1], this.polygons.indexOf(polygon));
        if(tmp.has(key)) {
          tmp.set(key, tmp.get(key) + 1);
        } else {
          tmp.set(key, 1);
        }
      }
      this.envelopePoints.push([]);
    }

    let avgX = 0;
    let avgY = 0;
    let cnt = 0;

    // remove inside points
    tmp.forEach((val, key) => {
      if(val < 3) {
        let x = getVal(key)[0];
        let y = getVal(key)[1];
        let polygonIndex = getVal(key)[2];
        this.envelope.push([x,y]);
        this.envelopePoints[polygonIndex].push([x,y]);
        avgX += x;
        avgY += y;
        cnt++;
      }
    });

    this.center = [avgX/cnt, avgY/cnt];
    // this.envelope.forEach(s => circle(s[0], s[1], 30));

    let toPoly = [];
    this.polygons.forEach(polygon => {
      toPoly.push( { regions: [polygon ], inverted: false} ) } );


    
  var segments = PolyBool.segments(toPoly[0]);
  for (var i = 1; i < toPoly.length; i++){
    var seg2 = PolyBool.segments(toPoly[i]);
    var comb = PolyBool.combine(segments, seg2);
    segments = PolyBool.selectUnion(comb);
  }


    beginShape();
    let x = PolyBool.polygon(segments).regions[0];
    console.log(x)

    fill(this.color);
    x.forEach(element => {
      vertex(element[0], element[1]); 
      line(element[0], element[1], this.center[0], this.center[1]);
    });
    endShape(CLOSE);
  }

  drawEnvelope() {

    // this.polygons.forEach(polygon => {
    //   polygon.forEach((p,i) => {
    //     if (this.envelopePoints.includes(p)) {
    //       line(polygon[i][0], polygon[i][1], 
    //         polygon[(i+1)%polygon.length][0], 
    //         polygon[(i+1)%polygon.length][1]);
    //     }
        
    //   })
    // });

    // for (let i = 0; i < this.envelopePoints[0].length; i++) {
    //   line(this.envelopePoints[0][i][0], this.envelopePoints[0][i][1], 
    //     this.envelopePoints[0][(i+1)%this.envelopePoints[0].length][0], 
    //     this.envelopePoints[0][(i+1)%this.envelopePoints[0].length][1]);
    // }

    circle(this.center[0], this.center[1], 10);
  }

  draw() {
    this.polygons.forEach( (polygon, i) => {
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