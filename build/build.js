class Circle {
    constructor(o, r) {
        this.o = o;
        this.r = r;
    }
    draw() {
        this.o.draw();
        strokeWeight(3);
        stroke(0);
        fill(0, 0, 255, 10);
        ellipse(this.o.x, this.o.y, this.r * 2, this.r * 2);
    }
    drawLight() {
        this.o.drawLight();
        strokeWeight(1);
        stroke(0);
        fill(0, 0, 255, 10);
        ellipse(this.o.x, this.o.y, this.r * 2, this.r * 2);
    }
    intersection(line) {
        const a = line.getA();
        const b = line.getB();
        let points = [];
        points.push(new Point((-a * b + a * this.o.y + this.o.x + sqrt(this.r * this.r + a * a * this.r * this.r + 2 * a * this.o.y * this.o.x + 2 * b * this.o.y - a * a * this.o.x * this.o.x - 2 * a * b * this.o.x - b * b - this.o.y * this.o.y)) / (a * a + 1), NaN, "1"));
        points.push(new Point((-a * b + a * this.o.y + this.o.x + sqrt(this.r * this.r + a * a * this.r * this.r + 2 * a * this.o.y * this.o.x + 2 * b * this.o.y - a * a * this.o.x * this.o.x - 2 * a * b * this.o.x - b * b - this.o.y * this.o.y)) / (a * a + 1), NaN, "2"));
        points.push(new Point((-a * b + a * this.o.y + this.o.x - sqrt(this.r * this.r + a * a * this.r * this.r + 2 * a * this.o.y * this.o.x + 2 * b * this.o.y - a * a * this.o.x * this.o.x - 2 * a * b * this.o.x - b * b - this.o.y * this.o.y)) / (a * a + 1), NaN, "3"));
        points.push(new Point((-a * b + a * this.o.y + this.o.x - sqrt(this.r * this.r + a * a * this.r * this.r + 2 * a * this.o.y * this.o.x + 2 * b * this.o.y - a * a * this.o.x * this.o.x - 2 * a * b * this.o.x - b * b - this.o.y * this.o.y)) / (a * a + 1), NaN, "4"));
        points[0].y = this.o.y + sqrt(this.r * this.r - pow(points[0].x - this.o.x, 2));
        points[1].y = this.o.y - sqrt(this.r * this.r - pow(points[0].x - this.o.x, 2));
        points[2].y = this.o.y + sqrt(this.r * this.r - pow(points[2].x - this.o.x, 2));
        points[3].y = this.o.y - sqrt(this.r * this.r - pow(points[2].x - this.o.x, 2));
        return points.filter((p, index) => {
            return p.x !== NaN && p.y !== NaN && abs(a * p.x + b - p.y) <= 0.01;
        });
    }
}
class Line {
    constructor(p1, p2, name) {
        this.p1 = p1;
        this.p2 = p2;
        this.name = name;
    }
    getAtDistance(distance, pointNumber) {
        let vect = this.p2.copy().sub(this.p1);
        vect.normalize();
        vect.mult(distance);
        if (pointNumber == 2) {
            return this.p2.copy().sub(vect);
        }
        return this.p1.copy().add(vect);
    }
    vector() {
        return p5.Vector.sub(this.p2, this.p1);
    }
    length() {
        return this.p2.dist(this.p1);
    }
    getA() {
        return (this.p2.y - this.p1.y) / (this.p2.x - this.p1.x + 0.01);
    }
    getB() {
        return this.p1.y - this.p1.x * this.getA();
    }
    perpendicularLineAtPoint(P) {
        return new Line(P, Point.fromVector(P.copy().add(1, -1 / this.getA()), ""), "");
    }
    intersection(other, name) {
        if (name) {
            const i = this.intersection(other);
            return Point.fromVector(i, name);
        }
        const a1 = this.getA();
        const b1 = this.getB();
        const a2 = other.getA();
        const b2 = other.getB();
        const x = (b1 - b2) / (a2 - a1 + 0.00001);
        const y = a2 * x + b2;
        return createVector(x, y);
    }
    draw() {
        stroke(0);
        strokeWeight(3);
        line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
        noStroke();
        fill(0);
        textSize(20);
        text(this.name, p5.Vector.add(this.p1, this.p2).div(2).x, p5.Vector.add(this.p1, this.p2).div(2).y);
        this.p1.draw();
        this.p2.draw();
    }
    drawLight() {
        strokeWeight(1);
        stroke(128);
        line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
    }
}
class Point extends p5.Vector {
    constructor(x, y, name, mColor) {
        super();
        this.x = x;
        this.y = y;
        this.name = name;
        this.mColor = mColor;
    }
    static fromVector(p, name) {
        return new Point(p.x, p.y, name);
    }
    drawLight() {
        fill(0);
        noStroke();
        ellipse(this.x, this.y, pointSize / 4, pointSize / 4);
    }
    draw() {
        noStroke();
        if (!this.mColor)
            fill(10, 30, 255, 200);
        else
            fill(this.mColor);
        ellipse(this.x, this.y, pointSize / 2, pointSize / 2);
        if (this.dist(mouse) <= pointSize) {
            fill(10, 30, 255, 20);
            ellipse(this.x, this.y, pointSize, pointSize);
        }
        noStroke();
        textSize(20);
        fill(0);
        text(this.name, this.x + width / 40, this.y + width / 40);
        if (mouseIsPressed && draggedPoint == null && this.dist(mouse) <= pointSize / 2) {
            draggedPoint = this;
        }
        if (draggedPoint == this) {
            this.x = mouse.x;
            this.y = mouse.y;
        }
    }
}
const pointSize = 40;
let mouse;
let draggedPoint = null;
let A, B, C, X, Y, Z;
let AB, BC, AC, XY, XZ, YZ;
function setup() {
    createCanvas(windowWidth, windowHeight);
    A = new Point(width * 0.2, height * 0.9, "A");
    B = new Point(width * 0.49, height * 0.8, "B");
    C = new Point(width * 0.3, height * 0.3, "C");
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
    let realXZcopy = new Line(K, XZcopy.intersection(BC, "l"), "rxz");
    let XYcopy = new Line(K, Point.fromVector(XY.vector().add(K), "j"), "");
    let ZYcopy = new Line(realXZcopy.p2, Point.fromVector(YZ.vector().add(realXZcopy.p2), ""), "");
    let I = XYcopy.intersection(ZYcopy, "I");
    let realXYcopy = new Line(K, I, "rxy");
    let realZYcopy = new Line(realXZcopy.p2, I, "rzy");
    let nagyitoVonal = new Line(C, I, "n");
    let Y_vegleges = nagyitoVonal.intersection(AB, "Y'");
    let XY_metszo = new Line(Y_vegleges, Point.fromVector(Y_vegleges.copy().sub(XY.vector()), ""), "");
    let X_vegleges = XY_metszo.intersection(AC, "X'");
    let ZY_metszo = new Line(Y_vegleges, Point.fromVector(Y_vegleges.copy().add(YZ.vector()), ""), "");
    let Z_vegleges = ZY_metszo.intersection(BC, "Z'");
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
//# sourceMappingURL=build.js.map