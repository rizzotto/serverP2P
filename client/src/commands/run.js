const axios = require('axios')
const fs = require('fs')
var exec = require('child_process').exec
const server = require('http').createServer()
var io = require('socket.io')(server)
const ss = require('socket.io-stream');

const command = {
  name: 'run',
  description: 'inicia funções client',
  run: async toolbox => {
    const { print, prompt, template } = toolbox

    // const { serverIp } = await prompt.ask({ type: 'input', name: 'serverIp', message: 'Informe o IP do server' })

    // const { serverPort } = await prompt.ask({ type: 'input', name: 'serverPort', message: 'Informe a porta do server' })

    // const { socket } = await prompt.ask({ type: 'input', name: 'socket', message: 'Informe a qual o ip da máquina cliente' })
    
    // const { socketPort } = await prompt.ask({ type: 'input', name: 'socketPort', message: 'Informe a qual a porta da máquina cliente' })

    const  serverIp  = '192.168.0.115'

    const  serverPort = 3333

    const  socket  = '192.168.0.116'
    
    const  socketPort  = 3000

    
    await template.generate({
      template: 'utils.ejs',
      target: 'utils.js',
      props: {
        serverIp: serverIp,
        serverPort: serverPort,
        socketPort: socketPort,
        socket: socket
        
      }
    })
 

    io.on('connection', socket => {
      print.info('User Connected')

      socket.on('disconnect', () => {
        print.info('User Disconnected')
      })

      socket.on('get', function(name) {
        var stream = ss.createStream();
        var filename = `./src/uploads/${name}`;
        console.log(filename)


        ss(socket).emit('res', stream, {name: filename});
        fs.createReadStream(filename).pipe(stream);
 
      });


    })

    server.listen(socketPort, () => {
      console.log(`listening on :${socketPort}`)
    })

    // print.info('Overlay ativado, realizando chamadas a cada 5 segundos')
    // setInterval(function() {
    //   print.success('chamou')
    //   axios.patch(`http://${serverIp}:${serverPort}/health`, {
    //     port: socketPort,
    //     ip: socket
    //   })
    // }, 5000)
  }
}

module.exports = command
