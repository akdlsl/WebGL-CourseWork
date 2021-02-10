#version 300 es
layout (location=0) in vec3 position;
out vec3 uv;

void main()
{
    uv = position;
    vec4 pos = vec4(position, 1.0f);
    gl_Position = pos.xyww;
}
