import vec3 from "./tsm/vec3";
import mat4 from "./tsm/mat4";

export class Transform {
    position = new vec3([0, 0, 0]);
    scale = new vec3([1, 1, 1]);
    private _model: mat4;

    constructor(position: vec3, scale: vec3) {
        this.position = position;
        this.scale = scale;

        this._model = new mat4().setIdentity();
        this._model.translate(this.position);
        this._model.scale(this.scale);
    }

    getModelMatrix(): mat4 {
        return this._model;
    }

    rotate(angle: number, axis: vec3) {
        this._model.rotate(angle, axis);
    }

    rotateX(angle: number) {
        this._model.rotate(angle, new vec3([1, 0, 0]));
    }

    rotateY(angle: number) {
        this._model.rotate(angle, new vec3([0, 1, 0]));
    }

    rotateZ(angle: number) {
        this._model.rotate(angle, new vec3([0, 0, 1]));
    }

    translate(vector: vec3) {
        this.position.add(vector);
        this._model.translate(vector);
    }
 }
