import {WebGL} from "./GLContext";

export class ShaderProgram {
    private _program: WebGLProgram | null;
    private _uniformCash: Map<string,  WebGLUniformLocation> = new Map<string, WebGLUniformLocation>();
    private _attributeCash: Map<string,  GLint> = new Map<string, GLint>();

    constructor(vertexShader: string, fragmentShader: string) {
        const shaderV = <WebGLShader>WebGL.context.createShader(WebGL.context.VERTEX_SHADER);
        WebGL.context.shaderSource(shaderV, vertexShader);
        WebGL.context.compileShader(shaderV);

        if (!WebGL.context.getShaderParameter(shaderV, WebGL.context.COMPILE_STATUS)) {
            console.error(WebGL.context.getShaderInfoLog(shaderV));
            throw new Error('Failed to compile vertex shader');
        }

        const shaderF = <WebGLShader>WebGL.context.createShader(WebGL.context.FRAGMENT_SHADER);
        WebGL.context.shaderSource(shaderF, fragmentShader);
        WebGL.context.compileShader(shaderF);

        if (!WebGL.context.getShaderParameter(shaderF, WebGL.context.COMPILE_STATUS)) {
            console.error(WebGL.context.getShaderInfoLog(shaderF));
            throw new Error('Failed to compile fragment shader');
        }

        this._program = WebGL.context.createProgram();
        if (!this._program) {
            throw new Error('Failed to compile shader program');
        }
        WebGL.context.attachShader(this._program, shaderV);
        WebGL.context.attachShader(this._program, shaderF);
        WebGL.context.linkProgram(this._program);

        if (!WebGL.context.getProgramParameter(this._program, WebGL.context.LINK_STATUS)) {
            console.error(WebGL.context.getProgramInfoLog(this._program));
            throw new Error('Failed to link program');
        }
    }

    use() {
        WebGL.context.useProgram(this._program);
    }

    get():WebGLProgram {
        return <WebGLProgram>this._program;
    }

    getUniformLocation(name: string): WebGLUniformLocation {
        let location = this._uniformCash.get(name);
        if (!location) {
            location = <WebGLUniformLocation>WebGL.context.getUniformLocation(<WebGLProgram>this._program, name);
        }

        return location;
    }

    getAttributeLocation(name: string): GLint {
        let location = this._attributeCash.get(name);
        if (!location) {
            location = <GLint>WebGL.context.getAttribLocation(<WebGLProgram>this._program, name);
        }

        return location;
    }
}
