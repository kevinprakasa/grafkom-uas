"use strict";
const m4 = twgl.m4;
const vec3 = twgl.vec3;

var gl, programInfo, bufferInfo;
var drawingMethod = 0;

const DEFAULT_COLOR = [0.2, 0.8, 0.2];
const GLOBAL_CAMERA = [0, 0, -20];
var povCamera = [0, -2, -5];
var cameraAngel = 0;
var cameraAngelX = 0;
var spotLightTarget = [0, 0, 0];
var isAnimate = true;
var lightType = "directional";
var checked = true;

var textures;
var uniforms = {
    // u_lightDirection: [0.0, 0.5, -1],
    // u_lightPosition: [-10, 4, 3],
    u_lightDirection: [0.0, 0.5, -0.5],
    u_lightPosition: [0, 0, -10],    
    u_spotLightPosition: [0, 0, 0],
    u_spotLightLimit: Math.cos(radians(10)),
    u_shininess: 50,
    u_color: DEFAULT_COLOR,
    u_isTexture: 0,
};

var isPov = false;

var cameraPosition = [0, 0, -10];

var matrixStack = new MatrixStack();

var obj = {
    cube: {
        position: [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1],
        normal: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1],
        indices: [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23],
        texcoord: [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1]
    },
    obj1: {},
    obj2: {}
}

var settings = {
    speed: 0.9,
}


window.onload = function () {
    twgl.setDefaults({
        attribPrefix: "a_",
        crossOrigin: ""
    })

    gl = document.getElementById("gl-canvas").getContext("webgl");
    textures = twgl.createTextures(gl, {
        texture1: {
            src: 'textures/texture1.jpeg',
        },
        texture2: {
            src: 'textures/texture2.jpeg',
        },
        texture3: {
            src: 'textures/texture3.jpeg'
        },
        texture4: {
            src: 'textures/texture4.jpg'
        },
        texture5: {
            src: 'textures/texture5.jpg'
        },
        texture6: {
            src: 'textures/texture6.jpg'
        },
        wall1: {
            src: 'textures/wall1.jpeg'
        },
        wooden: {
            src: 'textures/wooden.jpg'
        }
    });
    programInfo = twgl.createProgramInfo(gl, ["vs", "fs"]);
    gl.clearColor(0.5, 0.5, 0.5, 1.0);


    OBJ.downloadMeshes({
        obj1: 'assets/camera.obj',
        //source: //https://github.com/tado/CC4p52b6/blob/master/src/myAssets/Models/WalkingGirl/WalkingGirl.obj
        obj2: 'assets/female.obj'
        //source: webgl-obj-loader
    }, loadObject);

}

function main() {
    initHandler();
    render();
}

function loadObject(meshes) {
    obj.obj1.indices = meshes.obj1.indices;
    obj.obj1.position = meshes.obj1.vertices;
    obj.obj1.normal = meshes.obj1.vertexNormals;
    obj.obj1.texcoord = meshes.obj1.vertices.slice(0, meshes.obj1.vertices.length / 3 * 2)

    obj.obj2.indices = meshes.obj2.indices;
    obj.obj2.position = meshes.obj2.vertices;
    obj.obj2.normal = meshes.obj2.vertexNormals;
    obj.obj2.texcoord = meshes.obj2.vertices.slice(0, meshes.obj2.vertices.length / 3 * 2)

    main();
}

function render() {
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    updateParameter();
    setProjection();
    setCameraAndSpotLight();
    drawObject(suzanne);
    drawObject(spinner);
    drawObject(world);
    drawObject(walkingGirl);
    drawObject(planet);
    drawObject(jellyhead);
    requestAnimationFrame(render);
}
var time = 0;
function updateParameter() {
    // console.log(isAnimate);
    
    if (isAnimate) {

        if (robotAction.current_state == robotState.S_Z_MAJU ||
            robotAction.current_state == robotState.S_Z_MUNDUR) {
            parameter.robot.bodyTranslation = robotAction.action(parameter.robot.bodyTranslation);
        } else {
            parameter.robot.bodyRotationY = robotAction.action(parameter.robot.bodyRotationY)
        }
        parameter.spinner.rotation += 20;
    
        if (suzanneAction.current_state == suzanneState.S_PUTAR_DEPAN_KANAN ||
            suzanneAction.current_state == suzanneState.S_PUTAR_BELAKANG_KANAN ||
            suzanneAction.current_state == suzanneState.S_PUTAR_KIRI) {
            parameter.suzanne.rotationY = suzanneAction.action(parameter.suzanne.rotationY);
        } else {
            parameter.suzanne.translation = suzanneAction.action(parameter.suzanne.translation);
        }
    
        parameter.planet.rotationX += 2;
        parameter.planet.rotationY -= 2;
        parameter.planet.rotationZ += 2;
        parameter.walkingGirl.rotate = cameraAngel;
    
        parameter.jellyhead.childs.leg1.rotationZ = Math.sin(time*0.05)*40;
        parameter.jellyhead.childs.leg1.translation[0] = Math.sin(time*0.05)*0.3 + 0.7;
    
        parameter.jellyhead.childs.leg2.rotationZ = Math.sin(time*0.05)*(-40);
        parameter.jellyhead.childs.leg2.translation[0] = -Math.sin(time*0.05)*0.3 - 0.7;
    
        parameter.jellyhead.childs.leg3.rotationX = parameter.jellyhead.childs.leg2.rotationZ;
        parameter.jellyhead.childs.leg3.translation[2] = Math.sin(time*0.05)*0.3 + 0.7;
    
        parameter.jellyhead.childs.leg4.rotationX = parameter.jellyhead.childs.leg1.rotationZ;
        parameter.jellyhead.childs.leg4.translation[2] = -Math.sin(time*0.05)*0.3 - 0.7;;
    
        parameter.jellyhead.rotationY = time;
        parameter.jellyhead.translation[2] = Math.sin(time*0.05)*1;
        parameter.jellyhead.translation[1] = parameter.jellyhead.translation[2];
        time+=1;
        GLOBAL_CAMERA[0] = Math.sin(time*0.005) * 5;
    }
}

function drawObject(object) {
    let hierarchy = object.hierarchy;

    drawObjectHelper(object, hierarchy);
}

function drawObjectHelper(object, hierarchy) {
    for (let component of hierarchy) {
        defineModelViewMatrix(object[component.name], component.hasChild);
        if (component.hasChild) {
            drawObjectHelper(object, component.childs);

            matrixStack.restore();
        }
    }
}

function defineModelViewMatrix(object, saveMatrix = false) {
    let tempMatrix = matrixStack.getCurrentMatrix();

    let translate = object.translation;
    let rotationY = (object.rotationY == null) ? 0 : object.rotationY;
    let rotationX = (object.rotationX == null) ? 0 : object.rotationX;
    let rotationZ = (object.rotationZ == null) ? 0 : object.rotationZ;

    if (object.function != null) {
        if ((object.function & ROTATION_X) != 0) rotationX = rotationX();
        if ((object.function & ROTATION_Y) != 0) rotationY = rotationY();
        if ((object.function & ROTATION_Z) != 0) rotationZ = rotationZ();

        if ((object.function & TRANSLATE) != 0) translate = translate();
    }

    tempMatrix = m4.multiply(tempMatrix, m4.translation(translate));
    tempMatrix = m4.multiply(tempMatrix, m4.rotationX(radians(rotationX)));
    tempMatrix = m4.multiply(tempMatrix, m4.rotationY(radians(rotationY)));
    tempMatrix = m4.multiply(tempMatrix, m4.rotationZ(radians(rotationZ)));
    tempMatrix = m4.multiply(tempMatrix, m4.scaling(object.scale));
    if (object.color != null) {
        uniforms.u_color = object.color;
    } else {
        uniforms.u_color = DEFAULT_COLOR;
    }

    if (object.texture != null) {
        uniforms.u_isTexture = 1;
        uniforms.u_texture = textures[object.texture];
    } else {
        uniforms.u_isTexture = 0;
    }

    if (saveMatrix) {
        matrixStack.save(tempMatrix);
    }

    draw(tempMatrix, object.objName);
}

function draw(matrix, objName = 'cube', ) {
    bufferInfo = chooseShape(objName);
    uniforms.u_modelMatrix = matrix;
    uniforms.u_worldInverseMatrix = m4.transpose(m4.inverse(matrix));

    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, uniforms);

    gl.drawElements((drawingMethod == 0) ? gl.TRIANGLES : gl.LINE_LOOP,
        bufferInfo.numElements, gl.UNSIGNED_SHORT, 0);
}

function chooseShape(objName) {
    switch (objName) {
        case 'WalkingGirl':
            return twgl.createBufferInfoFromArrays(gl, obj['obj1']);
        case 'suzanne':
            return twgl.createBufferInfoFromArrays(gl, obj['obj2']);
        case 'cylinder':
            return twgl.primitives.createCylinderBufferInfo(gl, 1, 2, 10, 10);
        case 'sphere':
            return twgl.primitives.createSphereBufferInfo(gl, 1, 20, 20);
        case 'torus':
            return twgl.primitives.createTorusBufferInfo(gl, 1, 0.2, 50, 10);
        case 'jellyhead':
            return twgl.primitives.createTruncatedConeBufferInfo(gl, 1, 0, 2, 24, 1);
        default:
            return twgl.createBufferInfoFromArrays(gl, obj['cube']);
    }
}

function setCameraAndSpotLight() {
    if (isPov) {
        cameraPosition = povCamera;
    } else {
        cameraPosition = GLOBAL_CAMERA;
    }
    const eye = cameraPosition;
    let target = [cameraPosition[0], 0, cameraPosition[2] + 10];
    if (isAnimate) {
        target = [0,0,0];
    }
    const up = [0, 1, 0];
    var camera = m4.lookAt(eye, target, up);
    if(isPov) {
        camera = m4.rotateY(camera, radians(cameraAngel));
        camera = m4.rotateX(camera, radians(cameraAngelX));
    }
    const view = m4.inverse(camera);
    uniforms.u_viewMatrix = view;
    uniforms.u_cameraPosition = cameraPosition;
    uniforms.u_spotLightPosition = eye;
    uniforms.u_spotLightDirection = [-camera[8], -camera[9], -camera[10]];

}

function setProjection() {

    const fov = 30 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 1;
    const zFar = 2000;
    const projection = m4.perspective(fov, aspect, zNear, zFar);

    uniforms.u_projectionMatrix = projection;
}

window.onkeydown = function (event) {
    if (!isAnimate) {
        switch (event.keyCode) {
            case 65://a
                povCamera[0] += settings.speed;
                parameter.walkingGirl.translateX += settings.speed;
                break;
            case 68://d
                povCamera[0] -= settings.speed;
                parameter.walkingGirl.translateX -= settings.speed;
                break;
            case 87://w
                povCamera[2] += settings.speed;
                parameter.walkingGirl.translateZ += settings.speed;
                break;
            case 83://s
                povCamera[2] -= settings.speed;
                parameter.walkingGirl.translateZ -= settings.speed;
                break;
            case 32://space
                isPov ^= true;
                break;
            case 37://left
                cameraAngel += 1;
                break;
            case 39: //right
                cameraAngel -= 1;
                break;
            case 38: //up
                cameraAngelX += 1;
                break;
            case 40: //down
                cameraAngelX -= 1;
                break;
            case 81: //q
                drawingMethod ^= 1;
                break;
            case 188: //,
                parameter.suzanne.translation[0] += 1;
                break;
            case 190: //.
                parameter.suzanne.translation[0] -= 1;
                break;
            case 90: //z
                parameter.planet.translation[0] += 1;
                break;
            case 88: //x
                parameter.planet.translation[0] -= 1;
                break;
        }
    }
}

function initHandler() {
    document.getElementById("toggleSpotLight").onclick = function () {
        if (checked) {
            uniforms.u_isSpotLight = 1;
        } else {
            uniforms.u_isSpotLight = 0;
        }
        checked = !checked;
    };
    document.getElementById("toggleDemo").onclick = function(){
        isAnimate = !isAnimate;
    };
    document.getElementById("togglePointLight").onclick = function(){
        if(lightType !== "pointLight") {
            uniforms.u_lightDirection = [0.0, 0.5, -1];
            uniforms.u_lightPosition = [-10, 4, 3];
            lightType = "pointLight";
        } else {
            uniforms.u_lightDirection = [0.0, 0.5, -0.5];
            uniforms.u_lightPosition = [0, 0, -10];
            lightType = "directional";
        }
    };
}

function radians(degrees) {
    return degrees * Math.PI / 180.0;
}

function sumVector(v1, v2) {
    v1[0] += v2[0];
    v1[1] += v2[1];
    v1[2] += v2[2];
}