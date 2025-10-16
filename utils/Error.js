
export const ErrorMsg = (res,error)=>{
    console.log(error||"")
    res.status(400).json({msg:error
    })
}