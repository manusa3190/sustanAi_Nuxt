<script setup lang="ts">
import jspreadsheet from 'jspreadsheet-ce';
import { Column, CustomEditor, JspreadsheetInstance } from 'jspreadsheet-ce';

definePageMeta({name:'記事一覧'})

// interface Article {
//   article_id:number
//   title:string
//   source:string
// }

class Article {
    article_id = 0
    title      = ""
    source     = ""

    constructor(init?: Partial<Article>){
        const isDate = (v: string | number) => !isNaN(new Date(v).getTime());
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

const articles:Ref<any[]> = ref([])

try{
  const {data} = await useFetch(`http://127.0.0.1:8000/articles?all=true`)
  articles.value = data.value as Article[]
}catch(err){

}

const columns:Column[] = [
  {title:'id',key:'article_id',visible:false},
  {title:'記事取得日',key:'publish_date'},
  {title:'タイトル',key:'title',width:500},
  {title:'AI推測関心点',key:'ai_score',width:100},
  {title:'ユーザー評点',key:'user_score',width:100, type:'dropdown',source:[1,2,3,4,5]},
]

var jsp:JspreadsheetInstance;

onMounted(()=>{
  const d = articles.value.map(article=>columns.map(col=>article[col.key]))
  console.log(d)

  jsp = jspreadsheet(document.getElementById('my-spreadsheet') as HTMLDivElement, {
      columns:Object.assign(columns,{
        filters:true,
        allowComments:true,
        rowResize: true,
        columnDrag: true,
      }),
      data:d
  });  
})

const submitAItraining = ()=>{
  // サーバーから取得した元データであるarticlesと、テーブルで編集したjspのデータを比較し、
  // ユーザーが点数をつけたデータのみサーバー側に送る
  const userScore_Index = columns.findIndex(column=>column['key']==='user_score')
  const articleId_Index = columns.findIndex(column=>column['key']==='article_id')

  const diffData = jsp.getJson().flatMap(data=>{
    const [id,編集後の点] = [data[articleId_Index], data[userScore_Index]]
    const targetArticle = articles.value.find(article=>article.id===id)
    const もとの点 = targetArticle['user_scored_interest_level']
    if(編集後の点==='' || もとの点 === 編集後の点){
      return []
    }else{
      return [{id,user_scored_interest_level:編集後の点}]
    }
  })

  console.log('diffData : ',diffData)

  $fetch('http://127.0.0.1:8000/articles_training?all=True',{
    method:'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(diffData)
  })
}

</script>

<template>
  <div>

    <nav class=" navbar space-x-3">
      <div class="flex-1"></div>
      <button class="btn btn-primary" @click="submitAItraining">全文取得</button>

      <button class="btn btn-primary" @click="submitAItraining">AI学習</button>
    </nav>

    <div id='my-spreadsheet' class="m-5"></div>
  </div>

</template>

<style>
td {
  @apply border
}
</style>