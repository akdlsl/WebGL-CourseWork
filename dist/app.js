/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/GLContext.ts":
/*!**************************!*\
  !*** ./src/GLContext.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports) {

eval("\r\nvar __extends = (this && this.__extends) || (function () {\r\n    var extendStatics = function (d, b) {\r\n        extendStatics = Object.setPrototypeOf ||\r\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\r\n            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };\r\n        return extendStatics(d, b);\r\n    };\r\n    return function (d, b) {\r\n        extendStatics(d, b);\r\n        function __() { this.constructor = d; }\r\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\r\n    };\r\n})();\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.WebGL = void 0;\r\nvar WebGL = /** @class */ (function (_super) {\r\n    __extends(WebGL, _super);\r\n    function WebGL() {\r\n        return _super !== null && _super.apply(this, arguments) || this;\r\n    }\r\n    return WebGL;\r\n}(WebGLRenderingContext));\r\nexports.WebGL = WebGL;\r\n\n\n//# sourceURL=webpack://WebGL_Project/./src/GLContext.ts?");

/***/ }),

/***/ "./src/ShaderProgram.ts":
/*!******************************!*\
  !*** ./src/ShaderProgram.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.ShaderProgram = void 0;\r\nvar GLContext_1 = __webpack_require__(/*! ./GLContext */ \"./src/GLContext.ts\");\r\nvar ShaderProgram = /** @class */ (function () {\r\n    function ShaderProgram(vertexShader, fragmentShader) {\r\n        var shaderV = GLContext_1.WebGL.context.createShader(GLContext_1.WebGL.context.VERTEX_SHADER);\r\n        GLContext_1.WebGL.context.shaderSource(shaderV, vertexShader);\r\n        GLContext_1.WebGL.context.compileShader(shaderV);\r\n        if (!GLContext_1.WebGL.context.getShaderParameter(shaderV, GLContext_1.WebGL.context.COMPILE_STATUS)) {\r\n            console.error(GLContext_1.WebGL.context.getShaderInfoLog(shaderV));\r\n            throw new Error('Failed to compile vertex shader');\r\n        }\r\n        var shaderF = GLContext_1.WebGL.context.createShader(GLContext_1.WebGL.context.FRAGMENT_SHADER);\r\n        GLContext_1.WebGL.context.shaderSource(shaderF, fragmentShader);\r\n        GLContext_1.WebGL.context.compileShader(shaderF);\r\n        if (!GLContext_1.WebGL.context.getShaderParameter(shaderF, GLContext_1.WebGL.context.COMPILE_STATUS)) {\r\n            console.error(GLContext_1.WebGL.context.getShaderInfoLog(shaderF));\r\n            throw new Error('Failed to compile fragment shader');\r\n        }\r\n        this._program = GLContext_1.WebGL.context.createProgram();\r\n        if (!this._program) {\r\n            throw new Error('Failed to compile shader program');\r\n        }\r\n        GLContext_1.WebGL.context.attachShader(this._program, shaderV);\r\n        GLContext_1.WebGL.context.attachShader(this._program, shaderF);\r\n        GLContext_1.WebGL.context.linkProgram(this._program);\r\n        if (!GLContext_1.WebGL.context.getProgramParameter(this._program, GLContext_1.WebGL.context.LINK_STATUS)) {\r\n            console.error(GLContext_1.WebGL.context.getProgramInfoLog(this._program));\r\n            throw new Error('Failed to link program');\r\n        }\r\n    }\r\n    ShaderProgram.prototype.use = function () {\r\n        GLContext_1.WebGL.context.useProgram(this._program);\r\n    };\r\n    ShaderProgram.prototype.get = function () {\r\n        return this._program;\r\n    };\r\n    return ShaderProgram;\r\n}());\r\nexports.ShaderProgram = ShaderProgram;\r\n\n\n//# sourceURL=webpack://WebGL_Project/./src/ShaderProgram.ts?");

/***/ }),

/***/ "./src/Shaders.ts":
/*!************************!*\
  !*** ./src/Shaders.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.Shader = void 0;\r\nvar Shader = /** @class */ (function () {\r\n    function Shader() {\r\n    }\r\n    Shader.shadowMapV = \"\\n        attribute vec3 position;\\n        uniform mat4 Pmatrix, Lmatrix;\\n        varying float vDepth;\\n        \\n        void main(void) {\\n        vec4 position = Pmatrix*Lmatrix*vec4(position, 1.);\\n        float zBuf=position.z/position.w; //Z-buffer between -1 and 1\\n        vDepth=0.5+zBuf*0.5; //between 0 and 1\\n        gl_Position=position;\\n    }\";\r\n    Shader.shadowMapF = \"\\n\\\r\n        precision mediump float;\\n\\\r\n        varying float vDepth;\\n\\\r\n        \\n\\\r\n        void main(void) {\\n\\\r\n        gl_FragColor=vec4(vDepth, 0.,0.,1.);\\n\\\r\n    }\";\r\n    Shader.v = \"\\n\\\r\n        attribute vec3 position, normal;\\n\\\r\n        attribute vec2 uv;\\n\\\r\n        uniform mat4 Pmatrix, Vmatrix, Mmatrix;\\n\\\r\n        uniform mat4 Lmatrix, PmatrixLight;\\n\\\r\n        varying vec2 vUV;\\n\\\r\n        varying vec3 vNormal;\\n\\\r\n        varying vec3 vLightPos;\\n\\\r\n        \\n\\\r\n        void main(void) {\\n\\\r\n        vec4 lightPos = Lmatrix*vec4(position, 1.);\\n\\\r\n        \\n\\\r\n        \\n\\\r\n        lightPos=PmatrixLight*lightPos;\\n\\\r\n        \\n\\\r\n        \\n\\\r\n        vec3 lightPosDNC=lightPos.xyz/lightPos.w;\\n\\\r\n        \\n\\\r\n        \\n\\\r\n        \\n\\\r\n        vLightPos=vec3(0.5,0.5,0.5)+lightPosDNC*0.5;\\n\\\r\n        gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);\\n\\\r\n        vNormal=normal;\\n\\\r\n        vUV=uv;\\n\\\r\n    }\";\r\n    Shader.f = \"\\n\\\r\n        precision mediump float;\\n\\\r\n        uniform sampler2D sampler;\\n\\\r\n        uniform sampler2D samplerShadowMap;\\n\\\r\n        varying vec2 vUV;\\n\\\r\n        varying vec3 vNormal;\\n\\\r\n        varying vec3 vLightPos;\\n\\\r\n        const vec3 source_ambient_color=vec3(1.,1.,1.);\\n\\\r\n        const vec3 source_diffuse_color=vec3(1.,1.,1.);\\n\\\r\n        uniform vec3 source_direction;\\n\\\r\n        \\n\\\r\n        const vec3 mat_ambient_color=vec3(0.3,0.3,0.3);\\n\\\r\n        const vec3 mat_diffuse_color=vec3(1.,1.,1.);\\n\\\r\n        const float mat_shininess=10.;\\n\\\r\n        \\n\\\r\n        void main(void) {\\n\\\r\n        vec2 uv_shadowMap=vLightPos.xy;\\n\\\r\n        vec4 shadowMapColor=texture2D(samplerShadowMap, uv_shadowMap);\\n\\\r\n        float zShadowMap=shadowMapColor.r;\\n\\\r\n        float shadowCoeff=1.-smoothstep(0.002, 0.003, vLightPos.z-zShadowMap);\\n\\\r\n        vec3 color=vec3(texture2D(sampler, vUV));\\n\\\r\n        vec3 I_ambient=source_ambient_color*mat_ambient_color;\\n\\\r\n        vec3 I_diffuse=source_diffuse_color*mat_diffuse_color*max(0., dot(vNormal, source_direction));\\n\\\r\n        \\n\\\r\n        vec3 I=I_ambient+shadowCoeff*I_diffuse;\\n\\\r\n        gl_FragColor = vec4(I*color, 1.);\\n\\\r\n    }\";\r\n    return Shader;\r\n}());\r\nexports.Shader = Shader;\r\n\n\n//# sourceURL=webpack://WebGL_Project/./src/Shaders.ts?");

/***/ }),

/***/ "./src/Utils.ts":
/*!**********************!*\
  !*** ./src/Utils.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports) {

eval("\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nvar __generator = (this && this.__generator) || function (thisArg, body) {\r\n    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;\r\n    return g = { next: verb(0), \"throw\": verb(1), \"return\": verb(2) }, typeof Symbol === \"function\" && (g[Symbol.iterator] = function() { return this; }), g;\r\n    function verb(n) { return function (v) { return step([n, v]); }; }\r\n    function step(op) {\r\n        if (f) throw new TypeError(\"Generator is already executing.\");\r\n        while (_) try {\r\n            if (f = 1, y && (t = op[0] & 2 ? y[\"return\"] : op[0] ? y[\"throw\"] || ((t = y[\"return\"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;\r\n            if (y = 0, t) op = [op[0] & 2, t.value];\r\n            switch (op[0]) {\r\n                case 0: case 1: t = op; break;\r\n                case 4: _.label++; return { value: op[1], done: false };\r\n                case 5: _.label++; y = op[1]; op = [0]; continue;\r\n                case 7: op = _.ops.pop(); _.trys.pop(); continue;\r\n                default:\r\n                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }\r\n                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }\r\n                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }\r\n                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }\r\n                    if (t[2]) _.ops.pop();\r\n                    _.trys.pop(); continue;\r\n            }\r\n            op = body.call(thisArg, _);\r\n        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }\r\n        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };\r\n    }\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.Utils = void 0;\r\nvar Utils = /** @class */ (function () {\r\n    function Utils() {\r\n    }\r\n    Utils.get_json = function (url) {\r\n        return __awaiter(this, void 0, void 0, function () {\r\n            var result;\r\n            return __generator(this, function (_a) {\r\n                switch (_a.label) {\r\n                    case 0: return [4 /*yield*/, this.makeRequest(url)];\r\n                    case 1:\r\n                        result = _a.sent();\r\n                        return [2 /*return*/, JSON.parse(result)];\r\n                }\r\n            });\r\n        });\r\n    };\r\n    Utils.degToRad = function (angle) {\r\n        return (angle * Math.PI / 180);\r\n    };\r\n    Utils.get_projection = function (angle, a, zMin, zMax) {\r\n        var tan = Math.tan(this.degToRad(0.5 * angle)), A = -(zMax + zMin) / (zMax - zMin), B = (-2 * zMax * zMin) / (zMax - zMin);\r\n        return [\r\n            0.5 / tan, 0, 0, 0,\r\n            0, 0.5 * a / tan, 0, 0,\r\n            0, 0, A, -1,\r\n            0, 0, B, 0\r\n        ];\r\n    };\r\n    Utils.get_projection_ortho = function (width, a, zMin, zMax) {\r\n        var right = width / 2, //right bound of the projection volume\r\n        left = -width / 2, //left bound of the proj. vol.\r\n        top = (width / a) / 2, //top bound\r\n        bottom = -(width / a) / 2; //bottom bound\r\n        return [\r\n            2 / (right - left), 0, 0, 0,\r\n            0, 2 / (top - bottom), 0, 0,\r\n            0, 0, 2 / (zMax - zMin), 0,\r\n            0, 0, 0, 1\r\n        ];\r\n    };\r\n    Utils.lookAtDir = function (direction, up, C) {\r\n        var z = [-direction[0], -direction[1], -direction[2]];\r\n        var x = this.crossVector(up, z);\r\n        this.normalizeVector(x);\r\n        //orthogonal vector to (C,z) in the plane(y,u)\r\n        var y = this.crossVector(z, x); //zx\r\n        return [x[0], y[0], z[0], 0,\r\n            x[1], y[1], z[1], 0,\r\n            x[2], y[2], z[2], 0,\r\n            -(x[0] * C[0] + x[1] * C[1] + x[2] * C[2]),\r\n            -(y[0] * C[0] + y[1] * C[1] + y[2] * C[2]),\r\n            -(z[0] * C[0] + z[1] * C[1] + z[2] * C[2]),\r\n            1];\r\n    };\r\n    Utils.crossVector = function (u, v) {\r\n        return [u[1] * v[2] - v[1] * u[2],\r\n            u[2] * v[0] - u[0] * v[2],\r\n            u[0] * v[1] - u[1] * v[0]];\r\n    };\r\n    Utils.normalizeVector = function (v) {\r\n        var n = this.sizeVector(v);\r\n        v[0] /= n;\r\n        v[1] /= n;\r\n        v[2] /= n;\r\n    };\r\n    Utils.sizeVector = function (v) {\r\n        return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);\r\n    };\r\n    Utils.get_I4 = function () {\r\n        return [1, 0, 0, 0,\r\n            0, 1, 0, 0,\r\n            0, 0, 1, 0,\r\n            0, 0, 0, 1];\r\n    };\r\n    Utils.set_I4 = function (m) {\r\n        m[0] = 1, m[1] = 0, m[2] = 0, m[3] = 0,\r\n            m[4] = 0, m[5] = 1, m[6] = 0, m[7] = 0,\r\n            m[8] = 0, m[9] = 0, m[10] = 1, m[11] = 0,\r\n            m[12] = 0, m[13] = 0, m[14] = 0, m[15] = 1;\r\n    };\r\n    Utils.rotateX = function (m, angle) {\r\n        var c = Math.cos(angle);\r\n        var s = Math.sin(angle);\r\n        var mv1 = m[1], mv5 = m[5], mv9 = m[9];\r\n        m[1] = m[1] * c - m[2] * s;\r\n        m[5] = m[5] * c - m[6] * s;\r\n        m[9] = m[9] * c - m[10] * s;\r\n        m[2] = m[2] * c + mv1 * s;\r\n        m[6] = m[6] * c + mv5 * s;\r\n        m[10] = m[10] * c + mv9 * s;\r\n    };\r\n    Utils.rotateY = function (m, angle) {\r\n        var c = Math.cos(angle);\r\n        var s = Math.sin(angle);\r\n        var mv0 = m[0], mv4 = m[4], mv8 = m[8];\r\n        m[0] = c * m[0] + s * m[2];\r\n        m[4] = c * m[4] + s * m[6];\r\n        m[8] = c * m[8] + s * m[10];\r\n        m[2] = c * m[2] - s * mv0;\r\n        m[6] = c * m[6] - s * mv4;\r\n        m[10] = c * m[10] - s * mv8;\r\n    };\r\n    Utils.rotateZ = function (m, angle) {\r\n        var c = Math.cos(angle);\r\n        var s = Math.sin(angle);\r\n        var mv0 = m[0], mv4 = m[4], mv8 = m[8];\r\n        m[0] = c * m[0] - s * m[1];\r\n        m[4] = c * m[4] - s * m[5];\r\n        m[8] = c * m[8] - s * m[9];\r\n        m[1] = c * m[1] + s * mv0;\r\n        m[5] = c * m[5] + s * mv4;\r\n        m[9] = c * m[9] + s * mv8;\r\n    };\r\n    Utils.translateZ = function (m, t) {\r\n        m[14] += t;\r\n    };\r\n    Utils.translateY = function (m, t) {\r\n        m[13] += t;\r\n    };\r\n    Utils.makeRequest = function (url, responseType, method) {\r\n        if (responseType === void 0) { responseType = \"\"; }\r\n        if (method === void 0) { method = 'GET'; }\r\n        return new Promise(function (resolve, reject) {\r\n            var xhr = new XMLHttpRequest();\r\n            xhr.open(method, url);\r\n            xhr.onload = function () {\r\n                if (this.status >= 200 && this.status < 300) {\r\n                    resolve(xhr.response);\r\n                }\r\n                else {\r\n                    reject({\r\n                        status: this.status,\r\n                        statusText: xhr.statusText\r\n                    });\r\n                }\r\n            };\r\n            xhr.onerror = function () {\r\n                reject({\r\n                    status: this.status,\r\n                    statusText: xhr.statusText\r\n                });\r\n            };\r\n            xhr.send();\r\n        });\r\n    };\r\n    return Utils;\r\n}());\r\nexports.Utils = Utils;\r\n\n\n//# sourceURL=webpack://WebGL_Project/./src/Utils.ts?");

/***/ }),

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nvar __generator = (this && this.__generator) || function (thisArg, body) {\r\n    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;\r\n    return g = { next: verb(0), \"throw\": verb(1), \"return\": verb(2) }, typeof Symbol === \"function\" && (g[Symbol.iterator] = function() { return this; }), g;\r\n    function verb(n) { return function (v) { return step([n, v]); }; }\r\n    function step(op) {\r\n        if (f) throw new TypeError(\"Generator is already executing.\");\r\n        while (_) try {\r\n            if (f = 1, y && (t = op[0] & 2 ? y[\"return\"] : op[0] ? y[\"throw\"] || ((t = y[\"return\"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;\r\n            if (y = 0, t) op = [op[0] & 2, t.value];\r\n            switch (op[0]) {\r\n                case 0: case 1: t = op; break;\r\n                case 4: _.label++; return { value: op[1], done: false };\r\n                case 5: _.label++; y = op[1]; op = [0]; continue;\r\n                case 7: op = _.ops.pop(); _.trys.pop(); continue;\r\n                default:\r\n                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }\r\n                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }\r\n                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }\r\n                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }\r\n                    if (t[2]) _.ops.pop();\r\n                    _.trys.pop(); continue;\r\n            }\r\n            op = body.call(thisArg, _);\r\n        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }\r\n        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };\r\n    }\r\n};\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\n// app.ts\r\nvar GLContext_1 = __webpack_require__(/*! ./GLContext */ \"./src/GLContext.ts\");\r\nvar Shaders_1 = __webpack_require__(/*! ./Shaders */ \"./src/Shaders.ts\");\r\nvar Utils_1 = __webpack_require__(/*! ./Utils */ \"./src/Utils.ts\");\r\nvar ShaderProgram_1 = __webpack_require__(/*! ./ShaderProgram */ \"./src/ShaderProgram.ts\");\r\ndocument.addEventListener('DOMContentLoaded', function () { return __awaiter(void 0, void 0, void 0, function () {\r\n    var CANVAS, AMORTIZATION, drag, old_x, old_y, dX, dY, mouseDown, mouseUp, mouseMove, EXT, shaderProgramShadow, _PmatrixShadow, _LmatrixShadow, _positionShadow, shaderProgram, _Pmatrix, _Vmatrix, _Mmatrix, _Lmatrix, _PmatrixLight, _lightDirection, _sampler, _samplerShadowMap, _uv, _position, _normal, LIGHTDIR, CUBE_VERTEX, CUBE_FACES, CUBE_NPOINTS, dragon, floor_vertices, FLOOR_VERTEX, FLOOR_INDICES, PROJMATRIX, MOVEMATRIX, VIEWMATRIX, THETA, PHI, PROJMATRIX_SHADOW, LIGHTMATRIX, get_texture, cube_texture, floor_texture, fb, rb, texture_rtt, time_old, animate;\r\n    return __generator(this, function (_a) {\r\n        switch (_a.label) {\r\n            case 0:\r\n                CANVAS = document.getElementById('container');\r\n                AMORTIZATION = 0.95;\r\n                drag = false;\r\n                dX = 0, dY = 0;\r\n                mouseDown = function (e) {\r\n                    drag = true;\r\n                    old_x = e.pageX, old_y = e.pageY;\r\n                    e.preventDefault();\r\n                    return false;\r\n                };\r\n                mouseUp = function (e) {\r\n                    drag = false;\r\n                };\r\n                mouseMove = function (e) {\r\n                    if (!drag)\r\n                        return false;\r\n                    dX = (e.pageX - old_x) * Math.PI / CANVAS.width,\r\n                        dY = (e.pageY - old_y) * Math.PI / CANVAS.height;\r\n                    THETA += dX;\r\n                    PHI += dY;\r\n                    old_x = e.pageX, old_y = e.pageY;\r\n                    e.preventDefault();\r\n                };\r\n                CANVAS.addEventListener('mousedown', mouseDown, false);\r\n                CANVAS.addEventListener('mouseup', mouseUp, false);\r\n                CANVAS.addEventListener('mouseout', mouseUp, false);\r\n                CANVAS.addEventListener('mousemove', mouseMove, false);\r\n                /*========================= GET WEBGL CONTEXT ========================= */\r\n                try {\r\n                    GLContext_1.WebGL.context = CANVAS.getContext('experimental-webgl', { antialias: true });\r\n                    EXT = GLContext_1.WebGL.context.getExtension('OES_element_index_uint') ||\r\n                        GLContext_1.WebGL.context.getExtension('MOZ_OES_element_index_uint') ||\r\n                        GLContext_1.WebGL.context.getExtension('WEBKIT_OES_element_index_uint');\r\n                }\r\n                catch (e) {\r\n                    alert('You are not webgl compatible :(');\r\n                    return [2 /*return*/, false];\r\n                }\r\n                shaderProgramShadow = new ShaderProgram_1.ShaderProgram(Shaders_1.Shader.shadowMapV, Shaders_1.Shader.shadowMapF);\r\n                _PmatrixShadow = GLContext_1.WebGL.context.getUniformLocation(shaderProgramShadow.get(), 'Pmatrix');\r\n                _LmatrixShadow = GLContext_1.WebGL.context.getUniformLocation(shaderProgramShadow.get(), 'Lmatrix');\r\n                _positionShadow = GLContext_1.WebGL.context.getAttribLocation(shaderProgramShadow.get(), 'position');\r\n                shaderProgram = new ShaderProgram_1.ShaderProgram(Shaders_1.Shader.v, Shaders_1.Shader.f);\r\n                _Pmatrix = GLContext_1.WebGL.context.getUniformLocation(shaderProgram.get(), 'Pmatrix');\r\n                _Vmatrix = GLContext_1.WebGL.context.getUniformLocation(shaderProgram.get(), 'Vmatrix');\r\n                _Mmatrix = GLContext_1.WebGL.context.getUniformLocation(shaderProgram.get(), 'Mmatrix');\r\n                _Lmatrix = GLContext_1.WebGL.context.getUniformLocation(shaderProgram.get(), 'Lmatrix');\r\n                _PmatrixLight = GLContext_1.WebGL.context.getUniformLocation(shaderProgram.get(), 'PmatrixLight');\r\n                _lightDirection = GLContext_1.WebGL.context.getUniformLocation(shaderProgram.get(), 'source_direction');\r\n                _sampler = GLContext_1.WebGL.context.getUniformLocation(shaderProgram.get(), 'sampler');\r\n                _samplerShadowMap = GLContext_1.WebGL.context.getUniformLocation(shaderProgram.get(), 'samplerShadowMap');\r\n                _uv = GLContext_1.WebGL.context.getAttribLocation(shaderProgram.get(), 'uv');\r\n                _position = GLContext_1.WebGL.context.getAttribLocation(shaderProgram.get(), 'position');\r\n                _normal = GLContext_1.WebGL.context.getAttribLocation(shaderProgram.get(), 'normal');\r\n                shaderProgram.use();\r\n                GLContext_1.WebGL.context.uniform1i(_sampler, 0);\r\n                GLContext_1.WebGL.context.uniform1i(_samplerShadowMap, 1);\r\n                LIGHTDIR = [0.58, 0.58, -0.58];\r\n                GLContext_1.WebGL.context.uniform3fv(_lightDirection, LIGHTDIR);\r\n                CUBE_VERTEX = false, CUBE_FACES = false, CUBE_NPOINTS = 0;\r\n                return [4 /*yield*/, Utils_1.Utils.get_json('resources/dragon.json')];\r\n            case 1:\r\n                dragon = _a.sent();\r\n                CUBE_VERTEX = GLContext_1.WebGL.context.createBuffer();\r\n                console.log(CUBE_VERTEX);\r\n                GLContext_1.WebGL.context.bindBuffer(GLContext_1.WebGL.context.ARRAY_BUFFER, CUBE_VERTEX);\r\n                GLContext_1.WebGL.context.bufferData(GLContext_1.WebGL.context.ARRAY_BUFFER, new Float32Array(dragon.vertices), GLContext_1.WebGL.context.STATIC_DRAW);\r\n                //faces\r\n                CUBE_FACES = GLContext_1.WebGL.context.createBuffer();\r\n                GLContext_1.WebGL.context.bindBuffer(GLContext_1.WebGL.context.ELEMENT_ARRAY_BUFFER, CUBE_FACES);\r\n                GLContext_1.WebGL.context.bufferData(GLContext_1.WebGL.context.ELEMENT_ARRAY_BUFFER, new Uint32Array(dragon.indices), GLContext_1.WebGL.context.STATIC_DRAW);\r\n                CUBE_NPOINTS = dragon.indices.length;\r\n                floor_vertices = [\r\n                    -10, 0, -10, 0, 1, 0, 0, 0,\r\n                    -10, 0, 10, 0, 1, 0, 0, 1,\r\n                    10, 0, 10, 0, 1, 0, 1, 1,\r\n                    10, 0, -10, 0, 1, 0, 1, 0\r\n                ];\r\n                FLOOR_VERTEX = GLContext_1.WebGL.context.createBuffer();\r\n                GLContext_1.WebGL.context.bindBuffer(GLContext_1.WebGL.context.ARRAY_BUFFER, FLOOR_VERTEX);\r\n                GLContext_1.WebGL.context.bufferData(GLContext_1.WebGL.context.ARRAY_BUFFER, new Float32Array(floor_vertices), GLContext_1.WebGL.context.STATIC_DRAW);\r\n                FLOOR_INDICES = GLContext_1.WebGL.context.createBuffer();\r\n                GLContext_1.WebGL.context.bindBuffer(GLContext_1.WebGL.context.ELEMENT_ARRAY_BUFFER, FLOOR_INDICES);\r\n                GLContext_1.WebGL.context.bufferData(GLContext_1.WebGL.context.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), GLContext_1.WebGL.context.STATIC_DRAW);\r\n                PROJMATRIX = Utils_1.Utils.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);\r\n                MOVEMATRIX = Utils_1.Utils.get_I4();\r\n                VIEWMATRIX = Utils_1.Utils.get_I4();\r\n                Utils_1.Utils.translateZ(VIEWMATRIX, -20);\r\n                Utils_1.Utils.translateY(VIEWMATRIX, -4);\r\n                THETA = 0, PHI = 0;\r\n                PROJMATRIX_SHADOW = Utils_1.Utils.get_projection_ortho(20, 1, 5, 28);\r\n                LIGHTMATRIX = Utils_1.Utils.lookAtDir(LIGHTDIR, [0, 1, 0], [0, 0, 0]);\r\n                get_texture = function (image_URL) {\r\n                    return __awaiter(this, void 0, void 0, function () {\r\n                        var image, texture;\r\n                        return __generator(this, function (_a) {\r\n                            image = new Image();\r\n                            image.src = image_URL;\r\n                            texture = GLContext_1.WebGL.context.createTexture();\r\n                            image.onload = function (e) {\r\n                                // result includes identifier 'data:image/png;base64,' plus the base64 data\r\n                                GLContext_1.WebGL.context.pixelStorei(GLContext_1.WebGL.context.UNPACK_FLIP_Y_WEBGL, true);\r\n                                GLContext_1.WebGL.context.bindTexture(GLContext_1.WebGL.context.TEXTURE_2D, texture);\r\n                                GLContext_1.WebGL.context.texImage2D(GLContext_1.WebGL.context.TEXTURE_2D, 0, GLContext_1.WebGL.context.RGBA, GLContext_1.WebGL.context.RGBA, GLContext_1.WebGL.context.UNSIGNED_BYTE, image);\r\n                                GLContext_1.WebGL.context.texParameteri(GLContext_1.WebGL.context.TEXTURE_2D, GLContext_1.WebGL.context.TEXTURE_MAG_FILTER, GLContext_1.WebGL.context.LINEAR);\r\n                                GLContext_1.WebGL.context.texParameteri(GLContext_1.WebGL.context.TEXTURE_2D, GLContext_1.WebGL.context.TEXTURE_MIN_FILTER, GLContext_1.WebGL.context.NEAREST_MIPMAP_LINEAR);\r\n                                GLContext_1.WebGL.context.generateMipmap(GLContext_1.WebGL.context.TEXTURE_2D);\r\n                                GLContext_1.WebGL.context.bindTexture(GLContext_1.WebGL.context.TEXTURE_2D, null);\r\n                            };\r\n                            return [2 /*return*/, texture];\r\n                        });\r\n                    });\r\n                };\r\n                return [4 /*yield*/, get_texture(\"resources/dragon.png\")];\r\n            case 2:\r\n                cube_texture = _a.sent();\r\n                return [4 /*yield*/, get_texture('resources/granit.jpg')];\r\n            case 3:\r\n                floor_texture = _a.sent();\r\n                fb = GLContext_1.WebGL.context.createFramebuffer();\r\n                GLContext_1.WebGL.context.bindFramebuffer(GLContext_1.WebGL.context.FRAMEBUFFER, fb);\r\n                rb = GLContext_1.WebGL.context.createRenderbuffer();\r\n                GLContext_1.WebGL.context.bindRenderbuffer(GLContext_1.WebGL.context.RENDERBUFFER, rb);\r\n                GLContext_1.WebGL.context.renderbufferStorage(GLContext_1.WebGL.context.RENDERBUFFER, GLContext_1.WebGL.context.DEPTH_COMPONENT16, 512, 512);\r\n                GLContext_1.WebGL.context.framebufferRenderbuffer(GLContext_1.WebGL.context.FRAMEBUFFER, GLContext_1.WebGL.context.DEPTH_ATTACHMENT, GLContext_1.WebGL.context.RENDERBUFFER, rb);\r\n                texture_rtt = GLContext_1.WebGL.context.createTexture();\r\n                GLContext_1.WebGL.context.bindTexture(GLContext_1.WebGL.context.TEXTURE_2D, texture_rtt);\r\n                GLContext_1.WebGL.context.texParameteri(GLContext_1.WebGL.context.TEXTURE_2D, GLContext_1.WebGL.context.TEXTURE_MAG_FILTER, GLContext_1.WebGL.context.LINEAR);\r\n                GLContext_1.WebGL.context.texParameteri(GLContext_1.WebGL.context.TEXTURE_2D, GLContext_1.WebGL.context.TEXTURE_MIN_FILTER, GLContext_1.WebGL.context.LINEAR);\r\n                GLContext_1.WebGL.context.texImage2D(GLContext_1.WebGL.context.TEXTURE_2D, 0, GLContext_1.WebGL.context.RGBA, 512, 512, 0, GLContext_1.WebGL.context.RGBA, GLContext_1.WebGL.context.UNSIGNED_BYTE, null);\r\n                GLContext_1.WebGL.context.framebufferTexture2D(GLContext_1.WebGL.context.FRAMEBUFFER, GLContext_1.WebGL.context.COLOR_ATTACHMENT0, GLContext_1.WebGL.context.TEXTURE_2D, texture_rtt, 0);\r\n                GLContext_1.WebGL.context.bindTexture(GLContext_1.WebGL.context.TEXTURE_2D, null);\r\n                GLContext_1.WebGL.context.bindFramebuffer(GLContext_1.WebGL.context.FRAMEBUFFER, null);\r\n                /*========================= DRAWING ========================= */\r\n                GLContext_1.WebGL.context.enable(GLContext_1.WebGL.context.DEPTH_TEST);\r\n                GLContext_1.WebGL.context.depthFunc(GLContext_1.WebGL.context.LEQUAL);\r\n                GLContext_1.WebGL.context.clearDepth(1.0);\r\n                time_old = 0;\r\n                animate = function (time) {\r\n                    var dt = time - time_old;\r\n                    if (!drag) {\r\n                        dX *= AMORTIZATION, dY *= AMORTIZATION;\r\n                        THETA += dX, PHI += dY;\r\n                    }\r\n                    Utils_1.Utils.set_I4(MOVEMATRIX);\r\n                    Utils_1.Utils.rotateY(MOVEMATRIX, THETA);\r\n                    Utils_1.Utils.rotateX(MOVEMATRIX, PHI);\r\n                    time_old = time;\r\n                    //===================== RENDER THE SHADOW MAP ==========================\r\n                    GLContext_1.WebGL.context.bindFramebuffer(GLContext_1.WebGL.context.FRAMEBUFFER, fb);\r\n                    shaderProgramShadow.use();\r\n                    GLContext_1.WebGL.context.enableVertexAttribArray(_positionShadow);\r\n                    GLContext_1.WebGL.context.viewport(0.0, 0.0, 512, 512);\r\n                    GLContext_1.WebGL.context.clearColor(0.0, 0.0, 0.0, 1.0); //red -> Z=Zfar on the shadow map\r\n                    GLContext_1.WebGL.context.clear(GLContext_1.WebGL.context.COLOR_BUFFER_BIT | GLContext_1.WebGL.context.DEPTH_BUFFER_BIT);\r\n                    GLContext_1.WebGL.context.uniformMatrix4fv(_PmatrixShadow, false, PROJMATRIX_SHADOW);\r\n                    GLContext_1.WebGL.context.uniformMatrix4fv(_LmatrixShadow, false, LIGHTMATRIX);\r\n                    //DRAW THE DRAGON\r\n                    GLContext_1.WebGL.context.bindBuffer(GLContext_1.WebGL.context.ARRAY_BUFFER, CUBE_VERTEX);\r\n                    GLContext_1.WebGL.context.vertexAttribPointer(_positionShadow, 3, GLContext_1.WebGL.context.FLOAT, false, 4 * (3 + 3 + 2), 0);\r\n                    GLContext_1.WebGL.context.bindBuffer(GLContext_1.WebGL.context.ELEMENT_ARRAY_BUFFER, CUBE_FACES);\r\n                    GLContext_1.WebGL.context.drawElements(GLContext_1.WebGL.context.TRIANGLES, CUBE_NPOINTS, GLContext_1.WebGL.context.UNSIGNED_INT, 0);\r\n                    //DRAW THE FLOOR\r\n                    GLContext_1.WebGL.context.bindBuffer(GLContext_1.WebGL.context.ARRAY_BUFFER, FLOOR_VERTEX);\r\n                    GLContext_1.WebGL.context.vertexAttribPointer(_positionShadow, 3, GLContext_1.WebGL.context.FLOAT, false, 4 * (3 + 3 + 2), 0);\r\n                    GLContext_1.WebGL.context.bindBuffer(GLContext_1.WebGL.context.ELEMENT_ARRAY_BUFFER, FLOOR_INDICES);\r\n                    GLContext_1.WebGL.context.drawElements(GLContext_1.WebGL.context.TRIANGLES, 6, GLContext_1.WebGL.context.UNSIGNED_SHORT, 0);\r\n                    GLContext_1.WebGL.context.disableVertexAttribArray(_positionShadow);\r\n                    //==================== RENDER THE SCENE ===========================\r\n                    GLContext_1.WebGL.context.bindFramebuffer(GLContext_1.WebGL.context.FRAMEBUFFER, null);\r\n                    shaderProgram.use();\r\n                    GLContext_1.WebGL.context.enableVertexAttribArray(_uv);\r\n                    GLContext_1.WebGL.context.enableVertexAttribArray(_position);\r\n                    GLContext_1.WebGL.context.enableVertexAttribArray(_normal);\r\n                    GLContext_1.WebGL.context.viewport(0.0, 0.0, CANVAS.width, CANVAS.height);\r\n                    GLContext_1.WebGL.context.clearColor(0.4, 0.0, 0.0, 1.0);\r\n                    GLContext_1.WebGL.context.clear(GLContext_1.WebGL.context.COLOR_BUFFER_BIT | GLContext_1.WebGL.context.DEPTH_BUFFER_BIT);\r\n                    GLContext_1.WebGL.context.uniformMatrix4fv(_Pmatrix, false, PROJMATRIX);\r\n                    GLContext_1.WebGL.context.uniformMatrix4fv(_Vmatrix, false, VIEWMATRIX);\r\n                    GLContext_1.WebGL.context.uniformMatrix4fv(_Mmatrix, false, MOVEMATRIX);\r\n                    GLContext_1.WebGL.context.uniformMatrix4fv(_PmatrixLight, false, PROJMATRIX_SHADOW);\r\n                    GLContext_1.WebGL.context.uniformMatrix4fv(_Lmatrix, false, LIGHTMATRIX);\r\n                    //DRAW THE DRAGON\r\n                    if (cube_texture) {\r\n                        GLContext_1.WebGL.context.activeTexture(GLContext_1.WebGL.context.TEXTURE1);\r\n                        GLContext_1.WebGL.context.bindTexture(GLContext_1.WebGL.context.TEXTURE_2D, texture_rtt);\r\n                        GLContext_1.WebGL.context.activeTexture(GLContext_1.WebGL.context.TEXTURE0);\r\n                        GLContext_1.WebGL.context.bindTexture(GLContext_1.WebGL.context.TEXTURE_2D, cube_texture);\r\n                    }\r\n                    GLContext_1.WebGL.context.bindBuffer(GLContext_1.WebGL.context.ARRAY_BUFFER, CUBE_VERTEX);\r\n                    GLContext_1.WebGL.context.vertexAttribPointer(_position, 3, GLContext_1.WebGL.context.FLOAT, false, 4 * (3 + 3 + 2), 0);\r\n                    GLContext_1.WebGL.context.vertexAttribPointer(_normal, 3, GLContext_1.WebGL.context.FLOAT, false, 4 * (3 + 3 + 2), 3 * 4);\r\n                    GLContext_1.WebGL.context.vertexAttribPointer(_uv, 2, GLContext_1.WebGL.context.FLOAT, false, 4 * (3 + 3 + 2), (3 + 3) * 4);\r\n                    GLContext_1.WebGL.context.bindBuffer(GLContext_1.WebGL.context.ELEMENT_ARRAY_BUFFER, CUBE_FACES);\r\n                    GLContext_1.WebGL.context.drawElements(GLContext_1.WebGL.context.TRIANGLES, CUBE_NPOINTS, GLContext_1.WebGL.context.UNSIGNED_INT, 0);\r\n                    //DRAW THE FLOOR\r\n                    if (floor_texture) {\r\n                        GLContext_1.WebGL.context.bindTexture(GLContext_1.WebGL.context.TEXTURE_2D, floor_texture);\r\n                    }\r\n                    GLContext_1.WebGL.context.bindBuffer(GLContext_1.WebGL.context.ARRAY_BUFFER, FLOOR_VERTEX);\r\n                    GLContext_1.WebGL.context.vertexAttribPointer(_position, 3, GLContext_1.WebGL.context.FLOAT, false, 4 * (3 + 3 + 2), 0);\r\n                    GLContext_1.WebGL.context.vertexAttribPointer(_normal, 3, GLContext_1.WebGL.context.FLOAT, false, 4 * (3 + 3 + 2), 3 * 4);\r\n                    GLContext_1.WebGL.context.vertexAttribPointer(_uv, 2, GLContext_1.WebGL.context.FLOAT, false, 4 * (3 + 3 + 2), (3 + 3) * 4);\r\n                    GLContext_1.WebGL.context.bindBuffer(GLContext_1.WebGL.context.ELEMENT_ARRAY_BUFFER, FLOOR_INDICES);\r\n                    GLContext_1.WebGL.context.drawElements(GLContext_1.WebGL.context.TRIANGLES, 6, GLContext_1.WebGL.context.UNSIGNED_SHORT, 0);\r\n                    GLContext_1.WebGL.context.disableVertexAttribArray(_uv);\r\n                    GLContext_1.WebGL.context.disableVertexAttribArray(_position);\r\n                    GLContext_1.WebGL.context.disableVertexAttribArray(_normal);\r\n                    GLContext_1.WebGL.context.flush();\r\n                    window.requestAnimationFrame(animate);\r\n                };\r\n                animate(0);\r\n                return [2 /*return*/];\r\n        }\r\n    });\r\n}); });\r\n\n\n//# sourceURL=webpack://WebGL_Project/./src/app.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 		__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 		module = execOptions.module;
/******/ 		execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	(() => {
/******/ 		__webpack_require__.hmrF = () => ("main." + __webpack_require__.h() + ".hot-update.json");
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => ("6080efe0e3dd7b17ac82")
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "WebGL_Project:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			;
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	(() => {
/******/ 		var currentModuleData = {};
/******/ 		var installedModules = __webpack_require__.c;
/******/ 		
/******/ 		// module and require creation
/******/ 		var currentChildModule;
/******/ 		var currentParents = [];
/******/ 		
/******/ 		// status
/******/ 		var registeredStatusHandlers = [];
/******/ 		var currentStatus = "idle";
/******/ 		
/******/ 		// while downloading
/******/ 		var blockingPromises;
/******/ 		
/******/ 		// The update info
/******/ 		var currentUpdateApplyHandlers;
/******/ 		var queuedInvalidatedModules;
/******/ 		
/******/ 		// eslint-disable-next-line no-unused-vars
/******/ 		__webpack_require__.hmrD = currentModuleData;
/******/ 		
/******/ 		__webpack_require__.i.push(function (options) {
/******/ 			var module = options.module;
/******/ 			var require = createRequire(options.require, options.id);
/******/ 			module.hot = createModuleHotObject(options.id, module);
/******/ 			module.parents = currentParents;
/******/ 			module.children = [];
/******/ 			currentParents = [];
/******/ 			options.require = require;
/******/ 		});
/******/ 		
/******/ 		__webpack_require__.hmrC = {};
/******/ 		__webpack_require__.hmrI = {};
/******/ 		
/******/ 		function createRequire(require, moduleId) {
/******/ 			var me = installedModules[moduleId];
/******/ 			if (!me) return require;
/******/ 			var fn = function (request) {
/******/ 				if (me.hot.active) {
/******/ 					if (installedModules[request]) {
/******/ 						var parents = installedModules[request].parents;
/******/ 						if (parents.indexOf(moduleId) === -1) {
/******/ 							parents.push(moduleId);
/******/ 						}
/******/ 					} else {
/******/ 						currentParents = [moduleId];
/******/ 						currentChildModule = request;
/******/ 					}
/******/ 					if (me.children.indexOf(request) === -1) {
/******/ 						me.children.push(request);
/******/ 					}
/******/ 				} else {
/******/ 					console.warn(
/******/ 						"[HMR] unexpected require(" +
/******/ 							request +
/******/ 							") from disposed module " +
/******/ 							moduleId
/******/ 					);
/******/ 					currentParents = [];
/******/ 				}
/******/ 				return require(request);
/******/ 			};
/******/ 			var createPropertyDescriptor = function (name) {
/******/ 				return {
/******/ 					configurable: true,
/******/ 					enumerable: true,
/******/ 					get: function () {
/******/ 						return require[name];
/******/ 					},
/******/ 					set: function (value) {
/******/ 						require[name] = value;
/******/ 					}
/******/ 				};
/******/ 			};
/******/ 			for (var name in require) {
/******/ 				if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
/******/ 					Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 				}
/******/ 			}
/******/ 			fn.e = function (chunkId) {
/******/ 				return trackBlockingPromise(require.e(chunkId));
/******/ 			};
/******/ 			return fn;
/******/ 		}
/******/ 		
/******/ 		function createModuleHotObject(moduleId, me) {
/******/ 			var hot = {
/******/ 				// private stuff
/******/ 				_acceptedDependencies: {},
/******/ 				_declinedDependencies: {},
/******/ 				_selfAccepted: false,
/******/ 				_selfDeclined: false,
/******/ 				_selfInvalidated: false,
/******/ 				_disposeHandlers: [],
/******/ 				_main: currentChildModule !== moduleId,
/******/ 				_requireSelf: function () {
/******/ 					currentParents = me.parents.slice();
/******/ 					currentChildModule = moduleId;
/******/ 					__webpack_require__(moduleId);
/******/ 				},
/******/ 		
/******/ 				// Module API
/******/ 				active: true,
/******/ 				accept: function (dep, callback) {
/******/ 					if (dep === undefined) hot._selfAccepted = true;
/******/ 					else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._acceptedDependencies[dep[i]] = callback || function () {};
/******/ 					else hot._acceptedDependencies[dep] = callback || function () {};
/******/ 				},
/******/ 				decline: function (dep) {
/******/ 					if (dep === undefined) hot._selfDeclined = true;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._declinedDependencies[dep[i]] = true;
/******/ 					else hot._declinedDependencies[dep] = true;
/******/ 				},
/******/ 				dispose: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				addDisposeHandler: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				removeDisposeHandler: function (callback) {
/******/ 					var idx = hot._disposeHandlers.indexOf(callback);
/******/ 					if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 				},
/******/ 				invalidate: function () {
/******/ 					this._selfInvalidated = true;
/******/ 					switch (currentStatus) {
/******/ 						case "idle":
/******/ 							currentUpdateApplyHandlers = [];
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							setStatus("ready");
/******/ 							break;
/******/ 						case "ready":
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							break;
/******/ 						case "prepare":
/******/ 						case "check":
/******/ 						case "dispose":
/******/ 						case "apply":
/******/ 							(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
/******/ 								moduleId
/******/ 							);
/******/ 							break;
/******/ 						default:
/******/ 							// ignore requests in error states
/******/ 							break;
/******/ 					}
/******/ 				},
/******/ 		
/******/ 				// Management API
/******/ 				check: hotCheck,
/******/ 				apply: hotApply,
/******/ 				status: function (l) {
/******/ 					if (!l) return currentStatus;
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				addStatusHandler: function (l) {
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				removeStatusHandler: function (l) {
/******/ 					var idx = registeredStatusHandlers.indexOf(l);
/******/ 					if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
/******/ 				},
/******/ 		
/******/ 				//inherit from previous dispose call
/******/ 				data: currentModuleData[moduleId]
/******/ 			};
/******/ 			currentChildModule = undefined;
/******/ 			return hot;
/******/ 		}
/******/ 		
/******/ 		function setStatus(newStatus) {
/******/ 			currentStatus = newStatus;
/******/ 			for (var i = 0; i < registeredStatusHandlers.length; i++)
/******/ 				registeredStatusHandlers[i].call(null, newStatus);
/******/ 		}
/******/ 		
/******/ 		function trackBlockingPromise(promise) {
/******/ 			switch (currentStatus) {
/******/ 				case "ready":
/******/ 					setStatus("prepare");
/******/ 					blockingPromises.push(promise);
/******/ 					waitForBlockingPromises(function () {
/******/ 						setStatus("ready");
/******/ 					});
/******/ 					return promise;
/******/ 				case "prepare":
/******/ 					blockingPromises.push(promise);
/******/ 					return promise;
/******/ 				default:
/******/ 					return promise;
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function waitForBlockingPromises(fn) {
/******/ 			if (blockingPromises.length === 0) return fn();
/******/ 			var blocker = blockingPromises;
/******/ 			blockingPromises = [];
/******/ 			return Promise.all(blocker).then(function () {
/******/ 				return waitForBlockingPromises(fn);
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotCheck(applyOnUpdate) {
/******/ 			if (currentStatus !== "idle") {
/******/ 				throw new Error("check() is only allowed in idle status");
/******/ 			}
/******/ 			setStatus("check");
/******/ 			return __webpack_require__.hmrM().then(function (update) {
/******/ 				if (!update) {
/******/ 					setStatus(applyInvalidatedModules() ? "ready" : "idle");
/******/ 					return null;
/******/ 				}
/******/ 		
/******/ 				setStatus("prepare");
/******/ 		
/******/ 				var updatedModules = [];
/******/ 				blockingPromises = [];
/******/ 				currentUpdateApplyHandlers = [];
/******/ 		
/******/ 				return Promise.all(
/******/ 					Object.keys(__webpack_require__.hmrC).reduce(function (
/******/ 						promises,
/******/ 						key
/******/ 					) {
/******/ 						__webpack_require__.hmrC[key](
/******/ 							update.c,
/******/ 							update.r,
/******/ 							update.m,
/******/ 							promises,
/******/ 							currentUpdateApplyHandlers,
/******/ 							updatedModules
/******/ 						);
/******/ 						return promises;
/******/ 					},
/******/ 					[])
/******/ 				).then(function () {
/******/ 					return waitForBlockingPromises(function () {
/******/ 						if (applyOnUpdate) {
/******/ 							return internalApply(applyOnUpdate);
/******/ 						} else {
/******/ 							setStatus("ready");
/******/ 		
/******/ 							return updatedModules;
/******/ 						}
/******/ 					});
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotApply(options) {
/******/ 			if (currentStatus !== "ready") {
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw new Error("apply() is only allowed in ready status");
/******/ 				});
/******/ 			}
/******/ 			return internalApply(options);
/******/ 		}
/******/ 		
/******/ 		function internalApply(options) {
/******/ 			options = options || {};
/******/ 		
/******/ 			applyInvalidatedModules();
/******/ 		
/******/ 			var results = currentUpdateApplyHandlers.map(function (handler) {
/******/ 				return handler(options);
/******/ 			});
/******/ 			currentUpdateApplyHandlers = undefined;
/******/ 		
/******/ 			var errors = results
/******/ 				.map(function (r) {
/******/ 					return r.error;
/******/ 				})
/******/ 				.filter(Boolean);
/******/ 		
/******/ 			if (errors.length > 0) {
/******/ 				setStatus("abort");
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw errors[0];
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			// Now in "dispose" phase
/******/ 			setStatus("dispose");
/******/ 		
/******/ 			results.forEach(function (result) {
/******/ 				if (result.dispose) result.dispose();
/******/ 			});
/******/ 		
/******/ 			// Now in "apply" phase
/******/ 			setStatus("apply");
/******/ 		
/******/ 			var error;
/******/ 			var reportError = function (err) {
/******/ 				if (!error) error = err;
/******/ 			};
/******/ 		
/******/ 			var outdatedModules = [];
/******/ 			results.forEach(function (result) {
/******/ 				if (result.apply) {
/******/ 					var modules = result.apply(reportError);
/******/ 					if (modules) {
/******/ 						for (var i = 0; i < modules.length; i++) {
/******/ 							outdatedModules.push(modules[i]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		
/******/ 			// handle errors in accept handlers and self accepted module load
/******/ 			if (error) {
/******/ 				setStatus("fail");
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw error;
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			if (queuedInvalidatedModules) {
/******/ 				return internalApply(options).then(function (list) {
/******/ 					outdatedModules.forEach(function (moduleId) {
/******/ 						if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 					});
/******/ 					return list;
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			setStatus("idle");
/******/ 			return Promise.resolve(outdatedModules);
/******/ 		}
/******/ 		
/******/ 		function applyInvalidatedModules() {
/******/ 			if (queuedInvalidatedModules) {
/******/ 				if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
/******/ 				Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 					queuedInvalidatedModules.forEach(function (moduleId) {
/******/ 						__webpack_require__.hmrI[key](
/******/ 							moduleId,
/******/ 							currentUpdateApplyHandlers
/******/ 						);
/******/ 					});
/******/ 				});
/******/ 				queuedInvalidatedModules = undefined;
/******/ 				return true;
/******/ 			}
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// Promise = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		var currentUpdatedModulesList;
/******/ 		var waitingUpdateResolves = {};
/******/ 		function loadUpdateChunk(chunkId) {
/******/ 			return new Promise((resolve, reject) => {
/******/ 				waitingUpdateResolves[chunkId] = resolve;
/******/ 				// start update chunk loading
/******/ 				var url = __webpack_require__.p + __webpack_require__.hu(chunkId);
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				var loadingEnded = (event) => {
/******/ 					if(waitingUpdateResolves[chunkId]) {
/******/ 						waitingUpdateResolves[chunkId] = undefined
/******/ 						var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 						var realSrc = event && event.target && event.target.src;
/******/ 						error.message = 'Loading hot update chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 						error.name = 'ChunkLoadError';
/******/ 						error.type = errorType;
/******/ 						error.request = realSrc;
/******/ 						reject(error);
/******/ 					}
/******/ 				};
/******/ 				__webpack_require__.l(url, loadingEnded);
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		self["webpackHotUpdateWebGL_Project"] = (chunkId, moreModules, runtime) => {
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					currentUpdate[moduleId] = moreModules[moduleId];
/******/ 					if(currentUpdatedModulesList) currentUpdatedModulesList.push(moduleId);
/******/ 				}
/******/ 			}
/******/ 			if(runtime) currentUpdateRuntime.push(runtime);
/******/ 			if(waitingUpdateResolves[chunkId]) {
/******/ 				waitingUpdateResolves[chunkId]();
/******/ 				waitingUpdateResolves[chunkId] = undefined;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var currentUpdateChunks;
/******/ 		var currentUpdate;
/******/ 		var currentUpdateRemovedChunks;
/******/ 		var currentUpdateRuntime;
/******/ 		function applyHandler(options) {
/******/ 			if (__webpack_require__.f) delete __webpack_require__.f.jsonpHmr;
/******/ 			currentUpdateChunks = undefined;
/******/ 			function getAffectedModuleEffects(updateModuleId) {
/******/ 				var outdatedModules = [updateModuleId];
/******/ 				var outdatedDependencies = {};
/******/ 		
/******/ 				var queue = outdatedModules.map(function (id) {
/******/ 					return {
/******/ 						chain: [id],
/******/ 						id: id
/******/ 					};
/******/ 				});
/******/ 				while (queue.length > 0) {
/******/ 					var queueItem = queue.pop();
/******/ 					var moduleId = queueItem.id;
/******/ 					var chain = queueItem.chain;
/******/ 					var module = __webpack_require__.c[moduleId];
/******/ 					if (
/******/ 						!module ||
/******/ 						(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 					)
/******/ 						continue;
/******/ 					if (module.hot._selfDeclined) {
/******/ 						return {
/******/ 							type: "self-declined",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					if (module.hot._main) {
/******/ 						return {
/******/ 							type: "unaccepted",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					for (var i = 0; i < module.parents.length; i++) {
/******/ 						var parentId = module.parents[i];
/******/ 						var parent = __webpack_require__.c[parentId];
/******/ 						if (!parent) continue;
/******/ 						if (parent.hot._declinedDependencies[moduleId]) {
/******/ 							return {
/******/ 								type: "declined",
/******/ 								chain: chain.concat([parentId]),
/******/ 								moduleId: moduleId,
/******/ 								parentId: parentId
/******/ 							};
/******/ 						}
/******/ 						if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 						if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 							if (!outdatedDependencies[parentId])
/******/ 								outdatedDependencies[parentId] = [];
/******/ 							addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 							continue;
/******/ 						}
/******/ 						delete outdatedDependencies[parentId];
/******/ 						outdatedModules.push(parentId);
/******/ 						queue.push({
/******/ 							chain: chain.concat([parentId]),
/******/ 							id: parentId
/******/ 						});
/******/ 					}
/******/ 				}
/******/ 		
/******/ 				return {
/******/ 					type: "accepted",
/******/ 					moduleId: updateModuleId,
/******/ 					outdatedModules: outdatedModules,
/******/ 					outdatedDependencies: outdatedDependencies
/******/ 				};
/******/ 			}
/******/ 		
/******/ 			function addAllToSet(a, b) {
/******/ 				for (var i = 0; i < b.length; i++) {
/******/ 					var item = b[i];
/******/ 					if (a.indexOf(item) === -1) a.push(item);
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			// at begin all updates modules are outdated
/******/ 			// the "outdated" status can propagate to parents if they don't accept the children
/******/ 			var outdatedDependencies = {};
/******/ 			var outdatedModules = [];
/******/ 			var appliedUpdate = {};
/******/ 		
/******/ 			var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" + module.id + ") to disposed module"
/******/ 				);
/******/ 			};
/******/ 		
/******/ 			for (var moduleId in currentUpdate) {
/******/ 				if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 					var newModuleFactory = currentUpdate[moduleId];
/******/ 					/** @type {TODO} */
/******/ 					var result;
/******/ 					if (newModuleFactory) {
/******/ 						result = getAffectedModuleEffects(moduleId);
/******/ 					} else {
/******/ 						result = {
/******/ 							type: "disposed",
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					/** @type {Error|false} */
/******/ 					var abortError = false;
/******/ 					var doApply = false;
/******/ 					var doDispose = false;
/******/ 					var chainInfo = "";
/******/ 					if (result.chain) {
/******/ 						chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 					}
/******/ 					switch (result.type) {
/******/ 						case "self-declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of self decline: " +
/******/ 										result.moduleId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of declined dependency: " +
/******/ 										result.moduleId +
/******/ 										" in " +
/******/ 										result.parentId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "unaccepted":
/******/ 							if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 							if (!options.ignoreUnaccepted)
/******/ 								abortError = new Error(
/******/ 									"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "accepted":
/******/ 							if (options.onAccepted) options.onAccepted(result);
/******/ 							doApply = true;
/******/ 							break;
/******/ 						case "disposed":
/******/ 							if (options.onDisposed) options.onDisposed(result);
/******/ 							doDispose = true;
/******/ 							break;
/******/ 						default:
/******/ 							throw new Error("Unexception type " + result.type);
/******/ 					}
/******/ 					if (abortError) {
/******/ 						return {
/******/ 							error: abortError
/******/ 						};
/******/ 					}
/******/ 					if (doApply) {
/******/ 						appliedUpdate[moduleId] = newModuleFactory;
/******/ 						addAllToSet(outdatedModules, result.outdatedModules);
/******/ 						for (moduleId in result.outdatedDependencies) {
/******/ 							if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 								if (!outdatedDependencies[moduleId])
/******/ 									outdatedDependencies[moduleId] = [];
/******/ 								addAllToSet(
/******/ 									outdatedDependencies[moduleId],
/******/ 									result.outdatedDependencies[moduleId]
/******/ 								);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 					if (doDispose) {
/******/ 						addAllToSet(outdatedModules, [result.moduleId]);
/******/ 						appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 			currentUpdate = undefined;
/******/ 		
/******/ 			// Store self accepted outdated modules to require them later by the module system
/******/ 			var outdatedSelfAcceptedModules = [];
/******/ 			for (var j = 0; j < outdatedModules.length; j++) {
/******/ 				var outdatedModuleId = outdatedModules[j];
/******/ 				if (
/******/ 					__webpack_require__.c[outdatedModuleId] &&
/******/ 					__webpack_require__.c[outdatedModuleId].hot._selfAccepted &&
/******/ 					// removed self-accepted modules should not be required
/******/ 					appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
/******/ 					// when called invalidate self-accepting is not possible
/******/ 					!__webpack_require__.c[outdatedModuleId].hot._selfInvalidated
/******/ 				) {
/******/ 					outdatedSelfAcceptedModules.push({
/******/ 						module: outdatedModuleId,
/******/ 						require: __webpack_require__.c[outdatedModuleId].hot._requireSelf,
/******/ 						errorHandler: __webpack_require__.c[outdatedModuleId].hot._selfAccepted
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			var moduleOutdatedDependencies;
/******/ 		
/******/ 			return {
/******/ 				dispose: function () {
/******/ 					currentUpdateRemovedChunks.forEach(function (chunkId) {
/******/ 						delete installedChunks[chunkId];
/******/ 					});
/******/ 					currentUpdateRemovedChunks = undefined;
/******/ 		
/******/ 					var idx;
/******/ 					var queue = outdatedModules.slice();
/******/ 					while (queue.length > 0) {
/******/ 						var moduleId = queue.pop();
/******/ 						var module = __webpack_require__.c[moduleId];
/******/ 						if (!module) continue;
/******/ 		
/******/ 						var data = {};
/******/ 		
/******/ 						// Call dispose handlers
/******/ 						var disposeHandlers = module.hot._disposeHandlers;
/******/ 						for (j = 0; j < disposeHandlers.length; j++) {
/******/ 							disposeHandlers[j].call(null, data);
/******/ 						}
/******/ 						__webpack_require__.hmrD[moduleId] = data;
/******/ 		
/******/ 						// disable module (this disables requires from this module)
/******/ 						module.hot.active = false;
/******/ 		
/******/ 						// remove module from cache
/******/ 						delete __webpack_require__.c[moduleId];
/******/ 		
/******/ 						// when disposing there is no need to call dispose handler
/******/ 						delete outdatedDependencies[moduleId];
/******/ 		
/******/ 						// remove "parents" references from all children
/******/ 						for (j = 0; j < module.children.length; j++) {
/******/ 							var child = __webpack_require__.c[module.children[j]];
/******/ 							if (!child) continue;
/******/ 							idx = child.parents.indexOf(moduleId);
/******/ 							if (idx >= 0) {
/******/ 								child.parents.splice(idx, 1);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// remove outdated dependency from module children
/******/ 					var dependency;
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									dependency = moduleOutdatedDependencies[j];
/******/ 									idx = module.children.indexOf(dependency);
/******/ 									if (idx >= 0) module.children.splice(idx, 1);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				},
/******/ 				apply: function (reportError) {
/******/ 					// insert new code
/******/ 					for (var updateModuleId in appliedUpdate) {
/******/ 						if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
/******/ 							__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// run new runtime modules
/******/ 					for (var i = 0; i < currentUpdateRuntime.length; i++) {
/******/ 						currentUpdateRuntime[i](__webpack_require__);
/******/ 					}
/******/ 		
/******/ 					// call accept handlers
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							var module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								var callbacks = [];
/******/ 								var dependenciesForCallbacks = [];
/******/ 								for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									var dependency = moduleOutdatedDependencies[j];
/******/ 									var acceptCallback =
/******/ 										module.hot._acceptedDependencies[dependency];
/******/ 									if (acceptCallback) {
/******/ 										if (callbacks.indexOf(acceptCallback) !== -1) continue;
/******/ 										callbacks.push(acceptCallback);
/******/ 										dependenciesForCallbacks.push(dependency);
/******/ 									}
/******/ 								}
/******/ 								for (var k = 0; k < callbacks.length; k++) {
/******/ 									try {
/******/ 										callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 									} catch (err) {
/******/ 										if (options.onErrored) {
/******/ 											options.onErrored({
/******/ 												type: "accept-errored",
/******/ 												moduleId: outdatedModuleId,
/******/ 												dependencyId: dependenciesForCallbacks[k],
/******/ 												error: err
/******/ 											});
/******/ 										}
/******/ 										if (!options.ignoreErrored) {
/******/ 											reportError(err);
/******/ 										}
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// Load self accepted modules
/******/ 					for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
/******/ 						var item = outdatedSelfAcceptedModules[o];
/******/ 						var moduleId = item.module;
/******/ 						try {
/******/ 							item.require(moduleId);
/******/ 						} catch (err) {
/******/ 							if (typeof item.errorHandler === "function") {
/******/ 								try {
/******/ 									item.errorHandler(err);
/******/ 								} catch (err2) {
/******/ 									if (options.onErrored) {
/******/ 										options.onErrored({
/******/ 											type: "self-accept-error-handler-errored",
/******/ 											moduleId: moduleId,
/******/ 											error: err2,
/******/ 											originalError: err
/******/ 										});
/******/ 									}
/******/ 									if (!options.ignoreErrored) {
/******/ 										reportError(err2);
/******/ 									}
/******/ 									reportError(err);
/******/ 								}
/******/ 							} else {
/******/ 								if (options.onErrored) {
/******/ 									options.onErrored({
/******/ 										type: "self-accept-errored",
/******/ 										moduleId: moduleId,
/******/ 										error: err
/******/ 									});
/******/ 								}
/******/ 								if (!options.ignoreErrored) {
/******/ 									reportError(err);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					return outdatedModules;
/******/ 				}
/******/ 			};
/******/ 		}
/******/ 		__webpack_require__.hmrI.jsonp = function (moduleId, applyHandlers) {
/******/ 			if (!currentUpdate) {
/******/ 				currentUpdate = {};
/******/ 				currentUpdateRuntime = [];
/******/ 				currentUpdateRemovedChunks = [];
/******/ 				applyHandlers.push(applyHandler);
/******/ 			}
/******/ 			if (!__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 				currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 			}
/******/ 		};
/******/ 		__webpack_require__.hmrC.jsonp = function (
/******/ 			chunkIds,
/******/ 			removedChunks,
/******/ 			removedModules,
/******/ 			promises,
/******/ 			applyHandlers,
/******/ 			updatedModulesList
/******/ 		) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			currentUpdateChunks = {};
/******/ 			currentUpdateRemovedChunks = removedChunks;
/******/ 			currentUpdate = removedModules.reduce(function (obj, key) {
/******/ 				obj[key] = false;
/******/ 				return obj;
/******/ 			}, {});
/******/ 			currentUpdateRuntime = [];
/******/ 			chunkIds.forEach(function (chunkId) {
/******/ 				if (
/******/ 					__webpack_require__.o(installedChunks, chunkId) &&
/******/ 					installedChunks[chunkId] !== undefined
/******/ 				) {
/******/ 					promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 					currentUpdateChunks[chunkId] = true;
/******/ 				}
/******/ 			});
/******/ 			if (__webpack_require__.f) {
/******/ 				__webpack_require__.f.jsonpHmr = function (chunkId, promises) {
/******/ 					if (
/******/ 						currentUpdateChunks &&
/******/ 						!__webpack_require__.o(currentUpdateChunks, chunkId) &&
/******/ 						__webpack_require__.o(installedChunks, chunkId) &&
/******/ 						installedChunks[chunkId] !== undefined
/******/ 					) {
/******/ 						promises.push(loadUpdateChunk(chunkId));
/******/ 						currentUpdateChunks[chunkId] = true;
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.hmrM = () => {
/******/ 			if (typeof fetch === "undefined") throw new Error("No browser support: need fetch API");
/******/ 			return fetch(__webpack_require__.p + __webpack_require__.hmrF()).then((response) => {
/******/ 				if(response.status === 404) return; // no update available
/******/ 				if(!response.ok) throw new Error("Failed to fetch update manifest " + response.statusText);
/******/ 				return response.json();
/******/ 			});
/******/ 		};
/******/ 		
/******/ 		// no deferred startup
/******/ 		
/******/ 		// no jsonp function
/******/ 		
/******/ 		// no deferred startup
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/app.ts");
/******/ })()
;