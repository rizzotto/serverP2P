const constants = require('../utils');
const axios = require('axios')

const command = {
  name: 'post-resources',
  description: 'envia os recursos',
  run: async toolbox => {
    const { print, prompt, filesystem } = toolbox
    
    if (constants.server.length==0) {
      print.error('Execute o comando run primeiro')
      return
    }
    const input = await prompt.ask({ type: 'input', name: 'path', message: 'Informe a pasta que contem os arquivos para eviar' })


    const fileFolder = await filesystem.inspectTree(input.path, {checksum: 'md5'})

    const postObject = {
      files: [],
      ip: constants.socket,
      port: constants.socketPort
    }

    fileFolder.children.map(file => {

      postObject.files.push({
        id: Math.floor(Math.random() * 10000).toString(),
        fileName: file.name,
        fileHash: file.md5,
      })
      // read the files
      // filesystem.read(input.path + file.name)
    })
    try{
      const response = await axios.post(`http://${constants.server}:${constants.serverPort}/peer`, postObject)
      print.success('Arquivos enviados com sucesso')
    }catch(e) {
      print.error('Erro no lado do servidor')
    }
  }
}

module.exports = command
