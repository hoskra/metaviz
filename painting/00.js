  import P5 from 'p5'

function setup() {
    // 800 x 400 (double width to make room for each "sub-canvas")
    createCanvas(800, 400);
    // Create both of your off-screen graphics buffers
    leftBuffer = createGraphics(400, 400);
    rightBuffer = createGraphics(400, 400);
}

function draw() {
    // Draw on your buffers however you like
    drawLeftBuffer();
    drawRightBuffer();
    // Paint the off-screen buffers onto the main canvas
    image(leftBuffer, 0, 0);
    image(rightBuffer, 400, 0);
}

function drawLeftBuffer() {

f=0

draw=_=>{
 f++||createCanvas(W=500,W)
 background(255)
 s=sqrt(3)
 F=f+9e3
 for(h=0;h<600;h+=50)
   for(w=-h*s;w<800;w+=100*s){

     // hexagon
     stroke(255)
     strokeWeight(15)
     beginShape()
     for(i=0;i<6;i+=PI/3){
       r=100/s
       vertex(w+r*cos(i),h+r*sin(i))
     }
     endShape(CLOSE)
     r+=10 

     // // circle
     // fill(0)
     // circle(w,h,50)  
     
     // arcs
     noStroke()
     fill(255)
     off=PI/15
     arc(w, h-7, 70, 50, 0+off, PI-off)
     arc(w, h+7, 70, 50, PI+off, TAU-off)
     
     // eyes
     fill(0)
     v2 = createVector(mouseX-w,mouseY-h);
     push()
     translate(w,h)
     d=map(dist(w,h,mouseX, mouseY),0, 500, 0, 10)
     angle=-atan2(v2.x, v2.y)+PI/5
     rotate(angle)
     circle(d,d, 30)
     pop()
   }
}

}
