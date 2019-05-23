const ROTATION_X = 0b1;
const ROTATION_Y = 0b10;
const ROTATION_Z = 0b100
const TRANSLATE = 0b1000;

var parameter = {
	robot: {
		bodyTranslation: [-5, -2, 12],
		bodyRotationY: 0
	},
	spinner: {
		rotation: 0
	},
	walkingGirl: {
		translateX: 0,
		translateZ: -6,
		rotate: 0,
	},
	suzanne: {
		translation: [5, 0, 20],
		rotationY: 0
	},
	planet: {
		translation: [-10, 5, 10],
		rotationX: 0,
		rotationY: 0,
		rotationZ: 0
	},
	jellyhead: {
		rotationY: 0,
		translation: [ -6, 2, 1],
		childs: {
			leg1: {
				translation: [1.3, -1.4, 0],
				rotationZ: 40,
			},
			leg2: {
				translation: [-1.3, -1.4, 0],
				rotationZ: -40,
			},
			leg3: {
				translation: [0, -1.4, 0.75],
				rotationX: 40,
			},
			leg4: {
				translation: [0, -1.4, -0.75],
				rotationX: -40,
			}
		}
	}
};

var robotState = {
	S_Z_MAJU : 0,
	S_Z_MUNDUR : 1,
	S_PUTAR_MAJU : 2,
	S_PUTAR_MUNDUR : 3,

	Z_THRESHOLD : 20,
	Z_MIN_THRESHOLD : 5
};


var robotAction = {
	current_state : robotState.S_Z_MAJU,

	action (data) {
		switch(this.current_state){
			case robotState.S_Z_MAJU:
				data[2] += 0.1;
				break;
			case robotState.S_Z_MUNDUR:
				data[2] -= 0.1;
				break;
			case robotState.S_PUTAR_MUNDUR:
				data = (data + 1) % 360;
				break;
			case robotState.S_PUTAR_MAJU:
				data = (data + 1) % 360;
				break;
		}

		this.checkChangeState(data);
		return data;
	},

	checkChangeState(data) {
		switch(this.current_state){
			case robotState.S_Z_MAJU:
				if (data[2] >= robotState.Z_THRESHOLD){
					this.current_state = robotState.S_PUTAR_MUNDUR;
				}
				break;
			case robotState.S_Z_MUNDUR:
				if (data[2] <= robotState.Z_MIN_THRESHOLD){
					this.current_state = robotState.S_PUTAR_MAJU;
				}
				break;
			case robotState.S_PUTAR_MUNDUR:
				if (data == 180){
					this.current_state = robotState.S_Z_MUNDUR;
				}
				break;
			case robotState.S_PUTAR_MAJU:
				if (data == 0){
					this.current_state = robotState.S_Z_MAJU;
				}
				break;
		}
	}
}

var suzanneState = {
	S_PUTAR_DEPAN_KANAN : 0,
	S_PUTAR_BELAKANG_KANAN : 1,
	S_PUTAR_KIRI : 2,
	S_Z_Y_MAJU : 3,
	S_Y_KIRI : 4,
	S_Z_Y_MUNDUR : 5,

	Z_THRESHOLD : 25,
	Z_MIN_THRESHOLD : 20,
	X_THRESHOLD : 15,
	X_MIN_THRESHOLD : 5
};

var suzanneAction = {
	current_state : suzanneState.S_Z_MAJU,

	action (data) {
		switch(this.current_state){
			case suzanneState.S_PUTAR_DEPAN_KANAN:
				data = (data - 1) % 360;
				break;
			case suzanneState.S_Z_Y_MAJU:
				data[2] += 0.1;
				data[0] += 0.1;
				break;
			case suzanneState.S_PUTAR_BELAKANG_KANAN:
				data = (data - 1) % 360;
				break;
			case suzanneState.S_Z_Y_MUNDUR:
				data[2] -= 0.1;
				data[0] += 0.1;
				break;
			case suzanneState.S_PUTAR_KIRI:
				data = (data - 1) % 360;
				break;
			case suzanne.S_Y_KIRI:
				data[0] -= 0.1;
				break;
		}

		this.checkChangeState(data);
		return data;
	},

	checkChangeState(data) {
		switch(this.current_state){
			case suzanneState.S_PUTAR_DEPAN_KANAN:
				if (-data == 45){
					this.current_state = suzanneState.S_Z_Y_MAJU;
				}
				break;
			case suzanneState.S_Z_Y_MAJU:
				if (data[2] >= suzanneState.Z_THRESHOLD){
					this.current_state = suzanneState.S_PUTAR_BELAKANG_KANAN;
				}
				break;
			case suzanneState.S_PUTAR_BELAKANG_KANAN:
				if (-data == 135){
					this.current_state = suzanneState.S_Z_Y_MUNDUR;
				}
				break;
			case suzanneState.S_Z_Y_MUNDUR:
				if (data[0] >= suzanneState.X_THRESHOLD){
					this.current_state = suzanneState.S_PUTAR_KIRI;
				}
				break;
			case suzanneState.S_PUTAR_KIRI:
				if (-data == 270){
					this.current_state = suzanneState.S_Y_KIRI;
				}
				break;
			case suzanne.S_Y_KIRI:
				if (data[0] <= suzanneState.X_MIN_THRESHOLD){
					this.current_state = suzanneState.S_PUTAR_DEPAN_KANAN;
				}
				break;
		}
	}
}

var robot = {
	body: {
		rotationY() {
			return parameter.robot.bodyRotationY;
		},
		translation () {
			return parameter.robot.bodyTranslation;
		},
		scale: [0.5, 0.7, 0.5],
		function: ROTATION_Y | TRANSLATE,
		objName: 'cylinder',
		texture: 'texture3'
	},
	head: {
		rotationY: 0,
		translation: [0, 1.5, 0],
		scale: [1.5, 0.7, 1.5],
		texture: 'texture5'
	},
	hand1: {
		rotationY: 0,
		translation: [2, 0, 0],
		scale: [1, 0.2, 0.2],
		objName: 'cylinder'
	},
	hand2: {
		rotationY: 0,
		translation: [-2, 0, 0],
		scale: [1, 0.2, 0.2],
		objName: 'cylinder'
	},
	eye1: {
		rotationY: 45,
		translation: [-0.5, 0.5, 1],
		scale: [0.1, 0.1, 0.1]
	},
	eye2: {
		rotationY: 45,
		translation: [0.5, 0.5, 1],
		scale: [0.1, 0.1, 0.1]
	},
	mouth: {
		rotationY: 0,
		translation: [0, -0.5, 1],
		scale: [0.5, 0.1, 0.1]
	},
	nose: {
		rotationY: 0,
		translation: [0, 0, 1],
		scale: [0.1, 0.1, 0.5]
	},
	leg1: {
		rotationY: 0,
		translation: [-0.7, -1.5, 0],
		scale: [0.3, 0.5, 0.3],
		objName: 'cylinder'
	},
	leg2: {
		rotationY: 0,
		translation: [0.7, -1.5, 0],
		scale: [0.3, 0.5, 0.3],
		objName: 'cylinder'
	},

	hierarchy: [{
		name: 'body',
		hasChild: true,
		childs: [
			{
				name: 'head',
				hasChild: true,
				childs: [
					{
						name: 'nose',
						hasChild: false
					},
					{
						name: 'eye1',
						hasChild: false,
					},
					{
						name: 'eye2',
						hasChild: false
					},
					{
						name: 'mouth',
						hasChild: false
					}
				]
			},
			{
				name: 'hand1',
				hasChild: false
			},
			{
				name: 'hand2',
				hasChild: false
			},
			{
				name: 'leg1',
				hasChild: false
			},
			{
				name: 'leg2',
				hasChild: false
			}
		]
	}],
};


var world = {
	ground: {
		rotationY: 0,
		translation: [1, -5, 2],
		scale: [100, 1, 100],
		color: [1, 1, 1],
		texture: 'wooden'
	},
	wall: {
		rotationY: 0,
		translation: [0, 0, 1200],
		scale: [2000, 2000, 0.1],
		color: [1, 1, 1],
		texture: 'wall1',
	},
	hierarchy: [{
		name: 'ground',
		hasChild: false,
	},
	{
		name: 'wall',
		hasChild: false
	}]
}

var suzanne = {
	head: {
		rotationY() {
			return 0;
		},
		translation: [0, 1, 0],
		scale: [0.35, 0.35, 0.25],
		color: [1, 1, 1],
		objName: 'suzanne',
		rotationX: -90,
		function: ROTATION_Y,
		texture: 'texture5'
	},
	body: {
		rotationY (){
			return parameter.suzanne.rotationY;
		},
		translation() {
			return parameter.suzanne.translation;
		},
		scale: [1, 2, 1],
		color: [1, 1, 1],
		objName: 'cylinder',
		function : TRANSLATE | ROTATION_Y,
		texture: 'texture4'
	},
	hand1: {
		rotationY: 0,
		translation: [1.9, 0.5, 0],
		scale: [1, 0.2, 1],
		objName: 'sphere',
		color: [1, 1, 1],
	},
	hand2: {
		rotationY: 0,
		translation: [-1.9, 0.5, 0],
		scale: [1, 0.2, 1],
		objName: 'sphere',
		color: [1, 1, 1],
	},
	hierarchy: [{
		name: 'body',
		hasChild: true,
		childs: [
			{
				name: 'head',
				hasChild: false,
			},
			{
				name: 'hand1',
				hasChild: false
			},
			{
				name: 'hand2',
				hasChild: false
			},
		]
	}]
}

var test = {
	test: {
		rotationY: 0,
		rotationX: 0,
		translation: [0, 0, 0],
		scale: [1, 1, 1],
		color: [0,1.0,0],
		objName: 'cone'
	},
	hierarchy: [{
		name: 'test',
		hasChild: false,
	}]
}

var lamp = {
	lamp: {
		translation: [-9.5,3.5,3],
		scale: [0.1,0.1,0.1],
		color: [1,1,1],
		objName: 'sphere'
	},
	hierarchy: [{
		name: 'lamp',
		hasChild: false
	}]
};

var jellyhead = {
	jellyhead: {
		rotationY() {
			return parameter.jellyhead.rotationY;
		},
		translation() {
			return parameter.jellyhead.translation;
		},
		scale: [1, 1, 1],
		color: [1,1,1],
		objName: 'jellyhead',
		function: ROTATION_Y | TRANSLATE,
		texture: "texture3"
	},
	leg1: {
		translation() {
			return  parameter.jellyhead.childs.leg1.translation;
		},
		rotationZ() {
			return parameter.jellyhead.childs.leg1.rotationZ;
		},
		scale: [0.1, 0.7, 0.1],
		color:  [0.5,0,0.5],
		objName: 'cube',
		function: TRANSLATE | ROTATION_Z,
	},
	leg2: {
		translation() {
			return parameter.jellyhead.childs.leg2.translation
		},
		rotationZ() {
			return parameter.jellyhead.childs.leg2.rotationZ
		},
		scale: [0.1, 0.7, 0.1],
		color:  [0.5,0,0.5],
		objName: 'cube',
		function: TRANSLATE | ROTATION_Z
	},
	leg3: {
		translation() {
			return parameter.jellyhead.childs.leg3.translation;
		},
		rotationX() {
			return parameter.jellyhead.childs.leg3.rotationX;
		},
		scale: [0.1, 0.7, 0.1],
		color:  [0.5,0,0.5],
		objName: 'cube',
		function: TRANSLATE | ROTATION_X,
	},
	leg4: {
		translation() {
			return parameter.jellyhead.childs.leg4.translation;
		},
		rotationX() {
			return parameter.jellyhead.childs.leg4.rotationX;
		},
		scale: [0.1, 0.7, 0.1],
		color:  [0.5,0,0.5],
		objName: 'cube',
		function: TRANSLATE | ROTATION_X
	},
	hierarchy: [{
		name: 'jellyhead',
		hasChild: true,
		childs: [
			{
				name: "leg1",
				hasChild: false,
			},
			{
				name: "leg2",
				hasChild: false,
			},
			{
				name: "leg3",
				hasChild: false,
			},
			{
				name: "leg4",
				hasChild: false,
			}
		]
	}]
};

var spinner = {
	ring1: {
		translation: [-15, 0, -15],
		scale: [30, 30, 30],
		color: [1.0, 0, 0],
		objName: 'torus',
		texture: 'texture4'
	},
	ring2: {
		translation: [15, 0, -15],
		scale: [30, 30, 30],
		color: [0, 1.0, 0],
		objName: 'torus',
		texture: 'texture4'
	},
	ring3: {
		translation: [0, 0, 15],
		scale: [30, 30, 30],
		color: [0, 0, 1.0],
		objName: 'torus',
		texture: 'texture4'
	},
	mid: {
		rotationX: 90,
		rotationY() {
			return parameter.spinner.rotation;
		},
		translation: [0, -1, 10],
		scale: [0.025, 0.025, 0.025],
		objName: 'sphere',
		function: ROTATION_Y,
	},
	hierarchy: [{
		name: 'mid',
		hasChild: true,
		childs: [
			{
				name: 'ring1',
				hasChild: false,
			},
			{
				name: 'ring2',
				hasChild: false,
			},
			{
				name: 'ring3',
				hasChild: false,
			},
		]
	}]
}


var walkingGirl = {
	walkingGirl: {
		translation() {
			return [parameter.walkingGirl.translateX, -2, parameter.walkingGirl.translateZ]
		},
		scale: [0.02, 0.02, 0.02],
		objName: 'WalkingGirl',
		color: [0, 0, 0],
		rotationX: -90,
		rotationY() {
			return parameter.walkingGirl.rotate;
		},
		function: TRANSLATE | ROTATION_Y,
		texture: 'texture2'
	},
	hierarchy: [{
		name: 'walkingGirl',
		hasChild: false,
	}]
}

var planet = {
	orbit: {
		translation() {
			return parameter.planet.translation;
		},
		rotationX(){
			return parameter.planet.rotationX;
		},
		rotationY(){
			return parameter.planet.rotationY;
		},
		rotationZ(){
			return parameter.planet.rotationZ;
		},
		scale: [0.6,0.6,0.6],
		objName: "sphere",
		color: [0,0,1],
		function : TRANSLATE | ROTATION_Y | ROTATION_X | ROTATION_Z,
		texture: 'texture3'
	},
	orbit2: {
		translation: [1.1, 1.1 , 1.1],
		scale: [1,1,1],
		color: [1,0,0],
		objName: "sphere"
	},
	orbit1: {
		translation: [-1.1, -1.1, -1.1],
		scale: [1,1,1],
		color: [1,0,0],
		objName: "sphere"
	},
	satellite1: {
		translation: [1.5,1.5,-1.5],
		scale: [0.3,0.3,0.3],
		color: [1,0,0],
		objName: "sphere"
	},
	satellite2: {
		translation: [-1.5,1.5,1.5],
		scale: [0.3,0.3,0.3],
		color: [0,0,1],
		objName: "sphere"
	},

	satellite3: {
		translation: [1.5,-1.5,1.5],
		scale: [0.3,0.3,0.3],
		color: [1,0,0],
		objName: "sphere"
	},

	hierarchy : [
	{
		name: 'orbit',
		hasChild: true,
		childs : [
		{
			name: 'satellite1',
			hasChild: false
		},
		{
			name: 'satellite2',
			hasChild: false
		},
		{
			name: 'satellite3',
			hasChild: false
		},
		{
			name: 'orbit2',
			hasChild: false,
		},
		{
			name: 'orbit1',
			hasChild: false,
		}
		]
	}
	]
}