import { CronJob } from 'cron'
import { generateTrendingContent, generateClientResponse, getOptimalPostingTime } from './contentGenerator'
import instagramService from './instagramService'

interface AutomationConfig {
  username: string
  autoPost: boolean
  postingInterval: number // in hours
}

class AutomationManager {
  private postingJob: CronJob | null = null
  private messageCheckJob: CronJob | null = null
  private isRunning = false
  private config: AutomationConfig | null = null

  async start(config: AutomationConfig): Promise<boolean> {
    if (this.isRunning) {
      console.log('Automation already running')
      return false
    }

    try {
      this.config = config

      // Connect to Instagram
      const connected = await instagramService.connect({
        username: config.username
      })

      if (!connected) {
        throw new Error('Failed to connect to Instagram')
      }

      // Setup posting job if auto-posting is enabled
      if (config.autoPost) {
        this.setupPostingJob(config.postingInterval)
      }

      // Setup message checking job (every 5 minutes)
      this.setupMessageCheckJob()

      this.isRunning = true
      console.log('Automation started successfully')
      return true
    } catch (error) {
      console.error('Failed to start automation:', error)
      return false
    }
  }

  private setupPostingJob(intervalHours: number) {
    // Calculate cron pattern for posting interval
    const cronPattern = `0 */${intervalHours} * * *` // Every N hours

    this.postingJob = new CronJob(
      cronPattern,
      async () => {
        console.log('Auto-posting job triggered')
        await this.createAndPost()
      },
      null,
      true,
      'America/New_York'
    )

    console.log(`Posting job scheduled: every ${intervalHours} hours`)
  }

  private setupMessageCheckJob() {
    // Check messages every 5 minutes
    this.messageCheckJob = new CronJob(
      '*/5 * * * *',
      async () => {
        console.log('Checking for new messages...')
        await this.checkAndReplyToMessages()
      },
      null,
      true,
      'America/New_York'
    )

    console.log('Message check job scheduled: every 5 minutes')
  }

  async createAndPost(): Promise<boolean> {
    try {
      console.log('Generating new content...')

      // Generate content
      const content = await generateTrendingContent()
      console.log(`Generated ${content.type} content:`, content.description)

      // Note: Image generation will happen client-side
      // For server-side posting, we'll store metadata and generate later
      const imageData = null // Placeholder for demo

      // Post to Instagram (in production, this would use actual image)
      const posted = await instagramService.postImage(
        imageData as any,
        content.caption,
        content.hashtags
      )

      if (posted) {
        console.log('Successfully posted to Instagram!')
        return true
      } else {
        console.error('Failed to post to Instagram')
        return false
      }
    } catch (error) {
      console.error('Error in createAndPost:', error)
      return false
    }
  }

  async checkAndReplyToMessages(): Promise<void> {
    try {
      const messages = await instagramService.checkMessages()
      const unreplied = messages.filter(m => !m.replied)

      if (unreplied.length === 0) {
        console.log('No new messages to reply to')
        return
      }

      console.log(`Found ${unreplied.length} unreplied messages`)

      for (const message of unreplied) {
        console.log(`Processing message from ${message.from}:`, message.message)

        // Generate AI response
        const response = await generateClientResponse(message.message)
        console.log('Generated response:', response)

        // Send reply
        const replied = await instagramService.replyToMessage(message.id, response)

        if (replied) {
          console.log(`Successfully replied to ${message.from}`)
        } else {
          console.error(`Failed to reply to ${message.from}`)
        }

        // Wait 2-5 seconds between replies to appear more natural
        await this.delay(2000 + Math.random() * 3000)
      }
    } catch (error) {
      console.error('Error checking/replying to messages:', error)
    }
  }

  stop() {
    if (!this.isRunning) {
      return false
    }

    if (this.postingJob) {
      this.postingJob.stop()
      this.postingJob = null
    }

    if (this.messageCheckJob) {
      this.messageCheckJob.stop()
      this.messageCheckJob = null
    }

    instagramService.disconnect()
    this.isRunning = false
    this.config = null

    console.log('Automation stopped')
    return true
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      config: this.config,
      instagram: instagramService.getStatus(),
      nextPost: this.config?.autoPost ? getOptimalPostingTime() : null
    }
  }

  isActive(): boolean {
    return this.isRunning
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Singleton instance
const automationManager = new AutomationManager()
export default automationManager
