import vec3 from "./tsm/vec3";
import mat4 from "./tsm/mat4";

export class Camera {
    private _radius = 40;
    private _axisAngles = new vec3([0, 0, 0]);
    private _aspectRatio: number;
    private _fov = 45;
    private _zNear = 0.1;
    private _zFar = 1000;
    private _position = new vec3([0, 0, 8]);
    private _target: vec3;

    private _dX: number = 0;
    private _dY: number = 0;
    private _drag = false;

    constructor(canvas: HTMLCanvasElement, target: vec3) {
        this._aspectRatio = canvas.width / canvas.height;
        this._target = target;

        let old_x: number, old_y: number;

        const mouseDown = (e: MouseEvent) => {
            this._drag = true;
            old_x = e.pageX, old_y = e.pageY;
            e.preventDefault();
            return false;
        };

        const mouseUp = (e: MouseEvent) => this._drag = false;

        const mouseMove = (e: MouseEvent) => {
            if (!this._drag) return false;
            this._dX = e.pageX - old_x;
            this._dY = e.pageY - old_y;
            this._axisAngles.x += this._dX * Math.PI / canvas.width;
            this._axisAngles.y += this._dY * Math.PI / canvas.height;
            old_x = e.pageX, old_y = e.pageY;
            e.preventDefault();
        };

        const mouseScroll = (e: any) => {
            this._radius += e.deltaY * 0.01;

            if (this._radius < 10) {
                this._radius = 10;
            }

            if (this._radius > 60) {
                this._radius = 60;
            }
        }

        canvas.addEventListener("mousedown", mouseDown, false);
        canvas.addEventListener("mouseup", mouseUp, false);
        canvas.addEventListener("mouseout", mouseUp, false);
        canvas.addEventListener("mousemove", mouseMove, false);
        canvas.addEventListener("wheel", mouseScroll, false);
    }

    getProjection() {
        return mat4.perspective(this._fov, this._aspectRatio, this._zNear, this._zFar);
    }

    getView(target: vec3 = new vec3([0, 0, 0])) {
        return mat4.lookAt(this._position, this._target, new vec3([0, 1, 0]));
    }

    update() {
        this._position.x = Math.sin(this._axisAngles.x) * this._radius;
        this._position.z = Math.cos(this._axisAngles.x) * this._radius;
        this._position.y = Math.cos(this._axisAngles.y) * this._radius;

        this._position.add(this._target);
    }
}
