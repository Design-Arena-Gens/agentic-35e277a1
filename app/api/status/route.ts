import { NextResponse } from 'next/server'
import automationManager from '@/lib/automationManager'
import instagramService from '@/lib/instagramService'

export async function GET() {
  try {
    const status = automationManager.getStatus()
    const posts = instagramService.getRecentPosts(20)
    const messages = instagramService.getMessages()

    return NextResponse.json({
      status: status.isRunning ? 'running' : 'stopped',
      config: status.config,
      recentPosts: posts,
      recentMessages: messages,
      instagram: status.instagram,
      nextPost: status.nextPost
    })
  } catch (error) {
    console.error('Status API error:', error)
    return NextResponse.json({
      status: 'error',
      error: 'Failed to get status'
    }, { status: 500 })
  }
}
