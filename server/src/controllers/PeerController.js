let peers = []
let peersOverlay = []

function validateRestCall() {
  const currentDate = new Date()

  // TODO - chamar essa função em uma Thread
  peersOverlay.map(peer => {
    if((currentDate.getTime() - peer.time) / 1000 > 5) {
      const index = peersOverlay.indexOf(peer)
      peersOverlay.splice(index, 1)
    }
  })
}

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
      peers.push({
        files,
        ip: path[0],
        port: path[1],
      })
      
      const peer = peers.filter(peer => {
        if(peer.port === path[1]) return peer
      })
      res.send(peer)
    },

    async healthCheck(req, res) {
      const path = req.get('host').split(':')
      const time = new Date()
  
      const found = peersOverlay.find(element => element.port === path[1]);
      
      if(found !== undefined) {
        peersOverlay.map(peer => {
          // TODO - colocar todo o objeto
          if(peer.port === path[1]) peer.time = time.getTime()
        })
      } else {
        peersOverlay.push({
          ip: path[0],
          port: path[1],
          time: time.getTime(),
        })
      }
    }
}