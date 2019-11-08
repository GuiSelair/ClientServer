module.exports = {
    send: (error, req, res, code = 400) => {
        console.log(`Error: ${error}`);
        res.status(code).json({
            error: error
        })        
    }
}