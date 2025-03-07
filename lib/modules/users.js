const _ = require('lodash')
const Factory = require('../factory')

//
// Initialize the child logger for
// the module
//
const log = require('../log').child({
  module: 'users'
})

module.exports = function(context) {
  //
  // Format and write each user to the
  // target csv file
  //
  _.forEach(context.source.users, function(user) {

    //
    // Build the channels
    // array
    //
    var channels = [ {
      name: 'town-square'
    } ]

    if (user.channels) {
      _.forEach(user.channels.split(','), function(channel) {
        channels.push({
          name: channel.trim()
        })
      })
    }

    //
    // Write out each user record
    //
    try {
      context.target.write(
        Factory.user({
          first_name: user.firstname,
          last_name: user.lastname,
          username: user.username,
          email: user.email,
          password: user.password,
          position: user.position,
          nickname: user.nickname,
          // auth_service: user.authservice,
          // auth_data: user.authdata,
          // notify_props: {
          //   email: 'true',
          //   desktop: 'mention',
          //   mobile: 'mention'
          // },
          teams: [ {
            name: user.team,
            channels: channels
          } ]
        })
      )
      log.info(`... writing ${user.username}`)
    }
    catch(err) {
      log.error(`... ignoring ${user.username} on error: ${err.message}.`)
    }
  })

  //
  // Return the context
  //
  return Promise.resolve(context)
}
