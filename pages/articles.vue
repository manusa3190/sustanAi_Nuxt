<script setup lang="ts">
import { Grid,h } from 'gridjs';
import "gridjs/dist/theme/mermaid.css";

definePageMeta({name:'記事一覧'})

const {articles,fetchItems} = useArticle()

const currentUser = useState('currentUser').value

try{
  const {data} = await useFetch(`http://127.0.0.1:8000/articles`,{
    method:'get',
    headers: {'Content-Type': 'application/json'},
    params:{user_id:currentUser.userId,all:false}
  })
  fetchItems(data.value)
}catch(err){

}

var gridTable:Grid

onMounted(()=>{
  gridTable = new Grid({
    columns:[
      {id:'article_id',hidden:true},
      {name:'記事取得日',id:'publish_date', width:120, sort:true, formatter:(cell,row,col)=>cell?.toLocaleDateString()},
      {name:'タイトル',id:'title',width:500},
      {name:'AI推測関心点',id:'ai_score',width:100, sort:true},
      {name:'ユーザー評点',id:'user_score',width:100,sort:true},
      {name:'詳細',formatter:(cell,row,column)=>{
        return h('button', {
            className: 'btn btn-primary',
            onClick: async() => {
              const articleId = row.cells[0].data
              await navigateTo(`/articles/${articleId}`,{replace:true})
            }
          }, '詳細');
      }}
    ],
    data:articles.value,
  })

  gridTable.render(document.getElementById('my-grid'))
})

watch(articles,()=>{
  gridTable.updateConfig({data:articles.value}).forceRender()
},{deep:true})

const fetchAll =async () =>{
  const res = await $fetch(`http://127.0.0.1:8000/articles?all=true&user_id=${currentUser.userId}`)
  fetchItems(res)
}

</script>

<template>
  <div>

    <nav class=" navbar space-x-3 bg-base-200">
      <div class="flex-1"></div>
      <button class="btn btn-primary" @click="fetchAll">全文取得</button>
    </nav>

    <div id='my-grid' class="m-5"></div>

    <NuxtPage></NuxtPage>

  </div>

</template>

<style>
td {
  @apply border
}
</style>