/* Error handling middleware */
export const errorHandling = (error, req, res, next) => {
    let status = error.status || 500
    let msg = error.msg || JSON.stringify(error)

    res.status(status).json({
        result : error,
        msg : msg,
        status : false,
        meta: null
    })
}

