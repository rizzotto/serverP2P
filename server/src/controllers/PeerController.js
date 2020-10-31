let peers = []

module.exports = {
    async resources(req, res) {
        res.send(peers)
    },

    async resource(req, res) {
        const specificPeer = peers.filter(peer => {
          if(peer.id === req.params.id) return peer
        })
        res.send(specificPeer)
    },

    async post(req, res) {
      const { ip, port } = req.get('host').split(':')
      const { filesNames, filesHashes, id } = req.body
      console.log(req.body)
      peers.push({
        id,
        filesNames,
        filesHashes,
        ip,
        port,
      })
      
      const peer = peers.filter(peer => {
        if(peer.id === id) return peer
      })
      res.send(peer)
    },

    async healthCheck(req, res) {
      const { ip, port } = req.get('host').split(':')
      const time = new Date.getTime()
      const { id } = req.body
    }
}