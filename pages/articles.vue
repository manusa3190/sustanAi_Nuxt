<script setup lang="ts">
import jspreadsheet from 'jspreadsheet-ce';
import { Column, CustomEditor, JspreadsheetInstance } from 'jspreadsheet-ce';

interface Article {
  title:string
}

const articles:Ref<any[]> = ref([])

try{
  const {data} = await useFetch(`http://127.0.0.1:8000/articles`)
  articles.value = data.value as Article[]
}catch(err){

}

const columns:Column[] = [
  {title:'id',key:'id',visible:false},
  {title:'記事取得日',key:'fetch_date'},
  {title:'タイトル',key:'title',width:500},
  {title:'AI推測関心点',key:'ai_guess_interest_level',width:100},
  {title:'ユーザー評価関心点',key:'user_scored_interest_level',width:100, type:'dropdown',source:[1,2,3,4,5]},
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
  const userScoredInterestLevel_Index = columns.findIndex(column=>column['key']==='user_scored_interest_level')
  const id_Index = columns.findIndex(column=>column['key']==='id')

  const diffData = jsp.getJson().flatMap(data=>{
    const [id,編集後の点] = [data[id_Index], data[userScoredInterestLevel_Index]]
    const targetArticle = articles.value.find(article=>article.id===id)
    const もとの点 = targetArticle['user_scored_interest_level']
    if(編集後の点==='' || もとの点 === 編集後の点){
      return []
    }else{
      return [{id,user_scored_interest_level:編集後の点}]
    }
  })

  console.log('diffData : ',diffData)

  $fetch('http://127.0.0.1:8000/articles_training',{
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
    <nav class=" navbar">
      <h1>記事一覧</h1>

      <div class="flex-1"></div>

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