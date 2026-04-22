import { app } from './app.js'

app.listen(
  {
    port: 4444,
    host: '0.0.0.0',
  },
  () => {
    console.log('Server is running on port 4444')
  },
)
