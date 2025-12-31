import { NextRequest, NextResponse } from 'next/server'
import automationManager from '@/lib/automationManager'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, autoPost, postingInterval } = body

    if (!username) {
      return NextResponse.json({
        success: false,
        error: 'Instagram username is required'
      }, { status: 400 })
    }

    const started = await automationManager.start({
      username,
      autoPost: autoPost || false,
      postingInterval: postingInterval || 4
    })

    if (started) {
      return NextResponse.json({
        success: true,
        message: 'Automation started successfully'
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to start automation'
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Start automation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
