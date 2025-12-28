const SIZE = 1000
const BG = '#1c1c1c'
const FG = '#9e50f1'

canvas.width = SIZE
canvas.height = SIZE

const ctx = canvas.getContext('2d')

function format({ x, y }) {
	return {
		x: ((x + 1) / 2) * SIZE,
		y: (1 - (y + 1) / 2) * SIZE
	}
}

function project({ x, y, z }) {
	return { x: x / z, y: y / z }
}

function clear() {
	ctx.fillStyle = BG
	ctx.fillRect(0, 0, SIZE, SIZE)
}

function point({ x, y }, size = 10) {
	ctx.fillStyle = FG
	ctx.fillRect(x - size / 2, y - size / 2, size, size)
}

function line(p1, p2, color = FG) {
	ctx.strokeStyle = color
	ctx.lineWidth = 5

	ctx.beginPath()
	ctx.moveTo(p1.x, p1.y)
	ctx.lineTo(p2.x, p2.y)
	ctx.stroke()
	ctx.closePath()
}

function rotateXZ({ x, y, z }, angle) {
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

const vertexes = [
	{ x: 0, y: 0.125, z: 0 },
	{ x: 0, y: -0.125, z: -0.125 },
	{ x: -0.125, y: -0.125, z: 0.125 },
	{ x: 0.125, y: -0.125, z: 0.125 },

	// cube
	{ x: 0.25, y: 0.25, z: 0.25 },
	{ x: -0.25, y: 0.25, z: 0.25 },
	{ x: -0.25, y: -0.25, z: 0.25 },
	{ x: 0.25, y: -0.25, z: 0.25 },

	{ x: 0.25, y: 0.25, z: -0.25 },
	{ x: -0.25, y: 0.25, z: -0.25 },
	{ x: -0.25, y: -0.25, z: -0.25 },
	{ x: 0.25, y: -0.25, z: -0.25 }
]

// indexes of vertexes to join
const faces = [
	[0, 1],
	[0, 2],
	[0, 3],
	[1, 2, 3],

	// cube
	[4, 5, 6, 7],
	[8, 9, 10, 11],
	[4, 8],
	[5, 9],
	[6, 10],
	[7, 11]
]

let dt = 1 / 180
let dz = 0.5
let angle = 0

function draw() {
	clear()

	if (dz < 1) dz += 1 * dt
	angle += Math.PI * dt

	for (const v of vertexes) {
		point(format(project(translateZ(rotateXZ(v, angle), dz))))
	}

	for (const f of faces) {
		for (let i = 0; i < f.length; i++) {
			const p1 = format(project(translateZ(rotateXZ(vertexes[f[i]], angle), dz)))
			const p2 = format(project(translateZ(rotateXZ(vertexes[f[(i + 1) % f.length]], angle), dz)))

			line(p1, p2)
		}
	}

	requestAnimationFrame(() => draw())
}

draw()
