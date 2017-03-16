const Nomad = require('nomad-stream')
const axios = require('axios')

const nomad = new Nomad()

const ISS_URL = 'http://api.open-notify.org/iss-now.json?callback=?'

const pollInMillis = 60 * 1000

let instance = null // node instance needed to publish the data

const getISSData = () => {
  return axios.get(ISS_URL)
}

nomad.prepareToPublish()
  .then((node) => {
    instance = node
    return getISSData()
      .then(({ data }) => {
        pubData = data.substring(2, data.length - 1)   // clean up string data
        console.log('Received from ISS_URL: ', pubData)
        return instance.publishRoot(pubData)
      })
      .catch((err) => {
        console.log('Fetch from ISS_URL failed:', err)
      })
  })
  .then(() => {
    setInterval(() => {
      getISSData()
        .then(({ data }) => {
          pubData = data.substring(2, data.length - 1)   // clean up string data
          console.log('Received from ISS_URL: ', pubData)
          return instance.publish(pubData)
        })
        .catch((err) => {
          console.log('Fetch from ISS_URL failed:', err)
        })
    }, pollInMillis)
  })
  .catch((err) => {
    console.log(err)
  })
