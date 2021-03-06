// don't let the Hubot Command Mapper echo through the
// test results - set this before loading any tool.
process.env.HCM_VERBOSE = 'false'

const pretend = require('hubot-pretend')
const { expect } = require('chai')
const todo = require('./../scripts/todo')

require('mocha')

describe('Todo', () => {
  // initializes a new version of the
  // robot before each test (the it's)
  beforeEach(() => {
    pretend.name = 'hubot'
    pretend.alias = 'hubot'
    pretend.start()
    todo(pretend.robot)
  })

  // shut the bot down after each test
  afterEach(() => pretend.shutdown())

  it('Scenario: add, add, add, list, remove, list', done => {
    const user = pretend.user('kees')

    user
      .send('@hubot todo Boter halen')
      .then(x => user.send('@hubot todo Kaas halen'))
      .then(x => user.send('@hubot todo Eieren halen'))
      .then(x => user.send('@hubot todo'))
      .then(x => user.send('@hubot todo remove er'))
      .then(x => user.send('@hubot todo list'))
      .then(x => {
        expect(pretend.messages).to.eql(
          [
            ['kees', '@hubot todo Boter halen'],
            ['hubot', '@kees Added _Boter halen_ to the list.'],
            ['kees', '@hubot todo Kaas halen'],
            ['hubot', '@kees Added _Kaas halen_ to the list.'],
            ['kees', '@hubot todo Eieren halen'],
            ['hubot', '@kees Added _Eieren halen_ to the list.'],
            ['kees', '@hubot todo'],
            ['hubot', '@kees The following items are on the list:\n1. Boter halen\n2. Kaas halen\n3. Eieren halen'],
            ['kees', '@hubot todo remove er'],
            ['hubot', '@kees 2 items were removed.'],
            ['kees', '@hubot todo list'],
            ['hubot', '@kees The following items are on the list:\n1. Kaas halen']
          ]
        )
      })
      .then(x => done())
      .catch(ex => done(ex))
  })
})
