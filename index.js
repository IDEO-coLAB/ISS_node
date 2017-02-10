import Nomad from 'nomad-stream'
import axios from 'axios'
import moment from 'moment'
const nomad = new Nomad()

let instance = null
nomad.prepareToPublish()
  .then((n) => {
    instance = n;
    axios.get('http://api.open-notify.org/iss-now.json?callback=?')
      .then(({ data }) => {
        data = data.substring(2, data.length - 1); // clean up string data
        return instance.publishRoot(data)
      })
      .catch((error) => {
        console.log(error)
      })
  })
  .then(() => {
    setInterval(() => {
      axios.get('http://api.open-notify.org/iss-now.json?callback=?')
        .then(({ data }) => {
          data = data.substring(2, data.length - 1); // clean up string data
          instance.publish(data)
        })
        .catch((error) => {
          console.log(error)
        })
    }, 60000)
  })
