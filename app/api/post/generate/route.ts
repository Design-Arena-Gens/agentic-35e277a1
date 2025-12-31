import { NextResponse } from 'next/server'
import automationManager from '@/lib/automationManager'

export async function POST() {
  try {
    if (!automationManager.isActive()) {
      return NextResponse.json({
        success: false,
        error: 'Automation is not running. Please start automation first.'
      }, { status: 400 })
    }

    const success = await automationManager.createAndPost()

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Post created and published successfully'
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to create or publish post'
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Generate post error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
