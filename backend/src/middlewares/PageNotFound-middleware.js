/* Page not found */
export const pageNotFound = (req, res, next) => {
    next({status:404, msg: "Page not found"})
}
