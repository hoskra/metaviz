import math

def getH(side):
  side * math.sqrt(3) / 2

o = 0.1
side = o
height = getH(side)
points = []
W = 0.33

i = -W
while i < W:
  j = -W
  while j <= W:
    points.append([ i, j ])
    points.append([ i + side / 2, j + math.sqrt(3) * side / 2 ])
    j += math.sqrt(3) * side
  i += side
p = []
arr = [1,2,3,9,10,11,12,13,17,18,19,20,21,22,23,25,26,27,28,29,30,31,33,34,35,36,37,38,41,42,43,44,50]
i = 0
while i < len(arr):
  p.append(points[arr[i]])
  i = i + 1

arr = [0,1,5,10,14,17,18,19,21,23,28,32]
points = []
i = 0
while i < len(arr):
  points.append(p[arr[i]])
  i = i + 1

size = 1
gg = []
gg.append([p[0][0],p[0][1],0],)
gg.append([p[1][0],p[1][1],0])
gg.append([p[23][0],p[23][1],0])
gg.append([p[18][0],p[18][1],0])
gg.append([p[19][0],p[19][1],0])
gg.append([p[28][0],p[28][1],0])
bb = []
bb.append([p[1][0],p[1][1],0])
bb.append([p[23][0],p[23][1],0])
bb.append([p[17][0],p[17][1],0])
bb.append([p[5][0],p[5][1],0])
bb.append([p[21][0],p[21][1],0])
bb.append([p[14][0],p[14][1],0])
rr = []
rr.append([p[28][0],p[28][1],0])
rr.append([p[32][0],p[32][1],0])
rr.append([p[21][0],p[21][1],0])
rr.append([p[5][0],p[5][1],0])
rr.append([p[10][0],p[10][1],0])
rr.append([p[19][0],p[19][1],0])

file = open("pen.txt", "w")
file.write("let gg = [\n")
for i in range(0, len(gg)):
  file.write("\tnew THREE.Vector3(" + str(gg[i][0]) + ", " + str(gg[i][1]) + ", " + str(gg[i][2]) + "),\n")
file.write("]\n")
file.write("let bb = [\n")
for i in range(0, len(bb)):
  file.write("\tnew THREE.Vector3(" + str(bb[i][0]) + ", " + str(bb[i][1]) + ", " + str(bb[i][2]) + "),\n")
file.write("]\n")
file.write("let rr = [\n")
for i in range(0, len(rr)):
  file.write("\tnew THREE.Vector3(" + str(rr[i][0]) + ", " + str(rr[i][1]) + ", " + str(rr[i][2]) + "),\n")
file.write("]\n")