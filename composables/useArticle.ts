export default ()=>{
    const isDate = (v: string | number) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(typeof(v)==='string'? v:String(v))
    
    const articles = useState<Article[]>('articles',()=>[])

    const fetchItems = (data:Ref) =>{
        const parseData = (data:Object)=> {
            const isDate = (v: string | number) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(typeof(v)==='string'? v:String(v))
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

        articles.value = data.value.map(d=>parseData(d) as Article)
    }

    const updateItem = (data:Article)=>{
        const targetItemIdx = articles.value.findIndex(a=>a.preference_id===data.preference_id)
        const targetItem = articles.value[targetItemIdx]
        for(const key in data){
            targetItem[key] = isDate(data[key])? new Date(data[key]):data[key]
        }

        articles.value.splice(targetItemIdx,1,targetItem)        
    }

    return {articles,fetchItems, updateItem}
  }