<script setup lang="ts">
definePageMeta({name:'記事詳細'})

const {articles,updateItem} = useArticle()

const route = useRoute() 

const article = articles.value.find(a=>String(a.article_id) === route.params.id)!

const user_score = ref(article.user_score)

const hasChange = ref(false)
watch(user_score,(val)=> hasChange.value = val !== article.user_score)

const sendPage = (direction:"prev"|"next")=>{
    if(!article)return

    var nextPageIndex=0;
    const currentArticleIndex = articles.value.findIndex(a=>a.article_id == article.article_id)
    if(currentArticleIndex < 0){
        alert("エラー")
        return
    }

    if(direction==="next"){
        nextPageIndex = currentArticleIndex < articles.value.length-1 ? currentArticleIndex+1:0
    }else if(direction==="prev"){
        nextPageIndex = currentArticleIndex === 0 ? articles.value.length-1:currentArticleIndex-1
    }

    const nextArticle = articles.value[nextPageIndex]

    navigateTo(`/articles/${nextArticle.article_id}`)
}

const training=async()=>{
    isLoading.value = true

    const scoreDiff = user_score.value - (article.user_score? article.user_score:3)
    console.log(scoreDiff)
    const preference_adjust = article.keywords.reduce((acc,w)=>Object.assign(acc,{[w]:scoreDiff}),{})
    const data = {
            preference_id:article.preference_id,
            user_score:user_score.value,
            preference_adjust:JSON.stringify(preference_adjust)
        }
    
    try{
        const res = await $fetch('http://127.0.0.1:8000/training',{
            method:"POST",
            headers: {
            'Content-Type': 'application/json'
            },
            body:JSON.stringify(data)
        })
        console.log(res)

        if(res.result==='success'){
            useArticle().updateItem(res.data)
            hasChange.value = false
        }else{

        }
    }catch(err){

    }finally{
        isLoading.value = false
    }    
}

const isLoading = ref(false)

</script>

<template>
<dialog id="my_modal_1" class="modal bg-black bg-opacity-70 flex justify-around" :open="!!$route.params.id">
    <button class=" btn btn-circle mx-3" @click="sendPage('prev')">{{ "<" }}</button>

    <div v-if="isLoading" class="modal-box !w-lvw grid place-content-center place-items-center">
        <div class=" loading"></div>
    </div>

    <div v-else class="modal-box max-w-none">
        <div class=" flex justify-between">
            <div class=" card-title max-w-[70%] overflow-hidden whitespace-nowrap">{{ article.title }}</div>
            <button @click="navigateTo(`/articles`)" class=" btn btn-primary">Close</button>
        </div>

        <div class="py-4 border border-gray-400 max-h-96 overflow-scroll">
            <p>{{ article.content }}</p>
        </div>

        <div class="flex justify-between py-6">
            <div class="space-y-3">
                <dl class="flex space-x-3">
                    <dt>AI採点</dt><dd>{{ article.ai_score }}</dd>
                </dl>
                <dl class="flex space-x-3">
                    <dt>あなたの採点</dt>
                    <dd>
                        <select v-model="user_score">
                            <option v-for=" s of [1,2,3,4,5]" :value="s">{{ s }}</option>
                        </select>
                        
                    </dd>
                </dl>                
            </div>

            <button class="btn btn-primary " @click="training" :disabled="!hasChange">AIに学習させる</button>
        </div>

    </div>

    <button class=" btn btn-circle mx-3" @click="sendPage('next')">{{ ">" }}</button>
</dialog>
</template>