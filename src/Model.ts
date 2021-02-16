import {WebGL} from "./GLContext";
import {Texture} from "./Texture";

export class Model {
    private _vertexBuffer:  WebGLBuffer | null;
    private _indexBuffer:  WebGLBuffer | null;
    private _arrayBuffer: WebGLVertexArrayObject | null;
    private _triangleCount = 0;
    private _textures: Texture[];

    constructor(vertices: number[], indices: number[], textures: Texture[]) {
        this._vertexBuffer = WebGL.context.createBuffer();
        this._indexBuffer = WebGL.context.createBuffer();
        this._arrayBuffer = WebGL.context.createVertexArray();
        this._textures = textures;
        this._triangleCount = indices.length;

        if (!this._vertexBuffer || !this._indexBuffer || !this._arrayBuffer) {
            throw new Error('Failed to create model');
        }


        WebGL.context.bindVertexArray(this._arrayBuffer);

        WebGL.context.bindBuffer(WebGL.context.ARRAY_BUFFER, this._vertexBuffer);
        WebGL.context.bufferData(WebGL.context.ARRAY_BUFFER, new Float32Array(vertices), WebGL.context.STATIC_DRAW);
        WebGL.context.enableVertexAttribArray(0);
        WebGL.context.vertexAttribPointer(0, 3, WebGL.context.FLOAT, false, 4 * (3 + 3 + 2), 0);
        WebGL.context.enableVertexAttribArray(1);
        WebGL.context.vertexAttribPointer(1, 3, WebGL.context.FLOAT, false, 4 * (3 + 3 + 2), 3 * 4);
        WebGL.context.enableVertexAttribArray(2);
        WebGL.context.vertexAttribPointer(2, 2, WebGL.context.FLOAT, false, 4 * (3 + 3 + 2), (3 + 3) * 4);

        WebGL.context.bindBuffer(WebGL.context.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        WebGL.context.bufferData(WebGL.context.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), WebGL.context.STATIC_DRAW);

        WebGL.context.bindVertexArray(null);
    }

    render(func: Function = () => {}) {
        func();
        this._textures.forEach((text, indx) => {
        // @ts-ignore
        WebGL.context.activeTexture(WebGL.context[`TEXTURE${indx}`]);
        WebGL.context.bindTexture(WebGL.context.TEXTURE_2D, text.get());
        });

        WebGL.context.bindVertexArray(this._arrayBuffer);
        WebGL.context.drawElements(WebGL.context.TRIANGLES, this._triangleCount, WebGL.context.UNSIGNED_INT, 0);
        WebGL.context.bindVertexArray(null);
    }

    static createPlane(width: number, texture: Texture): Model {
        const floor_vertices = [
            -width, 0, -width, 0, 1, 0, 0, 0, //1st point position,normal and UV
            -width, 0, width, 0, 1, 0, 0, 1, //2nd point
            width, 0, width, 0, 1, 0, 1, 1,
            width, 0, -width, 0, 1, 0, 1, 0
        ];

        const floor_indices = [0, 1, 2, 0, 2, 3]; // Uint16
        return new Model(floor_vertices, floor_indices, [texture]);
    }

    static createCube(width: number, texture: Texture) : Model {
        const vertices = [
            -width,-width,width, 0,0,1,   0,0,
            width,-width,width,  0,0,1,   1,0,
            width,width,width,  0,0,1,   1,1,
            -width,width,width, 0,0,1,   0,1,

            -width,-width,-width, 0,0,-1,   0,0,
            -width,width,-width,  0,0,-1,   1,0,
            width,width,-width,  0,0,-1,   1,1,
            width,-width,-width, 0,0,-1,   0,1,

            -width,width,-width, 0,1,0,   0,0,
            -width,width,width, 0,1,0,   1,0,
            width,width,width, 0,1,0,   1,1,
            width,width,-width, 0,1,0,   0,1,

            -width,-width,-width,  0,-1,0,   0,0,
            width,-width,-width,  0,-1,0,   1,0,
            width,-width,width,  0,-1,0,   1,1,
            -width,-width,width,  0,-1,0,   0,1,

            width,-width,-width, 1,0,0,   0,0,
            width,width,-width, 1,0,0,   1,0,
            width,width,width,  1,0,0,   1,1,
            width,-width,width,  1,0,0,   0,1,

            -width,-width,-width, -1,0,0,   0,0,
            -width,-width,width, -1,0,0,   1,0,
            -width,width,width,  -1,0,0,   1,1,
            -width,width,-width  -1,0,0,   0,1
        ];

        const indices = [
            0,1,2,
            0,2,3,

            4,5,6,
            4,6,7,

            8,9,10,
            8,10,11,

            12,13,14,
            12,14,15,

            16,17,18,
            16,18,19,

            20,21,22,
            20,22,23
        ];

        return new Model(vertices, indices, [texture]);
    }
}
