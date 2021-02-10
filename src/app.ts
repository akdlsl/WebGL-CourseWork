// app.ts
import {WebGL} from './GLContext';
import {M4, Utils} from './Utils';
import {ShaderProgram} from './ShaderProgram';
import {STR} from "./Contstant";
import {Model} from "./Model";
import {Texture, RenderTexture, CubeTexture} from "./Texture";
import {Skybox} from "./Skybox";
import {Camera} from "./Camera";

document.addEventListener('DOMContentLoaded', async () => {
    const canvas = <HTMLCanvasElement>document.getElementById('container');
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
        dX = (e.pageX - old_x) * Math.PI / canvas.width,
            dY = (e.pageY - old_y) * Math.PI / canvas.height;
        THETA += dX;
        PHI += dY;
        old_x = e.pageX, old_y = e.pageY;
        e.preventDefault();
    };

    canvas.addEventListener('mousedown', mouseDown, false);
    canvas.addEventListener('mouseup', mouseUp, false);
    canvas.addEventListener('mouseout', mouseUp, false);
    canvas.addEventListener('mousemove', mouseMove, false);

    /*========================= GET WEBGL CONTEXT ========================= */
    try {
        WebGL.context = <WebGL2RenderingContext>canvas.getContext('webgl2', {antialias: true});
    } catch (e) {
        alert('You are not webgl compatible :(');
        return false;
    }

    const modelVertSource = await Utils.makeRequest('resources/shaders/model.vert', 'text');
    const modelFragSource = await Utils.makeRequest('resources/shaders/model.frag', 'text');
    const shadowVertSource = await Utils.makeRequest('resources/shaders/shadow.vert', 'text');
    const shadowFragSource = await Utils.makeRequest('resources/shaders/shadow.frag', 'text');
    const dragonJson = await Utils.get_json('resources/dragon.json');
    const skyboxVert = await Utils.makeRequest('resources/shaders/skybox.vert', 'text');
    const skyboxFrag = await Utils.makeRequest('resources/shaders/skybox.frag', 'text');
    const cubeTexture = new CubeTexture(CubeTexture.loadImageAsCube([
        {
            target: WebGL.context.TEXTURE_CUBE_MAP_POSITIVE_X,
            url: 'https://webglfundamentals.org/webgl/resources/images/computer-history-museum/pos-x.jpg',
        },
        {
            target: WebGL.context.TEXTURE_CUBE_MAP_NEGATIVE_X,
            url: 'https://webglfundamentals.org/webgl/resources/images/computer-history-museum/neg-x.jpg',
        },
        {
            target: WebGL.context.TEXTURE_CUBE_MAP_POSITIVE_Y,
            url: 'https://webglfundamentals.org/webgl/resources/images/computer-history-museum/pos-y.jpg',
        },
        {
            target: WebGL.context.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            url: 'https://webglfundamentals.org/webgl/resources/images/computer-history-museum/neg-y.jpg',
        },
        {
            target: WebGL.context.TEXTURE_CUBE_MAP_POSITIVE_Z,
            url: 'https://webglfundamentals.org/webgl/resources/images/computer-history-museum/pos-z.jpg',
        },
        {
            target: WebGL.context.TEXTURE_CUBE_MAP_NEGATIVE_Z,
            url: 'https://webglfundamentals.org/webgl/resources/images/computer-history-museum/neg-z.jpg',
        },
    ]));

    const camera = new Camera(canvas);


    const shaderProgramShadow = new ShaderProgram(shadowVertSource, shadowFragSource);
    const shaderProgram = new ShaderProgram(modelVertSource, modelFragSource);

    shaderProgram.use();
    WebGL.context.uniform1i(shaderProgram.getUniformLocation(STR.sampler), 0);
    WebGL.context.uniform1i(shaderProgram.getUniformLocation(STR.samplerShadowMap), 1);
    const LIGHTDIR = [0.58, 0.58, -0.58];
    WebGL.context.uniform3fv(shaderProgram.getUniformLocation(STR.lightDirection), LIGHTDIR);



    const floor_vertices = [
        -10, 0, -10, 0, 1, 0, 0, 0, //1st point position,normal and UV
        -10, 0, 10, 0, 1, 0, 0, 1, //2nd point
        10, 0, 10, 0, 1, 0, 1, 1,
        10, 0, -10, 0, 1, 0, 1, 0
    ];

    const floor_indices = [0, 1, 2, 0, 2, 3]; // Uint16


    /*========================= MATRIX ========================= */
    function radToDeg(r: number) {
        return r * 180 / Math.PI;
    }

    function degToRad(d: number) {
        return d * Math.PI / 180;
    }

    var cameraAngleRadians = degToRad(0);
    var fieldOfViewRadians = degToRad(60);

    const projection = Utils.getProjection(40, canvas.width / canvas.height, 1, 100);
    const model = Utils.get_I4();
    const view = Utils.get_I4();

    var cameraMatrix = M4.yRotation(cameraAngleRadians);
    cameraMatrix = M4.translate(cameraMatrix, 0, 0, 10 * 1.5);

    // Make a view matrix from the camera matrix
    var viewMatrix = M4.inverse(cameraMatrix);
    var viewProjectionMatrix = M4.multiply(projection, viewMatrix);


    Utils.translateZ(view, -20);
    Utils.translateY(view, -4);
    let THETA = 0,
        PHI = 0;

    const projectionShadow = Utils.getProjectionOrtho(20, 1, 5, 28);
    const light = Utils.lookAtDir(LIGHTDIR, [0, 1, 0], [0, 0, 0]);


    const renderTexture = new RenderTexture();
    const dragonModel = new Model(dragonJson.vertices, dragonJson.indices, [Texture.from('resources/dragon.png'), renderTexture]);
    const floorModel = new Model(floor_vertices, floor_indices, [Texture.from('resources/granit.jpg')]);
    const skybox = new Skybox(cubeTexture, skyboxVert, skyboxFrag);


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
        Utils.set_I4(model);
        Utils.rotateY(model, THETA);
        Utils.rotateX(model, PHI);
        time_old = time;

        var x = Math.cos(PHI) * 10;
        var y = Math.sin(THETA) * 10;
        M4.translate(viewProjectionMatrix, x, 0, y);



        renderTexture.renderToTexture(() => {
            shaderProgramShadow.use();
            WebGL.context.depthFunc(WebGL.context.LESS);
            WebGL.context.uniformMatrix4fv(shaderProgramShadow.getUniformLocation(STR.Pmatrix), false, projectionShadow);
            WebGL.context.uniformMatrix4fv(shaderProgramShadow.getUniformLocation(STR.Lmatrix), false, light);

            dragonModel.render();
            floorModel.render();
        });

        //==================== RENDER THE SCENE ===========================

        shaderProgram.use();
        WebGL.context.depthFunc(WebGL.context.LESS);
        WebGL.context.viewport(0.0, 0.0, canvas.width, canvas.height);
        WebGL.context.clearColor(0.0, 0.0, 0.0, 1.0);
        WebGL.context.clear(WebGL.context.COLOR_BUFFER_BIT | WebGL.context.DEPTH_BUFFER_BIT);
        WebGL.context.uniformMatrix4fv(shaderProgram.getUniformLocation(STR.Pmatrix), false, viewProjectionMatrix);
        WebGL.context.uniformMatrix4fv(shaderProgram.getUniformLocation(STR.Mmatrix), false, model);
        WebGL.context.uniformMatrix4fv(shaderProgram.getUniformLocation(STR.PmatrixLight), false, projectionShadow);
        WebGL.context.uniformMatrix4fv(shaderProgram.getUniformLocation(STR.Lmatrix), false, light);

        dragonModel.render();
        floorModel.render();

        skybox.render(view, viewProjectionMatrix);

        WebGL.context.flush();
        window.requestAnimationFrame(animate);
    };

    animate(0);
});
