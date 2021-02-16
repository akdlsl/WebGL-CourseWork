import {WebGL} from "./GLContext";

export class Texture {
    protected _texture: WebGLTexture;

    static loadImage(image_URL: string): Texture {
        const image = new Image();
        image.src=image_URL;
        image.crossOrigin = "anonymous";

        let texture = WebGL.context.createTexture();
        image.onload=function(e) {
            WebGL.context.pixelStorei(WebGL.context.UNPACK_FLIP_Y_WEBGL, true);
            WebGL.context.bindTexture(WebGL.context.TEXTURE_2D, texture);
            WebGL.context.texImage2D(WebGL.context.TEXTURE_2D, 0, WebGL.context.RGBA, WebGL.context.RGBA, WebGL.context.UNSIGNED_BYTE, image);
            WebGL.context.texParameteri(WebGL.context.TEXTURE_2D, WebGL.context.TEXTURE_MAG_FILTER, WebGL.context.LINEAR);
            WebGL.context.texParameteri(WebGL.context.TEXTURE_2D, WebGL.context.TEXTURE_MIN_FILTER, WebGL.context.NEAREST_MIPMAP_LINEAR);
            WebGL.context.generateMipmap(WebGL.context.TEXTURE_2D);
            WebGL.context.bindTexture(WebGL.context.TEXTURE_2D, null);
        }

        return new Texture(<WebGLTexture>texture);
    };

    constructor(texture: WebGLTexture) {
        this._texture = texture;
    }

    get(): WebGLTexture {
        return this._texture;
    }
}

export class CubeTexture extends Texture {
    static loadImageAsCube(faces: {target: GLenum, url: string}[]): CubeTexture {
        let texture = WebGL.context.createTexture();
        WebGL.context.bindTexture(WebGL.context.TEXTURE_CUBE_MAP, texture);

        faces.forEach((faceInfo) => {
            const {target, url} = faceInfo;

            // Upload the canvas to the cubemap face.
            const level = 0;
            const internalFormat = WebGL.context.RGBA;
            const width = WebGL.context.canvas.width;
            const height = WebGL.context.canvas.height;
            const format = WebGL.context.RGBA;
            const type = WebGL.context.UNSIGNED_BYTE;

            // setup each face so it's immediately renderable
            WebGL.context.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);

            // Asynchronously load an image
            const image = new Image();
            image.src = url;
            image.crossOrigin = "anonymous";

            image.onload = () => {
                // Now that the image has loaded make copy it to the texture.
                WebGL.context.bindTexture(WebGL.context.TEXTURE_CUBE_MAP, texture);
                WebGL.context.texImage2D(target, level, internalFormat, format, type, image);
                WebGL.context.generateMipmap(WebGL.context.TEXTURE_CUBE_MAP);
            };
        });
        WebGL.context.generateMipmap(WebGL.context.TEXTURE_CUBE_MAP);
        WebGL.context.texParameteri(WebGL.context.TEXTURE_CUBE_MAP, WebGL.context.TEXTURE_MIN_FILTER, WebGL.context.LINEAR_MIPMAP_LINEAR);

        return new CubeTexture(<WebGLTexture>texture);
    }

        static officeCubeMapPath = () => [
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
    ];

      static oceanCubeMapPath = () => [
        {
            target: WebGL.context.TEXTURE_CUBE_MAP_POSITIVE_X,
            url: 'resources/skybox/sb_ocean_right.jpg',
        },
        {
            target: WebGL.context.TEXTURE_CUBE_MAP_NEGATIVE_X,
            url: 'resources/skybox/sb_ocean_left.jpg',
        },
        {
            target: WebGL.context.TEXTURE_CUBE_MAP_POSITIVE_Y,
            url: 'resources/skybox/sb_ocean_top.jpg',
        },
        {
            target: WebGL.context.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            url: 'resources/skybox/sb_ocean_bottom.jpg',
        },
        {
            target: WebGL.context.TEXTURE_CUBE_MAP_POSITIVE_Z,
            url: 'resources/skybox/sb_ocean_front.jpg',
        },
        {
            target: WebGL.context.TEXTURE_CUBE_MAP_NEGATIVE_Z,
            url: 'resources/skybox/sb_ocean_back.jpg',
        },
    ];
}

export class RenderTexture extends Texture {
    private _frameBuffer: WebGLFramebuffer;
    private _renderBuffer: WebGLRenderbuffer;

    constructor() {
        super(<WebGLTexture>WebGL.context.createTexture());

        this._frameBuffer = <WebGLFramebuffer>WebGL.context.createFramebuffer();
        WebGL.context.bindFramebuffer(WebGL.context.FRAMEBUFFER, this._frameBuffer);

        this._renderBuffer = <WebGLRenderbuffer>WebGL.context.createRenderbuffer();
        WebGL.context.bindRenderbuffer(WebGL.context.RENDERBUFFER, this._renderBuffer);
        WebGL.context.renderbufferStorage(WebGL.context.RENDERBUFFER, WebGL.context.DEPTH_COMPONENT16, 512, 512);

        WebGL.context.framebufferRenderbuffer(WebGL.context.FRAMEBUFFER, WebGL.context.DEPTH_ATTACHMENT,
            WebGL.context.RENDERBUFFER, this._renderBuffer);


        WebGL.context.bindTexture(WebGL.context.TEXTURE_2D, this._texture);
        WebGL.context.texParameteri(WebGL.context.TEXTURE_2D, WebGL.context.TEXTURE_MAG_FILTER, WebGL.context.LINEAR);
        WebGL.context.texParameteri(WebGL.context.TEXTURE_2D, WebGL.context.TEXTURE_MIN_FILTER, WebGL.context.LINEAR);
        WebGL.context.texImage2D(WebGL.context.TEXTURE_2D, 0, WebGL.context.RGBA, 512, 512,
            0, WebGL.context.RGBA, WebGL.context.UNSIGNED_BYTE, null);

        WebGL.context.framebufferTexture2D(WebGL.context.FRAMEBUFFER, WebGL.context.COLOR_ATTACHMENT0,
            WebGL.context.TEXTURE_2D, this._texture, 0);

        WebGL.context.bindTexture(WebGL.context.TEXTURE_2D, null);
        WebGL.context.bindFramebuffer(WebGL.context.FRAMEBUFFER, null);
    }

    renderToTexture(renderFunction: Function) {
        WebGL.context.bindFramebuffer(WebGL.context.FRAMEBUFFER, this._frameBuffer);
        WebGL.context.viewport(0.0, 0.0, 512, 512);
        WebGL.context.clearColor(0.0, 0.0, 0.0, 1.0); //red -> Z=Zfar on the shadow map
        WebGL.context.clear(WebGL.context.COLOR_BUFFER_BIT | WebGL.context.DEPTH_BUFFER_BIT);

        renderFunction();

        WebGL.context.bindFramebuffer(WebGL.context.FRAMEBUFFER, null);
    }
}


