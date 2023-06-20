export function getOffset(limit:number, page:number):number{
    if(page == 0)
        page = 1
    let offset = (page - 1) * limit;
    return offset
}