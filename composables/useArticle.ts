export default ()=>{
    class Article {
        article_id = 0
        title      = ""
        content    = ""
        source     = ""
        publish_date = new Date()
        ai_score = 0
        user_score=0
    
        constructor(init?: Partial<Article>){
            const isDate = (v: string | number) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(typeof(v)==='string'? v:String(v))
            for(const key in init){
                const value = init[key]
                init[key] = isDate(value)? new Date(value):value
            }
            Object.assign(this, init)
        }
    
        get data():InstanceType<typeof Article>{
            return Object.entries(this).reduce((res,[key,val])=>{
                return Object.assign(res,val!==undefined? {[key]:val}:{})
            },{} as InstanceType<typeof Article>)
        }
    }

    const articles = useState('articles',()=>[])

    return {Article, articles}
  }