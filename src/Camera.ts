import {WebGL} from "./GLContext";

const YAW         = -90.0;
const PITCH       =  0.0;
const SPEED       =  2.5;
const SENSITIVITY =  0.1;
const ZOOM        =  45.0;

export class Camera {

    private _position = WebGL.glm.vec3(0, 10, 0);
    private _up = WebGL.glm.vec3(0, 1, 0);
    private _front = WebGL.glm.vec3(0, 0, -1);
    private _right = WebGL.glm.vec3();
    private _worldUp = WebGL.glm.vec3();
    // euler Angles
    private _yaw = YAW;
    private _pitch = PITCH;
    // camera options
    private _movementSpeed = SPEED;
    private _mouseSensitivity = SENSITIVITY;
    private _zoom = ZOOM;
    private _lastX = 0;
    private _lastY = 0;

    constructor(canvas: HTMLCanvasElement) {
        this.updateCameraVectors();

        canvas.addEventListener('mousemove', e => {
            let xoffset = e.pageX - this._lastX;
            let yoffset = this._lastY - e.pageY; // reversed since y-coordinates go from bottom to top

            this._lastX = e.pageX;
            this._lastX = e.pageY;

            xoffset *= this._mouseSensitivity;
            yoffset *= this._mouseSensitivity;

            this._yaw   += xoffset;
            this._pitch += yoffset;

            // make sure that when pitch is out of bounds, screen doesn't get flipped

            if (this._pitch > 89.0)
                this._pitch = 89.0;
            if (this._pitch < -89.0)
                this._pitch = -89.0;

            // update Front, Right and Up Vectors using the updated Euler angles
            this.updateCameraVectors();
        });
    }

    getViewMatrix() {
        return WebGL.glm.lookAt(this._position, this._position['+'](this._front), this._up).array;
    }

    getProjectionMatrix() {
      //  console.log(WebGL.glm.perspective(WebGL.glm.radians(this._zoom), WebGL.context.canvas.width /WebGL.context.canvas.width, 0.1, 100.0).array);
        return WebGL.glm.perspective(WebGL.glm.radians(this._zoom), WebGL.context.canvas.width /WebGL.context.canvas.width, 0.1, 100.0).array;
    }

    getProjectionViewMatrix() {
        return this.getProjectionMatrix() * this.getViewMatrix();
    }

    getPosition() {
        return this._position;
    }

    updateCameraVectors() {
        // calculate the new Front vector
        const front = WebGL.glm.vec3(1);
        front.x = Math.cos(WebGL.glm.radians(this._yaw)) * Math.cos(WebGL.glm.radians(this._pitch));
        front.y = Math.sin(WebGL.glm.radians(this._pitch));
        front.z = Math.sin(WebGL.glm.radians(this._yaw)) * WebGL.glm.radians(this._pitch);
        this._front = WebGL.glm.normalize(front);
        // also re-calculate the Right and Up vector
        this._right = WebGL.glm.normalize(WebGL.glm.cross(this._front, this._worldUp));  // normalize the vectors, because their length gets closer to 0 the more you look up or down which results in slower movement.
        this._up = WebGL.glm.normalize(WebGL.glm.cross(this._right, this._front));
    }
}


/*


// An abstract camera class that processes input and calculates the corresponding Euler Angles, Vectors and Matrices for use in OpenGL
class Camera
{

    // returns the view matrix calculated using Euler Angles and the LookAt Matrix


    // processes input received from any keyboard-like input system. Accepts input parameter in the form of camera defined ENUM (to abstract it from windowing systems)
    void ProcessKeyboard(double delta)
{
    float velocity = MovementSpeed * delta;
    if (input->IsKeyButtonDown(GLFW_KEY_W))
    Position += Front * velocity;
    if (input->IsKeyButtonDown(GLFW_KEY_S))
    Position -= Front * velocity;
    if (input->IsKeyButtonDown(GLFW_KEY_A))
    Position -= Right * velocity;
    if (input->IsKeyButtonDown(GLFW_KEY_D))
    Position += Right * velocity;
}

// processes input received from a mouse input system. Expects the offset value in both the x and y direction.
void ProcessMouseMovement(double xpos, double ypos) {
    float xoffset = xpos - lastX;
    float yoffset = lastY - ypos; // reversed since y-coordinates go from bottom to top

    lastX = xpos;
    lastY = ypos;

    xoffset *= MouseSensitivity;
    yoffset *= MouseSensitivity;

    Yaw   += xoffset;
    Pitch += yoffset;

    // make sure that when pitch is out of bounds, screen doesn't get flipped

    if (Pitch > 89.0f)
    Pitch = 89.0f;
    if (Pitch < -89.0f)
    Pitch = -89.0f;

    // update Front, Right and Up Vectors using the updated Euler angles
    updateCameraVectors();
}

// processes input received from a mouse scroll-wheel event. Only requires input on the vertical wheel-axis
void ProcessMouseScroll(float yoffset)
{
    Zoom -= (float)yoffset;
    if (Zoom < 1.0f)
    Zoom = 1.0f;
    if (Zoom > 45.0f)
    Zoom = 45.0f;
}

private:
// calculates the front vector from the Camera's (updated) Euler Angles

void SetInput() {
    input->AddMouseHandler([this] (double x, double y) mutable {ProcessMouseMovement(x, y);});
    input->AddKeyHandler([this] (double delta) mutable {ProcessKeyboard(delta);});
}
};
*/
