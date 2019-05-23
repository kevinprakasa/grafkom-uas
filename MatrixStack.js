class MatrixStack {
	constructor(){
		this.stack = [];

		this.restore();
	}

	restore () {
		this.stack.pop();
	  // Never let the stack be totally empty
	  if (this.stack.length < 1) {
	  	this.stack[0] = m4.identity();
	  }
	}

	save (m) {
		this.stack.push(m);
	}

	getCurrentMatrix () {
		return this.stack[this.stack.length - 1].slice();
	}
}
