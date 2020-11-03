const constants = require('../utils');
const axios = require('axios')

const command = {
  name: 'list-all-resources',
  description: 'lista todos os recursos',
  run: async toolbox => {
    const { print } = toolbox

    if (constants.server.length==0) {
      print.error('Execute o comando run primeiro')
      return
    }

    try{
      const response = await axios.get(`http://${constants.server}:${constants.serverPort}/resources`)
      if (response.data!=0) {
        print.success('Recursos existentes: ')
        response.data.map(peer => {
          print.info(`O peer ${peer.ip}:${peer.port} contem os seguintes arquivos: `)
          print.info(peer.files)
        })
      } else {
        print.error('Nenhum recurso encontrado');
      }

    }catch(e) {
      print.error('Erro no servidor');
    }
  }
}

module.exports = command
