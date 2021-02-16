#version 300 es
layout (location=0) in vec3 position;
layout (location=1) in vec3 normal;
layout (location=2) in vec2 uv;

uniform mat4 Pmatrix, Vmatrix, Mmatrix;
uniform mat4 Lmatrix, PmatrixLight;

out vec2 vUV;
out vec3 vNormal;
out vec3 vLightPos;
out vec4 vPosition;

void main(void) {
    vec4 lightPos = Lmatrix* Mmatrix * vec4(position, 1);
    lightPos=PmatrixLight*lightPos;
    vec3 lightPosDNC=lightPos.xyz/lightPos.w;

    vLightPos=vec3(0.5, 0.5, 0.5)+lightPosDNC*0.5;
    gl_Position = Pmatrix*Vmatrix * Mmatrix*vec4(position, 1.);
    vNormal=normalize(mat3(Mmatrix) * normal);
    vUV=uv;
}
