const axios = require('axios')

console.log('Overlay ativado, realizando chamadas a cada 5 segundos')
setInterval(function() {
  console.log('chamou')
  axios.patch('http://localhost:3333/health')  
}, 5000);