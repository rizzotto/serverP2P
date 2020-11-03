const axios = require('axios')
const constants = require('../utils');
const ss = require('socket.io-stream');
const path = require('path');
const fs = require('fs');

const command = {
  name: 'specific-resource',
  description: 'retorna um recurso especifico',
  run: async toolbox => {
    
    const { print, prompt, filesystem } = toolbox
    
    if (constants.server.length==0) {
      print.error('Execute o comando run primeiro')
      return
    }

    const { id } = await prompt.ask({ type: 'input', name: 'id', message: 'Informe o ID do recurso' })

    if (
      isNaN(parseInt(id)) ||
      id < 0 ||
      id >= 100000
    ) {
      print.error('Informe uma ID válido')
      return
    }
    
    
    const call = await axios.get(`http://${constants.server}:${constants.serverPort}/resource/${id}`)
    
    const response = call.data
    
    if(response.ip) {
      print.info(`\nO recurso com id ${id} se econtra em ${response.ip}:${response.port} \n`)
      
      print.info(`Nome: ${response.file.fileName}, hash: ${response.file.fileHash} \n`)
    }else {
      print.error(`Recurso com id: ${id} não encontrado`)
      return
    }
    
    
    const io = require('socket.io-client');
    const socket = io(`http://${response.ip}:${response.port}`);    
    
    socket.emit('get', response.file.fileName);

    
    ss(socket).on('res', (stream, data) => {
      var filename =  `./src/downloads/${path.basename(data.name)}`;
      var writter = fs.createWriteStream(filename);
      stream.pipe(writter)
      
      writter.on('finish', async function() {
        socket.close();

        const file = await filesystem.inspect(filename, {checksum: 'md5'})

        if (response.file.fileHash === file.md5) print.success('Arquivo recuperado com sucesso! Hash válido')
        else print.error('Houve um problema no donwload do arquivo, hash inválido')
      })
      
    })

  }
}

module.exports = command
