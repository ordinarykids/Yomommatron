'use strict'

exports.handle = function handle(client) {
  const sayHello = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().helloSent)
    },

    prompt() {
      client.addResponse('welcome')
      client.addResponse('provide/documentation', {
        documentation_link: 'http://docs.init.ai',
      })
      client.addResponse('provide/instructions')
      client.updateConversationState({
        helloSent: true
      })
      client.done()
    }
  })

  const untrained = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('apology/untrained')
      client.done()
    }
  })

  const handleGreeting = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('greeting')
      client.done()
    }
  })

  const handleGoodbye = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('goodbye')
      client.done()
    }
  })


  const request = require('request')

const getCity = client.createStep({
  satisfied() {
    return false
  },

  prompt(done) {
    request('https://httpbin.org/get', (err, res, body) => {
      if (err) {
        throw new Error(err)
      }

      client.setConversationState({city: 'Chicago'})
      client.done()
    })
  }
})



  client.runFlow({
    classifications: {
      goodbye: 'goodbye',
      greeting: 'greeting'
    },
    streams: {
      goodbye: getCity,
      greeting: handleGreeting,
      main: 'onboarding', 
      onboarding: [sayHello],
      end: [untrained]
    }
  })
}
