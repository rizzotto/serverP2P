const command = {
  name: 'secret',
  description: 'comando secreto',
  run: async toolbox => {
    const { print, filesystem, prompt } = toolbox
    await prompt.ask({ type: 'input', name: 'ask', message: 'Abra em um terminal fullscreen e rode este comando novamente, digite OK' })
    print.info(filesystem.read('src/asc.txt'))
  }
}

module.exports = command
