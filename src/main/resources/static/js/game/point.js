class Point {
    x = 0;
    y = 0;
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    setXY(x, y){
        this.x = x;
        this.y = y;
    }
    assign(point){
        this.x = point.x;
        this.y = point.y;
    }
    isEqualto(point){
        if (this.x == point.x && this.y == point.y){
            return true;
        }
        return false;
    }
    distOnX(point){
        return Math.abs (this.x - point.x)
    }

    distOnY(point){
        return Math.abs (this.y - point.y)
    }
}