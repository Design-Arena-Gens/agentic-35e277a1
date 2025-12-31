import { NextResponse } from 'next/server'
import automationManager from '@/lib/automationManager'

export async function POST() {
  try {
    const stopped = automationManager.stop()

    if (stopped) {
      return NextResponse.json({
        success: true,
        message: 'Automation stopped successfully'
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Automation was not running'
      }, { status: 400 })
    }
  } catch (error) {
    console.error('Stop automation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
