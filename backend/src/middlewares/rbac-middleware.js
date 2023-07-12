/* Middleware to check and provide access to the authorized user */
export const isAdmin = (req, res, next) => {
    if(req.tokenUser.role === "admin"){
        next();
    }
    else { 
        next({status: 401, msg:"Your must be an admin to access this page"})
    }
}