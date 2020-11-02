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
      const { files, port } = req.body
      const ip = req.connection.remoteAddress

      const time = new Date()

      if(peers.length === 0) {
        peers.push({
          files,
          ip,
          port,
          time: time.getTime()
        })
      } else {
        peers.map(peer => {
          if(peer.port === port && peer.ip===ip) {
            peer.files = files
            peer.time = time.getTime()
          }else {
            peers.push({
              files,
              ip,
              port,
              time: time.getTime()
            })
          }
        })
      }
      

      const peer = peers.filter(peer => {
        if(peer.port === port && peer.ip===ip) return peer
      })
      res.send(peer)
    },

    async healthCheck(req, res) {
      const { port } = req.body
      const ip = req.connection.remoteAddress
      const time = new Date()
  
      peers.map(peer => {
        if(peer.port === port && peer.ip===ip) peer.time = time.getTime()
      })

      res.send(peers)
    }
}