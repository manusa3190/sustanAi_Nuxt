type Article = {
    article_id :number
    title      :string
    content    :string
    keywords   :string[]
    source     :string
    publish_date:Date
    preference_id:number
    ai_score   :number
    user_score :number
}

type User = {
    user_id : number | string
    user_name:string
}

type P = {
    user_id : number|string
    preference:string
    created_at:string
    updated_at:string
}