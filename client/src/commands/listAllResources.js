const axios = require('axios')

const command = {
  name: 'list-all-resources',
  description: 'lista todos os recursos',
  run: async toolbox => {
    const { print, prompt, filesystem } = toolbox

    try{
      const response = await axios.get('http://localhost:3333/resources')
      print.success('Recursos existentes: ')
      response.data.map(peer => {
        print.info(`O peer ${peer.ip}:${peer.port} contem os seguintes arquivos: `)
        print.info(peer.files)
      })

      // Use socket to return all files

    }catch(e) {
      print.error('Erro no lado do servidor')
    }
  }
}

module.exports = command
