/*
Class CPenrose
  @ params: length of inner triangle side

  Triangle:   Vectors:
       C         u = B - A;
      / \        v = C - B;
    A  -- B      w = A - C;

Points were found as a result of this process:
  Penrose1 https://editor.p5js.org/hoskra/sketches/VZYFBnO7L
  Penrose2 https://editor.p5js.org/hoskra/sketches/nautqdoxj
  Penrose3 https://editor.p5js.org/hoskra/sketches/Wrje3nVsJ

  */
export class CPenrose {
  constructor(side = 50) {
    /* height of equilateral triangle
          C
        / |
       /  | height
      /   |
    A -- D
    side/2

    equilateral triangle's alpha = 360°/3 = 60°

    tan(60) = height/(side/2)
    height  = side/2 * tan(60)
    height  = side * sqrt(3)/2
    */
    this.h = side * Math.sqrt(3)/2

    // triangle coordinates
    this.A = [-side/2 , this.h/3];
    this.B = [side/2  , this.h/3];
    this.C = [0       , -2*this.h/3];

    // vectors
    this.u = [this.B[0] - this.A[0], this.B[1] - this.A[1]];
    this.v = [this.C[0] - this.B[0], this.C[1] - this.B[1]];
    this.w = [this.A[0] - this.C[0], this.A[1] - this.C[1]];

    // an example of linar combination generating penrose triangle
    this.points = [[ 0,  0,  0],
                   [ 0,  0, -2],
                   [ 2, -2,  0],
                   [ 3, -1,  0],
                   [ 0, 1,  -3],
                   [-1,  0,  0],
                   [ 0,  0,  0]]
  }

  // @origin:   - point
  //            - coordinates will be shifted to start from origin
  // @a, b, c:  - vectors
  //            - by changing the order of vectors,
  //                we generate rotated shapes
  getCoordinates(origin, a, b, c) {
    let shape = [];
    this.points.forEach(p => {
      let tmp = [origin[0], origin[1]];

      // add linear
      tmp[0] += p[0]*a[0];  tmp[1] += p[0]*a[1];
      tmp[0] += p[1]*b[0];  tmp[1] += p[1]*b[1];
      tmp[0] += p[2]*c[0];  tmp[1] += p[2]*c[1];
      shape.push(new THREE.Vector3(tmp[0], tmp[1], 0));
    });

    return shape;
  }

  getA() {
    return this.getCoordinates(this.A, this.u, this.v, this.w);
  }

  getB() {
    return this.getCoordinates(this.B, this.v, this.w, this.u);
  }

  getC() {
    return this.getCoordinates(this.C, this.w, this.u, this.v);
  }
}