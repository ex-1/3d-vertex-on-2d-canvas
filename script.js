const SIZE = 1000
const BG = '#1c1c1c'
const FG = '#9e50f1'

canvas.width = SIZE
canvas.height = SIZE

const ctx = canvas.getContext('2d')

function carry(fn) {
	return a => b => fn(b, a)
}

function pipe(...fns) {
	return arg => fns.reduce((acc, fn) => fn(acc), arg)
}

class Draw {
	static clear() {
		ctx.fillStyle = BG
		ctx.fillRect(0, 0, SIZE, SIZE)
	}

	static point({ x, y }, color = FG) {
		const size = 10
		ctx.fillStyle = color
		ctx.fillRect(x - size / 2, y - size / 2, size, size)
	}

	static line(p1, p2, color = FG) {
		ctx.strokeStyle = color
		ctx.lineWidth = 5

		ctx.beginPath()
		ctx.moveTo(p1.x, p1.y)
		ctx.lineTo(p2.x, p2.y)
		ctx.stroke()
		ctx.closePath()
	}
}

function project({ x, y, z }) {
	return { x: x / z, y: y / z }
}

function rotate({ x, y, z }, angle) {
	// x′ = xcosθ − ysinθ
	// y′ = xsinθ + ycosθ

	const s = Math.sin(angle)
	const c = Math.cos(angle)

	const xy = x * c - y * s

	return {
		x: xy * c - z * s,
		y: x * s + y * c,
		z: xy * s + z * c
	}
}

function translateZ({ x, y, z }, dz) {
	return { x, y, z: z + dz }
}

function format({ x, y }) {
	return {
		x: ((x + 1) / 2) * SIZE,
		y: (1 - (y + 1) / 2) * SIZE
	}
}

let dt = 1 / 180
let dz = 0.5
let angle = 0

function draw() {
	Draw.clear()

	if (dz < 1) dz += 1 * dt
	angle += Math.PI * dt

	const getPoint = pipe(carry(rotate)(angle), carry(translateZ)(dz), project)

	/* Cube (objects/cube.js) */

	// for (const cv of cubeVertexes) {
	// 	const p = format(getPoint(cv))
	// 	Draw.point(p)
	// }
	for (const cf of cubeFaces) {
		for (let i = 0; i < cf.length; i++) {
			const p1 = getPoint(cubeVertexes[cf[i]])
			const p2 = getPoint(cubeVertexes[cf[(i + 1) % cf.length]])
			Draw.line(format(p1), format(p2))
		}
	}

	/* Pyramid (objects/pyramid.js) */

	// for (const cv of pyramidVertexes) {
	// 	const p = format(getPoint(cv))
	// 	Draw.point(p, pyramidColor)
	// }
	for (const pf of pyramidFaces) {
		for (let i = 0; i < pf.length; i++) {
			const p1 = getPoint(pyramidVertexes[pf[i]])
			const p2 = getPoint(pyramidVertexes[pf[(i + 1) % pf.length]])
			Draw.line(format(p1), format(p2), pyramidColor)
		}
	}

	requestAnimationFrame(() => draw())
}

draw()
