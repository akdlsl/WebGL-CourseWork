export class Shader {
    static shadowMapV = `\n\
        attribute vec3 position;\n\
        uniform mat4 Pmatrix, Lmatrix;\n\
        varying float vDepth;\n\
        \n\
        void main(void) {\n\
        vec4 position = Pmatrix*Lmatrix*vec4(position, 1.);\n\
        float zBuf=position.z/position.w; //Z-buffer between -1 and 1\n\
        vDepth=0.5+zBuf*0.5; //between 0 and 1\n\
        gl_Position=position;\n\
    }`;

    static shadowMapF = "\n\
        precision mediump float;\n\
        varying float vDepth;\n\
        \n\
        void main(void) {\n\
        gl_FragColor=vec4(vDepth, 0.,0.,1.);\n\
    }";

    static v = "\n\
        attribute vec3 position, normal;\n\
        attribute vec2 uv;\n\
        uniform mat4 Pmatrix, Vmatrix, Mmatrix;\n\
        uniform mat4 Lmatrix, PmatrixLight;\n\
        varying vec2 vUV;\n\
        varying vec3 vNormal;\n\
        varying vec3 vLightPos;\n\
        \n\
        void main(void) {\n\
        vec4 lightPos = Lmatrix*vec4(position, 1.);\n\
        \n\
        \n\
        lightPos=PmatrixLight*lightPos;\n\
        \n\
        \n\
        vec3 lightPosDNC=lightPos.xyz/lightPos.w;\n\
        \n\
        \n\
        \n\
        vLightPos=vec3(0.5,0.5,0.5)+lightPosDNC*0.5;\n\
        gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);\n\
        vNormal=normal;\n\
        vUV=uv;\n\
    }";

    static f = "\n\
        precision mediump float;\n\
        uniform sampler2D sampler;\n\
        uniform sampler2D samplerShadowMap;\n\
        varying vec2 vUV;\n\
        varying vec3 vNormal;\n\
        varying vec3 vLightPos;\n\
        const vec3 source_ambient_color=vec3(1.,1.,1.);\n\
        const vec3 source_diffuse_color=vec3(1.,1.,1.);\n\
        uniform vec3 source_direction;\n\
        \n\
        const vec3 mat_ambient_color=vec3(0.3,0.3,0.3);\n\
        const vec3 mat_diffuse_color=vec3(1.,1.,1.);\n\
        const float mat_shininess=10.;\n\
        \n\
        void main(void) {\n\
        vec2 uv_shadowMap=vLightPos.xy;\n\
        vec4 shadowMapColor=texture2D(samplerShadowMap, uv_shadowMap);\n\
        float zShadowMap=shadowMapColor.r;\n\
        float shadowCoeff=1.-smoothstep(0.002, 0.003, vLightPos.z-zShadowMap);\n\
        vec3 color=vec3(texture2D(sampler, vUV));\n\
        vec3 I_ambient=source_ambient_color*mat_ambient_color;\n\
        vec3 I_diffuse=source_diffuse_color*mat_diffuse_color*max(0., dot(vNormal, source_direction));\n\
        \n\
        vec3 I=I_ambient+shadowCoeff*I_diffuse;\n\
        gl_FragColor = vec4(I*color, 1.);\n\
    }";
}
