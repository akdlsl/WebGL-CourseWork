// App.ts
import {WebGL} from './GLContext';
import {Utils} from './Utils';
import {ShaderProgram} from './ShaderProgram';
import {ShaderVariable} from "./Contstant";
import {Model} from "./Model";
import {Texture, RenderTexture, CubeTexture} from "./Texture";
import {Skybox} from "./Skybox";
import {Camera} from "./Camera";
import vec3 from "./tsm/vec3";
import mat4 from "./tsm/mat4";
import {Transform} from "./Transform";

const dragonTransform = new Transform(new vec3([0, 0, 0]), new vec3([1, 1, 1]));
const floorTransform = new Transform(new vec3([0, 0, 0]), new vec3([1, 1, 1]));
const cubeTransform = new Transform(new vec3([0, 4, -5]), new vec3([1, 1, 1]));
const lightDirection = new vec3([0.58, 0.58, -0.58]);
let lightMatrix: mat4;

const updateLightMatrix = () => lightMatrix = mat4.lookAt(lightDirection, new vec3([0, 0, 0]), new vec3([0, 1, 0]));
updateLightMatrix();

document.addEventListener('DOMContentLoaded', async () => {
    const canvas = <HTMLCanvasElement>document.getElementById('container');

    try {
        WebGL.context = <WebGL2RenderingContext>canvas.getContext('webgl2', {antialias: true});
    } catch (e) {
        alert('You are not webgl compatible :(');
        return false;
    }

    const camera = new Camera(canvas, dragonTransform.position);
    const modelVertSource = await Utils.makeRequest('resources/shaders/model.vert', 'text');
    const modelFragSource = await Utils.makeRequest('resources/shaders/model.frag', 'text');
    const shadowVertSource = await Utils.makeRequest('resources/shaders/shadow.vert', 'text');
    const shadowFragSource = await Utils.makeRequest('resources/shaders/shadow.frag', 'text');
    const dragonJson = await Utils.get_json('resources/dragon.json');
    const skyboxVert = await Utils.makeRequest('resources/shaders/skybox.vert', 'text');
    const skyboxFrag = await Utils.makeRequest('resources/shaders/skybox.frag', 'text');
    const cubeTexture = CubeTexture.loadImageAsCube(CubeTexture.oceanCubeMapPath());

    const shaderProgramShadow = new ShaderProgram(shadowVertSource, shadowFragSource);
    const shaderProgram = new ShaderProgram(modelVertSource, modelFragSource);

    shaderProgram.use();
    WebGL.context.uniform1i(shaderProgram.getUniformLocation(ShaderVariable.sampler), 0);
    WebGL.context.uniform1i(shaderProgram.getUniformLocation(ShaderVariable.samplerShadowMap), 1);
    WebGL.context.uniform3fv(shaderProgram.getUniformLocation(ShaderVariable.lightDirection), lightDirection.xyz);


    const projectionShadow = mat4.orthographic(-50, 50, -50, 50, 1, 100);

    const renderTexture = new RenderTexture();
    const dragonModel = new Model(dragonJson.vertices, dragonJson.indices, [Texture.loadImage('resources/dragon.png'), renderTexture]);
    const floorModel = Model.createPlane(25, Texture.loadImage('resources/ground1.jpg'));
    const cubeModel = Model.createCube(4, Texture.loadImage('resources/brickwall.jpg'));
    const skybox = new Skybox(cubeTexture, skyboxVert, skyboxFrag);

    WebGL.context.enable(WebGL.context.DEPTH_TEST);
    WebGL.context.depthFunc(WebGL.context.LEQUAL);
    WebGL.context.clearDepth(1.0);

    const animate = function (time: number) {
        camera.update();

        renderTexture.renderToTexture(() => {
            shaderProgramShadow.use();
            WebGL.context.depthFunc(WebGL.context.LESS);
            WebGL.context.uniformMatrix4fv(shaderProgramShadow.getUniformLocation(ShaderVariable.Pmatrix), false, projectionShadow.all());
            WebGL.context.uniformMatrix4fv(shaderProgramShadow.getUniformLocation(ShaderVariable.Lmatrix), false, lightMatrix.all());

            dragonModel.render(() => WebGL.context.uniformMatrix4fv(shaderProgramShadow.getUniformLocation(ShaderVariable.Mmatrix), false, dragonTransform.getModelMatrix().all()));
            cubeModel.render(() => WebGL.context.uniformMatrix4fv(shaderProgramShadow.getUniformLocation(ShaderVariable.Mmatrix), false, cubeTransform.getModelMatrix().all()));
            floorModel.render(() => WebGL.context.uniformMatrix4fv(shaderProgramShadow.getUniformLocation(ShaderVariable.Mmatrix), false, floorTransform.getModelMatrix().all()));
        });

        shaderProgram.use();
        WebGL.context.depthFunc(WebGL.context.LESS);
        WebGL.context.viewport(0.0, 0.0, canvas.width, canvas.height);
        WebGL.context.clearColor(0.0, 0.0, 0.0, 1.0);
        WebGL.context.clear(WebGL.context.COLOR_BUFFER_BIT | WebGL.context.DEPTH_BUFFER_BIT);
        WebGL.context.uniformMatrix4fv(shaderProgram.getUniformLocation(ShaderVariable.Pmatrix), false, camera.getProjection().all());
        WebGL.context.uniformMatrix4fv(shaderProgram.getUniformLocation(ShaderVariable.Vmatrix), false, camera.getView().all());
        WebGL.context.uniformMatrix4fv(shaderProgram.getUniformLocation(ShaderVariable.PmatrixLight), false, projectionShadow.all());
        WebGL.context.uniformMatrix4fv(shaderProgram.getUniformLocation(ShaderVariable.Lmatrix), false, lightMatrix.all());

        dragonModel.render(() => WebGL.context.uniformMatrix4fv(shaderProgram.getUniformLocation(ShaderVariable.Mmatrix), false, dragonTransform.getModelMatrix().all()));
        cubeModel.render(() => WebGL.context.uniformMatrix4fv(shaderProgram.getUniformLocation(ShaderVariable.Mmatrix), false, cubeTransform.getModelMatrix().all()));
        floorModel.render(() => WebGL.context.uniformMatrix4fv(shaderProgram.getUniformLocation(ShaderVariable.Mmatrix), false, floorTransform.getModelMatrix().all()));
        skybox.render(camera);

        WebGL.context.flush();
        window.requestAnimationFrame(animate);
    };

    animate(0);
});

window.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key == 's') {
        dragonTransform.translate(new vec3([1, 0, 0]));
    }
    if (event.key == 'w') {
        dragonTransform.translate(new vec3([-1, 0, 0]));
    }
    if (event.key == 'a') {
        dragonTransform.translate(new vec3([0, 0, 1]));
    }
    if (event.key == 'd') {
        dragonTransform.translate(new vec3([0, 0, -1]));
    }
    if (event.key == '1') {
        cubeTransform.translate(new vec3([1, 0, 0]));
    }
    if (event.key == '2') {
        cubeTransform.translate(new vec3([-1, 0, 0]));
    }
    if (event.key == '3') {
        cubeTransform.translate(new vec3([0, 0, 1]));
    }
    if (event.key == '4') {
        cubeTransform.translate(new vec3([0, 0, -1]));
    }
    updateLightMatrix();
}, false);

[].forEach.call(document.getElementsByClassName('light'), (item: Element) => {
    item.addEventListener('input', (event: any) => {
        // @ts-ignore
        lightDirection[event.target.id] = event.target.value;
        updateLightMatrix();
    });
});
