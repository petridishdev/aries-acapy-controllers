import axios from 'axios'

const hostname = process.env.ACME_AGENT_HOST || 'localhost'
const port = process.env.ACME_AGENT_PORT


const URLPrefix = `http://${hostname}:${port}`

console.log('Agent is running on: ' + URLPrefix)

class AgentService {
  async getStatus () {
    try {
      const response = await axios.get(`${URLPrefix}/status`)
      return response
    } catch (error) {
      console.error(error)
      return null
    }
  }

  async getConnections () {
    try {
      const response = await axios.get(`${URLPrefix}/connections`) as any
      return response.results
    } catch (error) {
      console.error(error)
      return []
    }
  }

  async createInvitation () {
    try {
      const response = await axios.post(`${URLPrefix}/connections/create-invitation`)
      return response
    } catch (error) {
      console.error(error)
      return {}
    }
  }

  async receiveInvitation (invitation: any) {
    try {
      const response = await axios.post(`${URLPrefix}/connections/receive-invitation`, invitation)
      return response
    } catch (error) {
      console.error(error)
    }
  }

  async removeConnection (connectionId: string) {
    try {
      await axios.post(`${URLPrefix}/connections/${connectionId}/remove`)
    } catch (error) {
      console.error(error)
    }
  }

  async getProofRequests () {
    try {
      const response = await axios.get(`${URLPrefix}/present-proof/records`) as any
      return response.results
    } catch (error) {
      console.error(error)
      return []
    }
  }

  async sendProofRequest (proofRequest: any) {
    try {
      await axios.post(`${URLPrefix}/present-proof/send-request`, proofRequest)
    } catch (error) {
      console.error(error)
    }
  }
}

const agentService = new AgentService()
export { agentService }