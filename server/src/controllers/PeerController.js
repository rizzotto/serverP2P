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
      const { filesNames, filesHashes, id } = req.body
      peers.push({
        id,
        filesNames,
        filesHashes
      })
      
      const peer = peers.filter(peer => {
        if(peer.id === id) return peer
      })
      res.send(peer)
    },

    async healthCheck(req, res) {

    }
}