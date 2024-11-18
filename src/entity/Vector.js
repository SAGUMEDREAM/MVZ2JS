export class Vector {
    constructor(min, max, option) {
        if (min > max) {
            throw new Error("min should not be greater than max.");
        }
        this.vector = { min: min, max: max };
    }

    isIn(size) {
        return this.vector.min <= size && size <= this.vector.max;
    }

    getVector() {
        return this.vector;
    }
    overlapping (vector) {
        return (
            Vector.isOverlapping(this,vector)
        );
    }
    static create(min, max) {
        return new Vector(min,max);
    }
    static createVector(option) {
        let vector = new Vector(0,0);
        vector.vector = option;
        return vector;
    }
    static isOverlapping(vector1, vector2) {
        return (
            vector1.vector.min <= vector2.vector.max && vector1.vector.max >= vector2.vector.min
        );
    }
}