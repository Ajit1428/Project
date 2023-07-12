import bcrypt from "bcrypt"
/* Encypting the password */
export const encryptPass = async(password) => {
    try {
        let encodePass = await bcrypt.hashSync(password, 10)
        return encodePass
    } catch (error) {
        throw error
    }
}

/*Decrypting the password */
export const decryptPass = async(password, dataPass) => {
    try {
        let decodePass = await bcrypt.compareSync(password, dataPass)
        return decodePass
    } catch (error) {
        throw error
    }
}