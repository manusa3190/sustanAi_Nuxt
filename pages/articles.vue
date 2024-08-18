<script setup lang="ts">
import { Grid,h } from 'gridjs';
import "gridjs/dist/theme/mermaid.css";

definePageMeta({name:'記事一覧'})

const {Article} = useArticle()

const articles = ref<typeof Article[]>([])

try{
  const {data} = await useFetch(`http://127.0.0.1:8000/articles`)
  articles.value = data.value.map(d=>new Article(d))
}catch(err){

}



var gridTable:Grid

onMounted(()=>{
  gridTable = new Grid({
    columns:[
      {id:'article_id', visible:false},
      {name:'記事取得日',id:'publish_date', width:120, formatter:(cell,row,col)=>cell?.toLocaleDateString()},
      {name:'タイトル',id:'title',width:500},
      {name:'AI推測関心点',id:'ai_score',width:100},
      {name:'ユーザー評点',id:'user_score',width:100, type:'dropdown',source:[1,2,3,4,5]},
      {name:'詳細',formatter:(cell,row,column)=>{
        return h('button', {
            className: 'py-2 mb-4 px-4 border rounded-md text-white bg-blue-600',
            onClick: async() => {
              const articleId = row.cells[0].data
              const res = await navigateTo(`/articles/${articleId}`,{replace:true})
              // my_modal_1.showModal()
            }
          }, '詳細');
      }}
    ],
    data:articles.value,
  })

  gridTable.render(document.getElementById('my-grid'))
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

    <nav class=" navbar space-x-3">
      <div class="flex-1"></div>
      <button class="btn btn-primary" @click="submitAItraining">全文取得</button>
    </nav>

    <div id='my-grid' class="m-5"></div>

    <NuxtPage :articles="articles"></NuxtPage>

  </div>

</template>

<style>
td {
  @apply border
}
</style>