<script setup lang="ts">
import { Grid,h } from 'gridjs';
import "gridjs/dist/theme/mermaid.css";

definePageMeta({name:'記事一覧'})

const {parseData} = useData()

const currentUser = useState<User>('currentUser').value

const articles = useState<Article[]>('articles',()=>[])

const query = ref({
  user_id:currentUser.user_id,
  source:{環境省:true,envix:true,サステナブルジャパン:false},
  acquition_duration:1,
  ai_score:3,
  user_score:3,
  word:""
})

const fetchArticles =async () =>{
   const q = {...query.value}
   q.source = Object.entries(query.value.source).flatMap(([k,v])=>v? [k]:[])
   q.source = JSON.stringify(q.source)

  const data = await $fetch(`http://127.0.0.1:8000/articles`,{
    method:'GET',
    headers: {'Content-Type': 'application/json'},
    query:q
  })

  articles.value = data.map(d=>parseData(d))
}


var gridTable:Grid

onMounted(async()=>{
  await fetchArticles()

  gridTable = new Grid({
    columns:[
      {id:'article_id',hidden:true},
      {name:'記事取得日',id:'publish_date', width:120, sort:true, formatter:(cell,row,col)=>cell?.toLocaleDateString()},
      {name:'ソース',id:'source',width:100},
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
  if(!gridTable)return
  gridTable.updateConfig({data:articles.value}).forceRender()
},{deep:true})

</script>

<template>
  <div>

    <fieldset class=" bg-base-200">
      <label class="label justify-start w-full">
        <span class=" label-text whitespace-nowrap mr-3">記事ソース</span>
        <div class="input input-sm space-x-2 min-w-24 dropdown">
          <span v-for="val, sourceName in query.source" class=" badge badge-primary gap-2" :class="val? 'visible':'hidden'">
              {{ sourceName }}
              <svg @click="query.source[sourceName]=false"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block h-4 w-4 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
          </span>

          <span tabindex="0" role="button" :class="Object.values(query.source).some(e=>!e)? 'visible':'hidden'">↓</span>

          <ul tabindex="0" class="dropdown-content menu bg-base-100 z-[1] w-fit p-2 shadow">
            <li v-for="val, sourceName in query.source" :class="val? 'hidden':'visible'">
              <a class=" whitespace-nowrap" @click="query.source[sourceName]=true">{{ sourceName }}</a>
            </li>
          </ul>

        </div>
      </label>

      <div class="flex space-x-6">
        <label class="label flex justify-end">
          <input type="text" v-model="query.word">
          <span class="absolute mr-3">検索</span>
        </label>

        <label class="label flex justify-end">
          <span class=" label-text mr-4">記事取得期間</span>
          <select v-model="query.acquition_duration">
            <option v-for="d in [1,2,3]" :value="d">{{ d + 'ヶ月' }}</option>
          </select>
        </label>

        <label class="label">
          <span class="label label-text">AI採点</span>
          <select v-model="query.ai_score">
            <option v-for="d in [1,2,3,4,5]" :value="d">{{ d + '点' }}</option>
          </select>
        </label>

        <label class="label">
          <span class="label label-text">ユーザー採点</span>
          <select v-model="query.user_score">
            <option v-for="d in [0,1,2,3,4,5]" :value="d">{{ d? d+'点':'未採点' }}</option>
          </select>
        </label>

        <div class="flex-1"></div>
        <button class="btn btn-primary" @click="fetchArticles">取得</button>        
      </div>

    </fieldset>

    <div id='my-grid' class="m-5"></div>

    <NuxtPage></NuxtPage>

  </div>

</template>

<style>
td {
  @apply border
}
</style>