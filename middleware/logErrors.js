import createDebug from 'debug'

const debug = createDebug('errorLog')

export default function (err, req, res, next) {
    debug(err)
    next()
}