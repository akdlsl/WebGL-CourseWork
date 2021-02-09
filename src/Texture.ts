import {WebGL} from "./GLContext";

export class Texture {
    private texture: WebGLTexture;

    static from(image_URL: string): Texture {
        const text = this.loadImage(image_URL);
        return new Texture(<WebGLTexture>text);
    }

    static loadImage(image_URL: string): WebGLTexture | null {
        const image = new Image();
        image.src=image_URL;

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

        return texture;
    };

    constructor(texture: WebGLTexture) {
        this.texture = texture;
    }

    get(): WebGLTexture {
        return this.texture;
    }
}
