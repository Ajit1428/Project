import app from "./app.js";

/* Unhandled Exception error*/
process.on("uncaughtException" , (err) => {
    console.log(`Unhandled exception : ${err.message}`)
    console.log(`Shutting down the server due to unhandled exception error`)

    process.exit(1)
})

/* Server */
const server = app.listen(process.env.PORT, (err) => {
    if(!err){
        console.log(`Server is listening on port ${process.env.PORT}`)
    }
    else {
        console.log(`Error listening on port ${err.message}`)
    }
})

/* Unhandled Rejection error */
process.on("unhandledRejection" , (err) => {
    console.log(`Unhandled rejection : ${err.message}`)
    console.log(`Shutting down the server due to unhandled rejection error`)

    server.close(() => {
        process.exit(1)
    })
})




