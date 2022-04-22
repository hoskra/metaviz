import PolyBool from "polybooljs";

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

class TreePolygon {
  constructor(centerCoordinates) {
    this.center = centerCoordinates;
    this.indices = [];
  }
}

export class Tree {
  constructor() {
    this.vertices = [];
    this.polygons = [];

    this.envelopePoints = [];
    this.center;

    this.color = getRandomColor();
  }

  addPolygon(center, vertices) {
    let tp = new TreePolygon(center);
    vertices.forEach(v => {
      let i = 0;
      for(; i<this.vertices.length; i++) {
        if(v[0] == this.vertices[i][0] && v[1] == this.vertices[i][1]) {
          tp.indices.push(i);
          break;
        }
      }
      if(i == this.vertices.length) {
        this.vertices.push([parseInt(v[0]), parseInt(v[1])]);
        tp.indices.push(i);
      }
    })

    this.polygons.push(tp);
  }

  getCoordinatesFromIndices(index) {
    let coordinates = [];
    this.polygons[index].indices.forEach(i => {
      coordinates.push(this.vertices[i]);
    });
    return coordinates;
  }

  createEnvelope() {
    console.log(this.vertices)

    let toPoly = [];
    this.polygons.forEach((polygon, i) => {
      let coordinatesFromIndeces = this.getCoordinatesFromIndices(i);
      toPoly.push( { regions: [ coordinatesFromIndeces ], inverted: false} )
    });

    var segments = PolyBool.segments(toPoly[0]);
    for (var i = 1; i < toPoly.length; i++){
      var seg2 = PolyBool.segments(toPoly[i]);
      var comb = PolyBool.combine(segments, seg2);
      segments = PolyBool.selectUnion(comb);
    }

    this.envelopePoints = PolyBool.polygon(segments).regions[0];
    let avgX = 0;
    let avgY = 0;
    this.envelopePoints.forEach(element => {
      avgX += element[0];
      avgY += element[1];
    });
    this.center = [avgX/this.envelopePoints.length, avgY/this.envelopePoints.length];
  }

  drawEnvelope() {
    beginShape();
    this.envelopePoints.forEach(v => vertex(v[0], v[1]));
    endShape(CLOSE);
  }

  draw(color = true) {
    this.polygons.forEach( (polygon, i) => {
      let coordinatesFromIndeces = this.getCoordinatesFromIndices(i);

      if(color)
        fill(this.color);
      beginShape();
      for (let p of coordinatesFromIndeces) {
        vertex(p[0], p[1]);
      }
      endShape(CLOSE);
      ellipse(polygon.center[0], polygon.center[1], 5, 5);
    });

  }

  drawBasicThrunk() {
    let base = [this.center[0]+20, this.center[1] + 1000]
    let direction = [base[0] - this.center[0], base[1] - this.center[1]];

    // fill(36, 18, 10);
    // line(base[0], base[1], base[0] - direction[0], base[1] - direction[1]);

    strokeWeight(1);
    stroke(0)
    // noStroke()
    // fill(36, 18, 10);
    noFill()
    circle(this.center[0], this.center[1], 10);
    circle(base[0], base[1], 10);

    for(let i=0; i < 50; i++) {
      let x = this.center[0] + direction[0] * i/50 +noise(i*10)*20;
      let y = this.center[1] + direction[1] * i/50 +noise(i*10)*20;
      direction = [base[0] - x, base[1] - y];
      circle(x, y, (2+i/4)*random(7, 8));
    }

  }
}