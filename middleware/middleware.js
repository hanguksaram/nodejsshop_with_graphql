exports.attachUserToRequestContext = (user) => {
    return (req, res, next ) => {
        user.findByPk(1).then((user) => {
          req.user = user
          next()
        }).catch(err => console.log(err))
      }
} 