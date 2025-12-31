// Browser-based image generation using HTML5 Canvas API
export interface ImageGenerationOptions {
  type: 'ui-design' | 'logo'
  description: string
}

export async function generateDesignImage(options: ImageGenerationOptions): Promise<string> {
  const width = 1080
  const height = 1080

  // Create offscreen canvas
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  if (options.type === 'logo') {
    generateLogoImage(ctx, width, height, options.description)
  } else {
    generateUIImage(ctx, width, height, options.description)
  }

  // Return base64 data URL
  return canvas.toDataURL('image/png')
}

function generateLogoImage(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  description: string
): void {
  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  const colors = getRandomColorPalette()
  gradient.addColorStop(0, colors[0])
  gradient.addColorStop(0.5, colors[1])
  gradient.addColorStop(1, colors[2])

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  // Center logo area
  const centerX = width / 2
  const centerY = height / 2
  const logoSize = 400

  // Blur effect background
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
  ctx.beginPath()
  ctx.arc(centerX, centerY, logoSize / 2, 0, Math.PI * 2)
  ctx.fill()

  // Generate geometric shapes for logo
  if (description.includes('geometric') || description.includes('minimalist')) {
    drawGeometricLogo(ctx, centerX, centerY, logoSize)
  } else if (description.includes('gradient') || description.includes('fluid')) {
    drawFluidLogo(ctx, centerX, centerY, logoSize, colors)
  } else if (description.includes('letter') || description.includes('typography')) {
    drawLettermarkLogo(ctx, centerX, centerY, logoSize)
  } else {
    drawAbstractLogo(ctx, centerX, centerY, logoSize, colors)
  }
}

function generateUIImage(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  description: string
): void {
  // Background
  const isDark = description.includes('dark') || Math.random() > 0.5
  if (isDark) {
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, '#1a1a2e')
    gradient.addColorStop(1, '#16213e')
    ctx.fillStyle = gradient
  } else {
    ctx.fillStyle = '#f8f9fa'
  }
  ctx.fillRect(0, 0, width, height)

  if (description.includes('glassmorphism') || description.includes('glass')) {
    drawGlassmorphicCard(ctx, width, height, isDark)
  } else if (description.includes('neumorphic') || description.includes('soft shadow')) {
    drawNeumorphicCard(ctx, width, height, isDark)
  } else if (description.includes('dashboard')) {
    drawDashboardUI(ctx, width, height, isDark)
  } else if (description.includes('pricing') || description.includes('card')) {
    drawPricingCards(ctx, width, height, isDark)
  } else {
    drawModernCard(ctx, width, height, isDark)
  }
}

function drawGlassmorphicCard(ctx: CanvasRenderingContext2D, width: number, height: number, isDark: boolean) {
  const centerX = width / 2
  const centerY = height / 2
  const cardWidth = 800
  const cardHeight = 600

  // Floating circles in background
  const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe']
  for (let i = 0; i < 3; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 200)
    gradient.addColorStop(0, colors[i] + '80')
    gradient.addColorStop(1, colors[i] + '00')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(x, y, 200, 0, Math.PI * 2)
    ctx.fill()
  }

  // Glass card
  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
  ctx.lineWidth = 2
  roundRect(ctx, centerX - cardWidth / 2, centerY - cardHeight / 2, cardWidth, cardHeight, 30)
  ctx.fill()
  ctx.stroke()

  // Content simulation
  ctx.fillStyle = isDark ? '#ffffff' : '#000000'
  ctx.font = 'bold 48px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('Glassmorphic Design', centerX, centerY - 100)

  ctx.font = '24px Arial'
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'
  ctx.fillText('Modern UI with blur effects', centerX, centerY)

  // Button
  const gradient = ctx.createLinearGradient(centerX - 100, 0, centerX + 100, 0)
  gradient.addColorStop(0, '#667eea')
  gradient.addColorStop(1, '#764ba2')
  ctx.fillStyle = gradient
  roundRect(ctx, centerX - 100, centerY + 100, 200, 60, 15)
  ctx.fill()

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 20px Arial'
  ctx.fillText('Get Started', centerX, centerY + 140)
}

function drawNeumorphicCard(ctx: CanvasRenderingContext2D, width: number, height: number, isDark: boolean) {
  const centerX = width / 2
  const centerY = height / 2

  const cardWidth = 700
  const cardHeight = 500
  const bgColor = isDark ? '#2d2d2d' : '#e0e5ec'

  ctx.fillStyle = bgColor
  roundRect(ctx, centerX - cardWidth / 2, centerY - cardHeight / 2, cardWidth, cardHeight, 40)
  ctx.fill()

  // Input fields
  for (let i = 0; i < 3; i++) {
    const y = centerY - 100 + i * 100
    ctx.fillStyle = bgColor
    roundRect(ctx, centerX - 250, y, 500, 60, 15)
    ctx.fill()
  }

  // Text
  ctx.fillStyle = isDark ? '#ffffff' : '#000000'
  ctx.font = 'bold 36px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('Neumorphic Form', centerX, centerY - 180)
}

function drawDashboardUI(ctx: CanvasRenderingContext2D, width: number, height: number, isDark: boolean) {
  // Sidebar
  ctx.fillStyle = isDark ? '#1e1e2e' : '#2d3748'
  ctx.fillRect(0, 0, 250, height)

  // Main area
  const mainBg = isDark ? '#0f0f1e' : '#f7fafc'
  ctx.fillStyle = mainBg
  ctx.fillRect(250, 0, width - 250, height)

  // Header
  ctx.fillStyle = isDark ? '#2d2d3d' : '#ffffff'
  ctx.fillRect(250, 0, width - 250, 100)

  // Cards
  const cardPositions = [
    { x: 320, y: 150 },
    { x: 620, y: 150 },
    { x: 320, y: 450 },
    { x: 620, y: 450 }
  ]

  cardPositions.forEach((pos, i) => {
    const gradient = ctx.createLinearGradient(pos.x, pos.y, pos.x + 280, pos.y + 250)
    const colors = [
      ['#667eea', '#764ba2'],
      ['#f093fb', '#f5576c'],
      ['#4facfe', '#00f2fe'],
      ['#43e97b', '#38f9d7']
    ]
    gradient.addColorStop(0, colors[i][0])
    gradient.addColorStop(1, colors[i][1])

    ctx.fillStyle = gradient
    roundRect(ctx, pos.x, pos.y, 280, 250, 20)
    ctx.fill()

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 28px Arial'
    ctx.textAlign = 'left'
    ctx.fillText(`Card ${i + 1}`, pos.x + 20, pos.y + 50)
  })

  // Sidebar items
  ctx.fillStyle = '#667eea'
  for (let i = 0; i < 5; i++) {
    roundRect(ctx, 20, 100 + i * 80, 210, 50, 10)
    ctx.fill()
  }
}

function drawPricingCards(ctx: CanvasRenderingContext2D, width: number, height: number, isDark: boolean) {
  const cardWidth = 280
  const cardHeight = 700
  const spacing = 50

  for (let i = 0; i < 3; i++) {
    const x = (width - (cardWidth * 3 + spacing * 2)) / 2 + i * (cardWidth + spacing)
    const y = (height - cardHeight) / 2

    const gradient = ctx.createLinearGradient(x, y, x, y + cardHeight)
    const isHighlight = i === 1
    if (isHighlight) {
      gradient.addColorStop(0, '#667eea')
      gradient.addColorStop(1, '#764ba2')
    } else {
      gradient.addColorStop(0, isDark ? '#2d2d3d' : '#ffffff')
      gradient.addColorStop(1, isDark ? '#1d1d2d' : '#f7fafc')
    }

    ctx.fillStyle = gradient
    roundRect(ctx, x, y, cardWidth, cardHeight, 20)
    ctx.fill()

    if (!isHighlight) {
      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
      ctx.lineWidth = 2
      ctx.stroke()
    }

    ctx.fillStyle = isHighlight ? '#ffffff' : (isDark ? '#ffffff' : '#000000')
    ctx.font = 'bold 32px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(['Basic', 'Pro', 'Enterprise'][i], x + cardWidth / 2, y + 80)

    ctx.font = 'bold 48px Arial'
    ctx.fillText(`$${[29, 79, 199][i]}`, x + cardWidth / 2, y + 180)

    ctx.font = '20px Arial'
    ctx.fillText('/month', x + cardWidth / 2, y + 220)
  }
}

function drawModernCard(ctx: CanvasRenderingContext2D, width: number, height: number, isDark: boolean) {
  const centerX = width / 2
  const centerY = height / 2

  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#667eea')
  gradient.addColorStop(1, '#764ba2')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
  roundRect(ctx, centerX - 400, centerY - 300, 800, 600, 30)
  ctx.fill()

  ctx.fillStyle = '#000000'
  ctx.font = 'bold 56px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('Modern Design', centerX, centerY - 100)

  ctx.font = '28px Arial'
  ctx.fillStyle = '#666666'
  ctx.fillText('Clean & Professional', centerX, centerY)

  const btnGradient = ctx.createLinearGradient(centerX - 150, 0, centerX + 150, 0)
  btnGradient.addColorStop(0, '#667eea')
  btnGradient.addColorStop(1, '#764ba2')
  ctx.fillStyle = btnGradient
  roundRect(ctx, centerX - 150, centerY + 100, 300, 70, 35)
  ctx.fill()

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 24px Arial'
  ctx.fillText('Learn More', centerX, centerY + 145)
}

function drawGeometricLogo(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const s = size / 3

  ctx.fillStyle = '#667eea'
  ctx.beginPath()
  ctx.moveTo(x, y - s)
  ctx.lineTo(x + s, y)
  ctx.lineTo(x, y + s)
  ctx.lineTo(x - s, y)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#764ba2'
  ctx.beginPath()
  ctx.arc(x, y, s / 2, 0, Math.PI * 2)
  ctx.fill()
}

function drawFluidLogo(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, colors: string[]) {
  for (let i = 0; i < 3; i++) {
    const offsetX = (i - 1) * (size / 6)
    const gradient = ctx.createRadialGradient(x + offsetX, y, 0, x + offsetX, y, size / 4)
    gradient.addColorStop(0, colors[i] + 'cc')
    gradient.addColorStop(1, colors[i] + '00')

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(x + offsetX, y, size / 3, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawLettermarkLogo(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.fillStyle = '#667eea'
  ctx.font = `bold ${size}px Arial`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('A', x, y)
}

function drawAbstractLogo(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, colors: string[]) {
  const s = size / 4

  for (let i = 0; i < 4; i++) {
    const angle = (Math.PI * 2 * i) / 4
    const px = x + Math.cos(angle) * s
    const py = y + Math.sin(angle) * s

    ctx.fillStyle = colors[i % colors.length]
    ctx.beginPath()
    ctx.arc(px, py, s / 2, 0, Math.PI * 2)
    ctx.fill()
  }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

function getRandomColorPalette(): string[] {
  const palettes = [
    ['#667eea', '#764ba2', '#f093fb'],
    ['#4facfe', '#00f2fe', '#43e97b'],
    ['#fa709a', '#fee140', '#30cfd0'],
    ['#a8edea', '#fed6e3', '#fbc2eb'],
    ['#ff9a9e', '#fecfef', '#ffecd2']
  ]
  return palettes[Math.floor(Math.random() * palettes.length)]
}
