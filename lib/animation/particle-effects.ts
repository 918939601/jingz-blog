import confetti from 'canvas-confetti'

export function startConfettiGinkgo(duration = 5000) {
  const animationEnd = Date.now() + duration
  let skew = 1

  const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min
  }

  const frame = () => {
    const timeLeft = animationEnd - Date.now()
    const ticks = Math.max(200, 500 * (timeLeft / duration))
    skew = Math.max(0.8, skew - 0.001)

    confetti({
      particleCount: 1,
      startVelocity: 0,
      ticks,
      origin: {
        x: Math.random(),
        y: Math.random() * skew - 0.2,
      },
      colors: ['#F8E16C', '#F5D76E', '#F6CB42', '#F3C13A', '#E9B02F'],
      shapes: ['circle'],
      gravity: randomInRange(0.4, 0.6),
      scalar: randomInRange(0.4, 1),
      drift: randomInRange(-0.4, 0.4),
    })

    if (timeLeft > 0) {
      requestAnimationFrame(frame)
    }
  }

  requestAnimationFrame(frame)
}

export function startConfettiSakura(duration = 5000) {
  const animationEnd = Date.now() + duration
  let skew = 1

  const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min
  }

  const frame = () => {
    const timeLeft = animationEnd - Date.now()
    const ticks = Math.max(200, 500 * (timeLeft / duration))
    skew = Math.max(0.8, skew - 0.001)

    confetti({
      particleCount: 1,
      startVelocity: 0,
      ticks,
      origin: {
        x: Math.random(),
        y: Math.random() * skew - 0.2,
      },
      colors: ['#BE5985', '#EC7FA9', '#FFB8E0', '#FF9EAA', '#F19ED2'],
      shapes: ['circle'],
      gravity: randomInRange(0.4, 0.6),
      scalar: randomInRange(0.4, 1),
      drift: randomInRange(-0.4, 0.4),
    })

    if (timeLeft > 0) {
      requestAnimationFrame(frame)
    }
  }

  requestAnimationFrame(frame)
}
