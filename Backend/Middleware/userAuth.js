import jwt from 'jsonwebtoken';

export const userAuth = async(req, res, next) => {
    const {token} = req.cookies

    if(!token){
        res.status(403).json({
            message: "Not authorized, Please Login",
            success: false,
        })
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)

        if(tokenDecode.id){
            req.body.userId = tokenDecode.id
        }
        else{
            res.status(403).json({
                message : "Please Login",
                success: false,
            })
        }

        next()
    } catch (error) {
        res.status(500).json({
            message : "Internal Server Error",
            success: false
        })
    }

}
