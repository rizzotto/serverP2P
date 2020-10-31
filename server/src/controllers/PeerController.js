let peers = []

// healthCheck
setInterval(function() {
  const currentDate = new Date()

  peers.map(peer => {
    if((currentDate.getTime() - peer.time) / 1000 > 5) {
      const index = peers.indexOf(peer)
      peers.splice(index, 1)
    }
  })
}, 5000);


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
      const path = req.get('host').split(':')
      const { files } = req.body
      const time = new Date()

      peers.push({
        files,
        ip: path[0],
        port: path[1],
        time: time.getTime()
      })
      
      const peer = peers.filter(peer => {
        if(peer.port === path[1]) return peer
      })
      res.send(peer)
    },

    async healthCheck(req, res) {
      const path = req.get('host').split(':')
      const time = new Date()
  
      peers.map(peer => {
        if(peer.port === path[1]) peer.time = time.getTime()
      })

      res.send(peers)
    }
}