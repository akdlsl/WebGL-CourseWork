#version 300 es
precision mediump float;

in vec3 uv;
out vec4 myOtputColor;
uniform samplerCube skybox;
uniform mat4 Pmatrix;
uniform mat4 Vmatrix;

void main()
{
    vec4 t = inverse(Pmatrix) * vec4(uv, 1.0);
    myOtputColor = texture(skybox, normalize(t.xyz / t.w));
}
