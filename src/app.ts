// app.ts
import {WebGL} from './GLContext';
import {Shader} from './Shaders';
import {Utils} from './Utils';
import {ShaderProgram} from './ShaderProgram';

document.addEventListener('DOMContentLoaded', async () => {
    const CANVAS = <HTMLCanvasElement>document.getElementById('container');
    /*========================= CAPTURE MOUSE EVENTS ========================= */
    const AMORTIZATION = 0.95;
    let drag = false;
    let old_x: number, old_y: number;
    let dX = 0, dY = 0;

    const mouseDown = function (e: any) {
        drag = true;
        old_x = e.pageX, old_y = e.pageY;
        e.preventDefault();
        return false;
    };

    const mouseUp = function (e: any) {
        drag = false;
    };

    const mouseMove = function (e: any) {
        if (!drag) return false;
        dX = (e.pageX - old_x) * Math.PI / CANVAS.width,
            dY = (e.pageY - old_y) * Math.PI / CANVAS.height;
        THETA += dX;
        PHI += dY;
        old_x = e.pageX, old_y = e.pageY;
        e.preventDefault();
    };

    CANVAS.addEventListener('mousedown', mouseDown, false);
    CANVAS.addEventListener('mouseup', mouseUp, false);
    CANVAS.addEventListener('mouseout', mouseUp, false);
    CANVAS.addEventListener('mousemove', mouseMove, false);

    /*========================= GET WEBGL CONTEXT ========================= */
    try {
        WebGL.context = <WebGLRenderingContext>CANVAS.getContext('experimental-webgl', {antialias: true});
        const EXT = WebGL.context.getExtension('OES_element_index_uint') ||
            WebGL.context.getExtension('MOZ_OES_element_index_uint') ||
            WebGL.context.getExtension('WEBKIT_OES_element_index_uint');
    } catch (e) {
        alert('You are not webgl compatible :(');
        return false;
    }


    const shaderProgramShadow = new ShaderProgram(Shader.shadowMapV, Shader.shadowMapF);
    const _PmatrixShadow = WebGL.context.getUniformLocation(shaderProgramShadow.get(), 'Pmatrix');
    const _LmatrixShadow = WebGL.context.getUniformLocation(shaderProgramShadow.get(), 'Lmatrix');
    const _positionShadow = WebGL.context.getAttribLocation(shaderProgramShadow.get(), 'position');


    const shaderProgram = new ShaderProgram(Shader.v, Shader.f);
    const _Pmatrix = WebGL.context.getUniformLocation(shaderProgram.get(), 'Pmatrix');
    const _Vmatrix = WebGL.context.getUniformLocation(shaderProgram.get(), 'Vmatrix');
    const _Mmatrix = WebGL.context.getUniformLocation(shaderProgram.get(), 'Mmatrix');
    const _Lmatrix = WebGL.context.getUniformLocation(shaderProgram.get(), 'Lmatrix');
    const _PmatrixLight = WebGL.context.getUniformLocation(shaderProgram.get(), 'PmatrixLight');
    const _lightDirection = WebGL.context.getUniformLocation(shaderProgram.get(), 'source_direction');
    const _sampler = WebGL.context.getUniformLocation(shaderProgram.get(), 'sampler');
    const _samplerShadowMap = WebGL.context.getUniformLocation(shaderProgram.get(), 'samplerShadowMap');

    const _uv = WebGL.context.getAttribLocation(shaderProgram.get(), 'uv');
    const _position = WebGL.context.getAttribLocation(shaderProgram.get(), 'position');
    const _normal = WebGL.context.getAttribLocation(shaderProgram.get(), 'normal');

    shaderProgram.use();
    WebGL.context.uniform1i(_sampler, 0);
    WebGL.context.uniform1i(_samplerShadowMap, 1);
    const LIGHTDIR = [0.58, 0.58, -0.58];
    WebGL.context.uniform3fv(_lightDirection, LIGHTDIR);


    /*========================= THE DRAGON ========================= */

    let CUBE_VERTEX: any = false, CUBE_FACES: any = false, CUBE_NPOINTS = 0;

    const dragon = await Utils.get_json('resources/dragon.json');
    CUBE_VERTEX = WebGL.context.createBuffer();
    console.log(CUBE_VERTEX);
    WebGL.context.bindBuffer(WebGL.context.ARRAY_BUFFER, CUBE_VERTEX);
    WebGL.context.bufferData(WebGL.context.ARRAY_BUFFER,
        new Float32Array(dragon.vertices),
        WebGL.context.STATIC_DRAW);

    //faces
    CUBE_FACES = WebGL.context.createBuffer();
    WebGL.context.bindBuffer(WebGL.context.ELEMENT_ARRAY_BUFFER, CUBE_FACES);
    WebGL.context.bufferData(WebGL.context.ELEMENT_ARRAY_BUFFER,
        new Uint32Array(dragon.indices),
        WebGL.context.STATIC_DRAW);

    CUBE_NPOINTS = dragon.indices.length;

    /*========================= THE FLOOR ========================= */

    const floor_vertices = [
        -10, 0, -10, 0, 1, 0, 0, 0, //1st point position,normal and UV
        -10, 0, 10, 0, 1, 0, 0, 1, //2nd point
        10, 0, 10, 0, 1, 0, 1, 1,
        10, 0, -10, 0, 1, 0, 1, 0
    ];

    const FLOOR_VERTEX = WebGL.context.createBuffer();
    WebGL.context.bindBuffer(WebGL.context.ARRAY_BUFFER, FLOOR_VERTEX);
    WebGL.context.bufferData(WebGL.context.ARRAY_BUFFER, new Float32Array(floor_vertices), WebGL.context.STATIC_DRAW);

    const FLOOR_INDICES = WebGL.context.createBuffer();
    WebGL.context.bindBuffer(WebGL.context.ELEMENT_ARRAY_BUFFER, FLOOR_INDICES);
    WebGL.context.bufferData(WebGL.context.ELEMENT_ARRAY_BUFFER,
        new Uint16Array([0, 1, 2, 0, 2, 3]), WebGL.context.STATIC_DRAW);


    /*========================= MATRIX ========================= */

    const PROJMATRIX = Utils.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
    const MOVEMATRIX = Utils.get_I4();
    const VIEWMATRIX = Utils.get_I4();

    Utils.translateZ(VIEWMATRIX, -20);
    Utils.translateY(VIEWMATRIX, -4);
    let THETA = 0,
        PHI = 0;

    const PROJMATRIX_SHADOW = Utils.get_projection_ortho(20, 1, 5, 28);
    const LIGHTMATRIX = Utils.lookAtDir(LIGHTDIR, [0, 1, 0], [0, 0, 0]);


    /*========================= TEXTURES ========================= */

    const get_texture = async function (image_URL: string) {

        const image = new Image();
        image.src=image_URL;

        let texture = WebGL.context.createTexture();
        image.onload=function(e) {
            // result includes identifier 'data:image/png;base64,' plus the base64 data
            setTimeout(() => {
                WebGL.context.pixelStorei(WebGL.context.UNPACK_FLIP_Y_WEBGL, true);
                WebGL.context.bindTexture(WebGL.context.TEXTURE_2D, texture);
                WebGL.context.texImage2D(WebGL.context.TEXTURE_2D, 0, WebGL.context.RGBA, WebGL.context.RGBA, WebGL.context.UNSIGNED_BYTE, image);
                WebGL.context.texParameteri(WebGL.context.TEXTURE_2D, WebGL.context.TEXTURE_MAG_FILTER, WebGL.context.LINEAR);
                WebGL.context.texParameteri(WebGL.context.TEXTURE_2D,
                    WebGL.context.TEXTURE_MIN_FILTER, WebGL.context.NEAREST_MIPMAP_LINEAR);
                WebGL.context.generateMipmap(WebGL.context.TEXTURE_2D);
                WebGL.context.bindTexture(WebGL.context.TEXTURE_2D, null);
            }, 1000);


        }

        return texture;
    };

    const cube_texture = await get_texture("resources/dragon.png");
    const floor_texture = await get_texture('resources/granit.jpg');

    /*======================= RENDER TO TEXTURE ======================= */

    const fb = WebGL.context.createFramebuffer();
    WebGL.context.bindFramebuffer(WebGL.context.FRAMEBUFFER, fb);

    const rb = WebGL.context.createRenderbuffer();
    WebGL.context.bindRenderbuffer(WebGL.context.RENDERBUFFER, rb);
    WebGL.context.renderbufferStorage(WebGL.context.RENDERBUFFER, WebGL.context.DEPTH_COMPONENT16, 512, 512);

    WebGL.context.framebufferRenderbuffer(WebGL.context.FRAMEBUFFER, WebGL.context.DEPTH_ATTACHMENT,
        WebGL.context.RENDERBUFFER, rb);

    const texture_rtt = WebGL.context.createTexture();
    WebGL.context.bindTexture(WebGL.context.TEXTURE_2D, texture_rtt);
    WebGL.context.texParameteri(WebGL.context.TEXTURE_2D, WebGL.context.TEXTURE_MAG_FILTER, WebGL.context.LINEAR);
    WebGL.context.texParameteri(WebGL.context.TEXTURE_2D, WebGL.context.TEXTURE_MIN_FILTER, WebGL.context.LINEAR);
    WebGL.context.texImage2D(WebGL.context.TEXTURE_2D, 0, WebGL.context.RGBA, 512, 512,
        0, WebGL.context.RGBA, WebGL.context.UNSIGNED_BYTE, null);

    WebGL.context.framebufferTexture2D(WebGL.context.FRAMEBUFFER, WebGL.context.COLOR_ATTACHMENT0,
        WebGL.context.TEXTURE_2D, texture_rtt, 0);

    WebGL.context.bindTexture(WebGL.context.TEXTURE_2D, null);
    WebGL.context.bindFramebuffer(WebGL.context.FRAMEBUFFER, null);


    /*========================= DRAWING ========================= */
    WebGL.context.enable(WebGL.context.DEPTH_TEST);
    WebGL.context.depthFunc(WebGL.context.LEQUAL);
    WebGL.context.clearDepth(1.0);

    let time_old = 0;
    const animate = function (time: number) {
        const dt = time - time_old;
        if (!drag) {
            dX *= AMORTIZATION, dY *= AMORTIZATION;
            THETA += dX, PHI += dY;
        }
        Utils.set_I4(MOVEMATRIX);
        Utils.rotateY(MOVEMATRIX, THETA);
        Utils.rotateX(MOVEMATRIX, PHI);
        time_old = time;


        //===================== RENDER THE SHADOW MAP ==========================
        WebGL.context.bindFramebuffer(WebGL.context.FRAMEBUFFER, fb);
        shaderProgramShadow.use();
        WebGL.context.enableVertexAttribArray(_positionShadow);

        WebGL.context.viewport(0.0, 0.0, 512, 512);
        WebGL.context.clearColor(0.0, 0.0, 0.0, 1.0); //red -> Z=Zfar on the shadow map
        WebGL.context.clear(WebGL.context.COLOR_BUFFER_BIT | WebGL.context.DEPTH_BUFFER_BIT);

        WebGL.context.uniformMatrix4fv(_PmatrixShadow, false, PROJMATRIX_SHADOW);
        WebGL.context.uniformMatrix4fv(_LmatrixShadow, false, LIGHTMATRIX);

        //DRAW THE DRAGON
        WebGL.context.bindBuffer(WebGL.context.ARRAY_BUFFER, CUBE_VERTEX);
        WebGL.context.vertexAttribPointer(_positionShadow, 3, WebGL.context.FLOAT, false, 4 * (3 + 3 + 2), 0);

        WebGL.context.bindBuffer(WebGL.context.ELEMENT_ARRAY_BUFFER, CUBE_FACES);
        WebGL.context.drawElements(WebGL.context.TRIANGLES, CUBE_NPOINTS, WebGL.context.UNSIGNED_INT, 0);

        //DRAW THE FLOOR
        WebGL.context.bindBuffer(WebGL.context.ARRAY_BUFFER, FLOOR_VERTEX);
        WebGL.context.vertexAttribPointer(_positionShadow, 3, WebGL.context.FLOAT, false, 4 * (3 + 3 + 2), 0);

        WebGL.context.bindBuffer(WebGL.context.ELEMENT_ARRAY_BUFFER, FLOOR_INDICES);
        WebGL.context.drawElements(WebGL.context.TRIANGLES, 6, WebGL.context.UNSIGNED_SHORT, 0);

        WebGL.context.disableVertexAttribArray(_positionShadow);


        //==================== RENDER THE SCENE ===========================
        WebGL.context.bindFramebuffer(WebGL.context.FRAMEBUFFER, null);


        shaderProgram.use();


        WebGL.context.enableVertexAttribArray(_uv);
        WebGL.context.enableVertexAttribArray(_position);
        WebGL.context.enableVertexAttribArray(_normal);

        WebGL.context.viewport(0.0, 0.0, CANVAS.width, CANVAS.height);
        WebGL.context.clearColor(0.0, 0.0, 0.0, 1.0);
        WebGL.context.clear(WebGL.context.COLOR_BUFFER_BIT | WebGL.context.DEPTH_BUFFER_BIT);
        WebGL.context.uniformMatrix4fv(_Pmatrix, false, PROJMATRIX);
        WebGL.context.uniformMatrix4fv(_Vmatrix, false, VIEWMATRIX);
        WebGL.context.uniformMatrix4fv(_Mmatrix, false, MOVEMATRIX);
        WebGL.context.uniformMatrix4fv(_PmatrixLight, false, PROJMATRIX_SHADOW);
        WebGL.context.uniformMatrix4fv(_Lmatrix, false, LIGHTMATRIX);

        //DRAW THE DRAGON
        if (cube_texture) {
            WebGL.context.activeTexture(WebGL.context.TEXTURE1);
            WebGL.context.bindTexture(WebGL.context.TEXTURE_2D, texture_rtt);
            WebGL.context.activeTexture(WebGL.context.TEXTURE0);
            WebGL.context.bindTexture(WebGL.context.TEXTURE_2D, cube_texture);
        }

        WebGL.context.bindBuffer(WebGL.context.ARRAY_BUFFER, CUBE_VERTEX);
        WebGL.context.vertexAttribPointer(_position, 3, WebGL.context.FLOAT, false, 4 * (3 + 3 + 2), 0);
        WebGL.context.vertexAttribPointer(_normal, 3, WebGL.context.FLOAT, false, 4 * (3 + 3 + 2), 3 * 4);
        WebGL.context.vertexAttribPointer(_uv, 2, WebGL.context.FLOAT, false, 4 * (3 + 3 + 2), (3 + 3) * 4);

        WebGL.context.bindBuffer(WebGL.context.ELEMENT_ARRAY_BUFFER, CUBE_FACES);
        WebGL.context.drawElements(WebGL.context.TRIANGLES, CUBE_NPOINTS, WebGL.context.UNSIGNED_INT, 0);

        //DRAW THE FLOOR
        if (floor_texture) {
            WebGL.context.bindTexture(WebGL.context.TEXTURE_2D, floor_texture);
        }

        WebGL.context.bindBuffer(WebGL.context.ARRAY_BUFFER, FLOOR_VERTEX);
        WebGL.context.vertexAttribPointer(_position, 3, WebGL.context.FLOAT, false, 4 * (3 + 3 + 2), 0);
        WebGL.context.vertexAttribPointer(_normal, 3, WebGL.context.FLOAT, false, 4 * (3 + 3 + 2), 3 * 4);
        WebGL.context.vertexAttribPointer(_uv, 2, WebGL.context.FLOAT, false, 4 * (3 + 3 + 2), (3 + 3) * 4);

        WebGL.context.bindBuffer(WebGL.context.ELEMENT_ARRAY_BUFFER, FLOOR_INDICES);
        WebGL.context.drawElements(WebGL.context.TRIANGLES, 6, WebGL.context.UNSIGNED_SHORT, 0);

        WebGL.context.disableVertexAttribArray(_uv);
        WebGL.context.disableVertexAttribArray(_position);
        WebGL.context.disableVertexAttribArray(_normal);

        WebGL.context.flush();
        window.requestAnimationFrame(animate);
    };

    animate(0);
});
