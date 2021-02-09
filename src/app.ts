// app.ts
import {WebGL} from './GLContext';
import {Shader} from './Shaders';
import {Utils} from './Utils';
import {ShaderProgram} from './ShaderProgram';
import {STR} from "./Contstant";
import {Model} from "./Model";
import {Texture} from "./Texture";

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
        WebGL.context = <WebGL2RenderingContext>CANVAS.getContext('webgl2', {antialias: true});
    } catch (e) {
        alert('You are not webgl compatible :(');
        return false;
    }


    const shaderProgramShadow = new ShaderProgram(Shader.shadowMapV, Shader.shadowMapF);
    const shaderProgram = new ShaderProgram(Shader.v, Shader.f);

    shaderProgram.use();
    WebGL.context.uniform1i(shaderProgram.getUniformLocation(STR.sampler), 0);
    WebGL.context.uniform1i(shaderProgram.getUniformLocation(STR.samplerShadowMap), 1);
    const LIGHTDIR = [0.58, 0.58, -0.58];
    WebGL.context.uniform3fv(shaderProgram.getUniformLocation(STR.lightDirection), LIGHTDIR);


    /*========================= THE DRAGON ========================= */
    const dragon = await Utils.get_json('resources/dragon.json');

    /*========================= THE FLOOR ========================= */

    const floor_vertices = [
        -10, 0, -10, 0, 1, 0, 0, 0, //1st point position,normal and UV
        -10, 0, 10, 0, 1, 0, 0, 1, //2nd point
        10, 0, 10, 0, 1, 0, 1, 1,
        10, 0, -10, 0, 1, 0, 1, 0
    ];

    const floor_indices = [0, 1, 2, 0, 2, 3]; // Uint16


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

    const dragonModel = new Model(dragon.vertices, dragon.indices, [Texture.from('resources/dragon.png'), new Texture(<WebGLTexture>texture_rtt)]);
    const floorModel = new Model(floor_vertices, floor_indices, [Texture.from('resources/granit.jpg')]);


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

        WebGL.context.viewport(0.0, 0.0, 512, 512);
        WebGL.context.clearColor(0.0, 0.0, 0.0, 1.0); //red -> Z=Zfar on the shadow map
        WebGL.context.clear(WebGL.context.COLOR_BUFFER_BIT | WebGL.context.DEPTH_BUFFER_BIT);

        WebGL.context.uniformMatrix4fv(shaderProgramShadow.getUniformLocation(STR.Pmatrix), false, PROJMATRIX_SHADOW);
        WebGL.context.uniformMatrix4fv(shaderProgramShadow.getUniformLocation(STR.Lmatrix), false, LIGHTMATRIX);

        dragonModel.render();
        floorModel.render();

        //==================== RENDER THE SCENE ===========================
        WebGL.context.bindFramebuffer(WebGL.context.FRAMEBUFFER, null);

        shaderProgram.use();

        WebGL.context.viewport(0.0, 0.0, CANVAS.width, CANVAS.height);
        WebGL.context.clearColor(0.4, 0.0, 0.0, 1.0);
        WebGL.context.clear(WebGL.context.COLOR_BUFFER_BIT | WebGL.context.DEPTH_BUFFER_BIT);
        WebGL.context.uniformMatrix4fv(shaderProgram.getUniformLocation(STR.Pmatrix), false, PROJMATRIX);
        WebGL.context.uniformMatrix4fv(shaderProgram.getUniformLocation(STR.Vmatrix), false, VIEWMATRIX);
        WebGL.context.uniformMatrix4fv(shaderProgram.getUniformLocation(STR.Mmatrix), false, MOVEMATRIX);
        WebGL.context.uniformMatrix4fv(shaderProgram.getUniformLocation(STR.PmatrixLight), false, PROJMATRIX_SHADOW);
        WebGL.context.uniformMatrix4fv(shaderProgram.getUniformLocation(STR.Lmatrix), false, LIGHTMATRIX);

        dragonModel.render();
        floorModel.render();

        WebGL.context.flush();
        window.requestAnimationFrame(animate);
    };

    animate(0);
});
