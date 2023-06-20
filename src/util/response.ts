class ResponseData{
    error_code:string
    error:boolean
    success:boolean
    data:any

    constructor(){
        this.error_code = "0"
        this.success = true
        this.error = false
    }

    setErrorCode(errorCode:string) {
        this.error_code = errorCode
        return this
    }

    setData(data:any){
        this.data = data
        return this
    }
}

export default ResponseData