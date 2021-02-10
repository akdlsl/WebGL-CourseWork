#version 300 es
precision mediump float;

uniform sampler2D sampler;
uniform sampler2D samplerShadowMap;
uniform vec3 source_direction;

in vec2 vUV;
in vec3 vNormal;
in vec3 vLightPos;

out vec4 myOutputColor;

const vec3 source_ambient_color=vec3(1.,1.,1.);
const vec3 source_diffuse_color=vec3(1.,1.,1.);
const vec3 mat_ambient_color=vec3(0.3,0.3,0.3);
const vec3 mat_diffuse_color=vec3(1.,1.,1.);
const float mat_shininess=10.;


void main(void) {
        vec2 uv_shadowMap=vLightPos.xy;
        vec4 shadowMapColor=texture(samplerShadowMap, uv_shadowMap);
        float zShadowMap=shadowMapColor.r;
        float shadowCoeff=1.-smoothstep(0.002, 0.003, vLightPos.z-zShadowMap);
        vec3 color=vec3(texture(sampler, vUV));
        vec3 I_ambient=source_ambient_color*mat_ambient_color;
        vec3 I_diffuse=source_diffuse_color*mat_diffuse_color*max(0., dot(vNormal, source_direction));
        vec3 I=I_ambient+shadowCoeff*I_diffuse;

        myOutputColor = vec4(I*color, 1.);
}
