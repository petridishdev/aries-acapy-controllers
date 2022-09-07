import axios from 'axios'

class AgentService {
  hostname = process.env.ACME_AGENT_HOST ?? 'localhost'
  port = process.env.ACME_AGENT_PORT ?? ''

  constructor () {
    console.log('Agent is running on: ' + this.URL)
  }

  get URL (): string {
    return `http://${this.hostname}:${this.port}`
  }

  async getStatus (): Promise<any> {
    try {
      const response = await axios.get(`${this.URL}/status`)
      return response
    } catch (error) {
      console.error(error)
      return null
    }
  }

  async createWallet (wallet: any): Promise<any> {
    try {
      const response = await axios.post(`${this.URL}/multitenancy/wallet`, wallet)
      return response.data
    } catch (error) {
      console.error(error)
      return null
    }
  }

  async getConnections (token: string): Promise<any[]> {
    try {
      const response = await axios.get(`${this.URL}/connections`, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }) as any
      return response.data.results
    } catch (error) {
      console.error(error)
      return []
    }
  }

  async removeConnection (connectionId: string, token: string): Promise<void> {
    try {
      await axios.delete(`${this.URL}/connections/${connectionId}`, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  async createInvitation (token: string): Promise<any> {
    try {
      const response = await axios.post(`${this.URL}/connections/create-invitation`, null, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
      return response.data
    } catch (error) {
      console.error(error)
      return {}
    }
  }

  async receiveInvitation (invitation: any, token: string): Promise<any> {
    try {
      invitation.serviceEndpoint = this.URL
      const response = await axios.post(`${this.URL}/connections/receive-invitation`, invitation, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  async getProofRequests (): Promise<any> {
    try {
      const response = await axios.get(`${this.URL}/present-proof/records`) as any
      return response.results
    } catch (error) {
      console.error(error)
      return []
    }
  }

  async sendProofRequest (proofRequest: any): Promise<void> {
    try {
      await axios.post(`${this.URL}/present-proof/send-request`, proofRequest)
    } catch (error) {
      console.error(error)
    }
  }
}

const agentService = new AgentService()
export { agentService }
