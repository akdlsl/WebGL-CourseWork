import {WebGL} from "./GLContext";
import {Texture} from "./Texture";

export class Model {
    private _vertexBuffer:  WebGLBuffer | null;
    private _indexBuffer:  WebGLBuffer | null;
    private _arrayBuffer: WebGLVertexArrayObject | null;
    private _triCount = 0;
    private _textures: Texture[];

    constructor(vertices: number[], indices: number[], textures: Texture[]) {
        this._vertexBuffer = WebGL.context.createBuffer();
        this._indexBuffer = WebGL.context.createBuffer();
        this._arrayBuffer = WebGL.context.createVertexArray();
        this._textures = textures;
        this._triCount = indices.length;

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

    render() {
        this._textures.forEach((text, indx) => {
        // @ts-ignore
        WebGL.context.activeTexture(WebGL.context[`TEXTURE${indx}`]);
        WebGL.context.bindTexture(WebGL.context.TEXTURE_2D, text.get());
        });

        WebGL.context.bindVertexArray(this._arrayBuffer);
        WebGL.context.drawElements(WebGL.context.TRIANGLES, this._triCount, WebGL.context.UNSIGNED_INT, 0);
        WebGL.context.bindVertexArray(null);
    }
}
