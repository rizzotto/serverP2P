const axios = require('axios')
const { constants } = require('buffer')
var exec = require('child_process').exec
const server = require('http').createServer()
var io = require('socket.io')(server)

const command = {
  name: 'run',
  description: 'inicia funções client',
  run: async toolbox => {
    const { print, prompt, template } = toolbox

    const { serverIp } = await prompt.ask({ type: 'input', name: 'serverIp', message: 'Informe o IP do server' })

    const { serverPort } = await prompt.ask({ type: 'input', name: 'serverPort', message: 'Informe a porta do server' })

    const { socketPort } = await prompt.ask({ type: 'input', name: 'socketPort', message: 'Informe a porta que deseja executar o seu socket' })

    
    await template.generate({
      template: 'utils.ejs',
      target: 'utils.js',
      props: {
        serverIp: serverIp,
        serverPort: serverPort,
        socketPort: socketPort
        
      }
    })
 

    io.on('connection', socket => {
      print.info('User Connected')

      socket.on('disconnect', () => {
        print.info('User Disconnected')
      })

      socket.on('get', (msg) => {
        console.log(msg + ' required')
        io.emit('get', `${msg} recovered`);
      });
    })

    server.listen(socketPort, () => {
      console.log(`listening on :${socketPort}`)
    })

    print.info('Overlay ativado, realizando chamadas a cada 5 segundos')
    setInterval(function() {
      print.success('chamou')
      axios.patch(`http://${server}:${serverPort}/health`, {
        port: socketPort
      })
    }, 5000)
  }
}

module.exports = command
