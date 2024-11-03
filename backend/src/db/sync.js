const seq = require('./seq')

require('./model/index')

seq.authenticate().then(()=>{
  console.log('auth ok')
}).catch((err)=>{
  console.log('auth err')
})

seq.sync({ force: true }).then(()=>{
  console.log('sync ok')
  process.exit()
})