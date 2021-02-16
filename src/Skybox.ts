import {ShaderProgram} from "./ShaderProgram";
import {CubeTexture} from "./Texture";
import {WebGL} from "./GLContext";
import {ShaderVariable} from "./Contstant";
import {Camera} from "./Camera";

const vertices = [-1.0,  1.0, -1.0,
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0,  1.0, -1.0,
    -1.0,  1.0, -1.0,

    -1.0, -1.0,  1.0,
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
    -1.0, -1.0,  1.0,

    1.0, -1.0, -1.0,
    1.0, -1.0,  1.0,
    1.0,  1.0,  1.0,
    1.0,  1.0,  1.0,
    1.0,  1.0, -1.0,
    1.0, -1.0, -1.0,

    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    1.0,  1.0,  1.0,
    1.0,  1.0,  1.0,
    1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    -1.0,  1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0,  1.0,  1.0,
    1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,

    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    1.0, -1.0,  1.0];

export class Skybox {
    private _shaderProgramSkybox: ShaderProgram;
    private _vertexBuffer: WebGLBuffer | null;
    private _arrayBuffer: WebGLVertexArrayObject | null;
    private _cubeTexture: CubeTexture;

    constructor(cubeTexture: CubeTexture, sourceVert: string, sourceFrag: string) {
        this._shaderProgramSkybox = new ShaderProgram(sourceVert, sourceFrag);
        this._vertexBuffer = WebGL.context.createBuffer();
        this._arrayBuffer = WebGL.context.createVertexArray();
        this._cubeTexture = cubeTexture;

        WebGL.context.bindVertexArray(this._arrayBuffer);
        WebGL.context.bindBuffer(WebGL.context.ARRAY_BUFFER, this._vertexBuffer);
        WebGL.context.bufferData(WebGL.context.ARRAY_BUFFER, new Float32Array(vertices), WebGL.context.STATIC_DRAW);
        WebGL.context.enableVertexAttribArray(0);
        WebGL.context.vertexAttribPointer(0, 3, WebGL.context.FLOAT, false, 3*4, 0);

        this._shaderProgramSkybox.use();
        WebGL.context.uniform1i(this._shaderProgramSkybox.getUniformLocation(ShaderVariable.skybox), 0);
        WebGL.context.bindVertexArray(null);
    }

    render(camera: Camera) {
        this._shaderProgramSkybox.use();
        WebGL.context.depthFunc(WebGL.context.LEQUAL);
        WebGL.context.bindVertexArray(this._arrayBuffer);

        WebGL.context.bindTexture(WebGL.context.TEXTURE_CUBE_MAP, this._cubeTexture.get());

        WebGL.context.uniformMatrix4fv(this._shaderProgramSkybox.getUniformLocation(ShaderVariable.Vmatrix), false, camera.getView().all());
        WebGL.context.uniformMatrix4fv(this._shaderProgramSkybox.getUniformLocation(ShaderVariable.Pmatrix), false, camera.getProjection().all());

        WebGL.context.drawArrays(WebGL.context.TRIANGLES, 0, vertices.length/3);
        WebGL.context.bindVertexArray(null);
    }
}
