#version 300 es

precision mediump float;
in float vDepth;
out vec4 myOutputColor;

void main(void) {
    myOutputColor=vec4(vDepth, 0.,0.,1.);
}
