export default ()=>{

    const parseData = (data:Object)=> {
        const isDate = (v: string | number) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(typeof(v)==='string'? v:String(v))
        const isArray = (v: string | number) => /^\[.*\]$/.test(typeof(v)==='string'? v:String(v))
        
        return Object.entries(data).reduce((item,[k,v])=>{
            var val;
            if(isDate(v)){
                val = new Date(v)
            }else if(isArray(v)){
                val = JSON.parse(v)
            }else{
                val = v
            }
            return Object.assign(item,{[k]:val})
        },{})
    }

    return {parseData}
}