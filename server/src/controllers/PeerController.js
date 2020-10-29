let peers = []

module.exports = {
    async resources(req, res) {
        res.send(peers)
    },

    async resource(req, res) {
        const { id } = req.body
        const specificFile = peers.map(peer => {
          if(peer.files.id === id) return peer
        })
        res.send(specificFile)
    },

    async post(req, res) {
      const { ip, port } = req.get('host').split(':')
      const { files } = req.body
      console.log(files)
      peers.push({
        files,
        ip,
        port,
      })
      
      const peer = peers.filter(peer => {
        if(peer.port === port) return peer
      })
      res.send(peer)
    },

    async healthCheck(req, res) {
      const { ip, port } = req.get('host').split(':')
      const time = new Date.getTime()
      const { id } = req.body
    }
}