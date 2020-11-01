const axios = require('axios')

const command = {
  name: 'specific-resource',
  description: 'retorna um recurso especifico',
  run: async toolbox => {
    const { print, prompt, filesystem } = toolbox

    const { id } = await prompt.ask({ type: 'input', name: 'id', message: 'Informe o ID do recurso' })

    
        const call = await axios.get(`http://localhost:3333/resource/${id}`)
  
        const response = call.data
        
        if(response.ip) {
          print.info(`\n O recurso com id ${id} se econtra no peer ${response.ip}:${response.port} \n`)
          
          print.info(`Nome: ${response.file.fileName}, hash: ${response.file.fileHash} \n`)
        }else {
          print.error(`Recurso com id: ${id} não encontrado`)
        }

      // Use socket to get file from another peer

  }
}

module.exports = command
