const fs = require('fs')
const axios = require('axios')
const server = require('http').createServer()
var io = require('socket.io')(server)
const ss = require('socket.io-stream')

const command = {
  name: 'run',
  description: 'inicia funções client',
  run: async toolbox => {
    const { print, prompt, template } = toolbox

    const { serverIp } = await prompt.ask({
      type: 'input',
      name: 'serverIp',
      message: 'Informe o IP do server'
    })

    const { serverPort } = await prompt.ask({
      type: 'input',
      name: 'serverPort',
      message: 'Informe a porta do server'
    })
    if (
      isNaN(parseInt(serverPort)) ||
      serverPort < 0 ||
      serverPort >= 65536
    ) {
      print.error('Informe uma porta válida')
      return
    }

    const { socket } = await prompt.ask({
      type: 'input',
      name: 'socket',
      message: 'Informe a qual o ip da máquina cliente'
    })

    const { socketPort } = await prompt.ask({
      type: 'input',
      name: 'socketPort',
      message: 'Informe a qual a porta da máquina cliente'
    })
    if (
      isNaN(parseInt(socketPort)) ||
      socketPort < 0 ||
      socketPort >= 65536
    ) {
      print.error('Informe uma porta válida')
      return
    }

    await template.generate({
      template: 'utils.ejs',
      target: 'src/utils.js',
      props: {
        serverIp: serverIp,
        serverPort: serverPort,
        socketPort: socketPort,
        socket: socket
      }
    })

    io.on('connection', socket => {
      print.info('Peer conectado')

      socket.on('disconnect', () => {
        print.info('Peer desconectado')
      })

      socket.on('get', function(name) {
        var stream = ss.createStream()
        var filename = `./src/uploads/${name}`
        console.log(`Arquivo ${name} enviado`)

        ss(socket).emit('res', stream, { name: filename })
        fs.createReadStream(filename).pipe(stream)
      })
    })

    server.listen(socketPort, () => {
      console.log(`Socket aberto na porta :${socketPort}`)
    })

    print.info('Overlay ativado, realizando chamadas a cada 5 segundos')
    var refresh = setInterval(async function() {
      try {
        await axios.patch(`http://${serverIp}:${serverPort}/health`, {
          port: socketPort,
          ip: socket
        })
      } catch (e) {
        print.error('Verifique os dados e execute novamente')
        clearInterval(refresh)
        server.close()
        return
      }
      print.success('Overlay 5 sec')
    }, 5000)
  }
}

module.exports = command
