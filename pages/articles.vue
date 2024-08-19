<script setup lang="ts">
import { Grid,h } from 'gridjs';
import "gridjs/dist/theme/mermaid.css";

definePageMeta({name:'記事一覧'})

const {articles,fetchItems} = useArticle()

try{
  const {data} = await useFetch(`http://127.0.0.1:8000/articles`)
  fetchItems(data)
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

watch(articles,()=>{
  gridTable.updateConfig({data:articles.value}).forceRender()
},{deep:true})

const fetchAll =async () =>{
  const {data} = await $fetch('http://127.0.0.1:8000/articles?all=true')
  console.log(data.value)
  fetchItems(data)
}

</script>

<template>
  <div>

    <nav class=" navbar space-x-3">
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