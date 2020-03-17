const pointSize = 40;


let mouse: p5.Vector;
let draggedPoint: Point = null;

let A: Point, B: Point, C: Point, X: Point, Y: Point, Z: Point;
let AB: Line, BC: Line, AC: Line, XY: Line, XZ: Line, YZ: Line;

function setup() {
    createCanvas(windowWidth, windowHeight);
    A = new Point(width * 0.2, height * 0.9, "A");
    B = new Point(width * 0.49, height * 0.8, "B");
    C = new Point(width * 0.3, height * 0.3, "C")
    AB = new Line(A, B, "AB");
    BC = new Line(B, C, "CB");
    AC = new Line(A, C, "AC");

    X = new Point(width * 0.6, height * 0.4, "X");
    Y = new Point(width * 0.65, height * 0.66, "Y");
    Z = new Point(width * 0.8, height * 0.2, "Z");
    XY = new Line(X, Y, "XY");
    XZ = new Line(X, Z, "XZ");
    YZ = new Line(Y, Z, "ZY");
}

function mouseReleased() {
    draggedPoint = null;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    mouse = createVector(mouseX, mouseY);

    background(255);

    let K = Point.fromVector(AC.getAtDistance(100, 2), "K");
    K.draw();
    let XZcopy = new Line(K, Point.fromVector(XZ.vector().add(K), "h"), "");
    let realXZcopy = new Line(K, XZcopy.intersection(BC, "l") as Point, "rxz");
    let XYcopy = new Line(K, Point.fromVector(XY.vector().add(K), "j"), "");
    let ZYcopy = new Line(realXZcopy.p2, Point.fromVector(YZ.vector().add(realXZcopy.p2), ""), "");
    let I = XYcopy.intersection(ZYcopy, "I") as Point;
    let realXYcopy = new Line(K, I, "rxy");
    let realZYcopy = new Line(realXZcopy.p2, I, "rzy");

    let nagyitoVonal = new Line(C, I, "n");
    let Y_vegleges = nagyitoVonal.intersection(AB, "Y'") as Point;
    let XY_metszo = new Line(Y_vegleges, Point.fromVector(Y_vegleges.copy().sub(XY.vector()), ""), "");
    let X_vegleges = XY_metszo.intersection(AC, "X'") as Point;
    let ZY_metszo = new Line(Y_vegleges, Point.fromVector(Y_vegleges.copy().add(YZ.vector()), ""), "");
    let Z_vegleges = ZY_metszo.intersection(BC, "Z'") as Point;

    let XZ_vegleges = new Line(X_vegleges, Z_vegleges, "XZ'");
    let XY_vegleges = new Line(X_vegleges, Y_vegleges, "XY'");
    let YZ_vegleges = new Line(Z_vegleges, Y_vegleges, "ZY'");

    ZY_metszo.drawLight();
    XY_metszo.drawLight();
    realXZcopy.drawLight();
    realXYcopy.drawLight();
    realZYcopy.drawLight();
    I.drawLight();
    nagyitoVonal.drawLight();

    AB.draw();
    BC.draw();
    AC.draw();
    XY.draw();
    XZ.draw();
    YZ.draw();

    XZ_vegleges.draw();
    XY_vegleges.draw();
    YZ_vegleges.draw();

}
