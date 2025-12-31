import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-key'
})

export interface GeneratedContent {
  type: 'ui-design' | 'logo'
  caption: string
  hashtags: string[]
  imagePrompt: string
  description: string
}

const trendingUIElements = [
  'Glassmorphism card design with gradient borders',
  'Neumorphic login interface with soft shadows',
  'Modern dashboard with dark mode and neon accents',
  'Minimalist mobile app interface with bold typography',
  'Futuristic pricing cards with 3D elements',
  'Clean landing page hero section with floating elements',
  'Animated microinteractions for buttons',
  'Gradient-based navigation menu design',
  'Modern form design with floating labels',
  'Card-based portfolio layout with hover effects'
]

const trendingLogoStyles = [
  'Minimalist geometric logo with negative space',
  'Abstract gradient logo with fluid shapes',
  'Modern lettermark with bold typography',
  'Nature-inspired organic logo design',
  'Tech startup logo with connected dots',
  'Luxury brand monogram with elegant curves',
  'Playful mascot logo with vibrant colors',
  'Abstract icon combining multiple symbols',
  'Modern emblem with circular badge',
  'Dynamic swoosh with motion effect'
]

export async function generateTrendingContent(): Promise<GeneratedContent> {
  const contentType = Math.random() > 0.5 ? 'ui-design' : 'logo'

  const element = contentType === 'ui-design'
    ? trendingUIElements[Math.floor(Math.random() * trendingUIElements.length)]
    : trendingLogoStyles[Math.floor(Math.random() * trendingLogoStyles.length)]

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a creative social media content creator specializing in UI/UX design and logo design. Create engaging Instagram captions that attract clients."
        },
        {
          role: "user",
          content: `Create an engaging Instagram caption for a ${contentType} post featuring: ${element}. Include a call-to-action for potential clients. Keep it under 150 characters.`
        }
      ],
      max_tokens: 150
    })

    const caption = completion.choices[0]?.message?.content || `Check out this amazing ${contentType}! 🎨✨`

    const hashtags = contentType === 'ui-design'
      ? ['#UIDesign', '#UXDesign', '#WebDesign', '#InterfaceDesign', '#DesignInspiration', '#UIUX', '#DigitalDesign']
      : ['#LogoDesign', '#BrandIdentity', '#GraphicDesign', '#LogoDesigner', '#BrandingDesign', '#LogoInspiration', '#CreativeLogo']

    return {
      type: contentType,
      caption: caption,
      hashtags: hashtags,
      imagePrompt: element,
      description: element
    }
  } catch (error) {
    console.error('OpenAI API error:', error)

    // Fallback content
    const hashtags = contentType === 'ui-design'
      ? ['#UIDesign', '#UXDesign', '#WebDesign', '#InterfaceDesign', '#DesignInspiration']
      : ['#LogoDesign', '#BrandIdentity', '#GraphicDesign', '#LogoDesigner', '#BrandingDesign']

    return {
      type: contentType,
      caption: `Fresh ${contentType === 'ui-design' ? 'UI' : 'logo'} design drop! 🎨 DM for projects ✨`,
      hashtags: hashtags,
      imagePrompt: element,
      description: element
    }
  }
}

export async function generateClientResponse(clientMessage: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional, friendly designer assistant. Respond to client inquiries about design services. Be helpful, professional, and encourage them to discuss their project. Keep responses under 200 characters for Instagram DMs."
        },
        {
          role: "user",
          content: `Client message: "${clientMessage}". Generate a friendly professional response.`
        }
      ],
      max_tokens: 100
    })

    return completion.choices[0]?.message?.content ||
      "Hi! Thanks for reaching out! I'd love to help with your project. Can you tell me more about what you're looking for? 😊"
  } catch (error) {
    console.error('OpenAI API error:', error)

    // Fallback responses based on message content
    const lowerMsg = clientMessage.toLowerCase()

    if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('how much')) {
      return "Hi! Pricing varies by project scope. Let's chat about your specific needs and I'll provide a custom quote. DM me the details! 💼"
    } else if (lowerMsg.includes('portfolio') || lowerMsg.includes('work') || lowerMsg.includes('examples')) {
      return "Thanks for your interest! Check out my highlights for more examples. What kind of project are you looking to create? 🎨"
    } else if (lowerMsg.includes('available') || lowerMsg.includes('hire') || lowerMsg.includes('project')) {
      return "Yes, I'm available for new projects! Tell me more about what you have in mind and let's create something amazing together! ✨"
    } else {
      return "Hi! Thanks for reaching out! I'd love to help with your project. Can you tell me more about what you're looking for? 😊"
    }
  }
}

export function getOptimalPostingTime(): Date {
  const now = new Date()
  const optimalHours = [9, 12, 17, 20] // Best engagement times

  const currentHour = now.getHours()
  let nextHour = optimalHours.find(h => h > currentHour) || optimalHours[0]

  const nextPost = new Date(now)
  if (nextHour <= currentHour) {
    nextPost.setDate(nextPost.getDate() + 1)
  }
  nextPost.setHours(nextHour, 0, 0, 0)

  return nextPost
}
