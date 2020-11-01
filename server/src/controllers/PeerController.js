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
        const { id } = req.params
        let found = false
        peers.map(peer => {
          peer.files.map(file => {
            if(file.id === id){
              found = true
              const ip = peer.ip
              const port = peer.port
              return res.send({
                ip,
                port,
                file
              })
            } 
          })
        })
        if(!found) res.send('recurso não encontrado')
    },

    async post(req, res) {
      const path = req.get('host').split(':')
      const { files } = req.body
      const time = new Date()

      //TODO atualizar o peer se ja existir, e nao criar outro objeto

      if(peers.length === 0) {
        peers.push({
          files,
          ip: path[0],
          port: path[1],
          time: time.getTime()
        })
      } else {
        peers.map(peer => {
          if(peer.port === path[1]) {
            peer.files = files
            peer.time = time.getTime()
          }else {
            peers.push({
              files,
              ip: path[0],
              port: path[1],
              time: time.getTime()
            })
          }
        })
      }
      

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