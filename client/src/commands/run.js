const axios = require('axios')
var exec = require('child_process').exec;


const command = {
  name: 'run',
  description: 'inicia funções client',
  run: async toolbox => {
      const { print } = toolbox

      // colocar socket aqui iniciar

      print.info('Overlay ativado, realizando chamadas a cada 5 segundos')
      setInterval(function() {
        print.success('chamou')
        axios.patch('http://localhost:3333/health')  
      }, 5000);
  }
}

module.exports = command
