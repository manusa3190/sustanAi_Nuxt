<script setup lang="ts">
definePageMeta({name:'記事詳細'})

const {articles} = useArticle()

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
    const currentUser = useState<User>('currentUser').value
    console.log(currentUser)
    if( !currentUser || !currentUser.user_id){
        alert('ユーザー名が指定されていません')
        return
    }

    isLoading.value = true

    const scoreDiff = user_score.value - (article.user_score? article.user_score:3)
    const preference_adjust = article.keywords.reduce((acc,w)=>Object.assign(acc,{[w]:scoreDiff}),{})
    const data = {
            preference_id:article.preference_id,
            user_id:currentUser.user_id,
            user_score:user_score.value,
            preference_adjust:JSON.stringify(preference_adjust)
        }
    console.log(data)
    
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
            alert('学習しました')
            hasChange.value = false
        }else{
            alert('学習に失敗しました')
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

    <div class="modal-box max-w-none">
        <div class=" navbar">
            <div class=" card-title max-w-[70%] overflow-hidden whitespace-nowrap">{{ article.title }}</div>
            <div class=" flex-1"></div>
            <button @click="navigateTo(`/articles`)" class=" btn btn-primary">Close</button>
        </div>

        <div class="p-4 border border-gray-600 max-h-[36rem] overflow-scroll">
            <pre>{{ article.content }}</pre>
        </div>

        <div class="my-3 flex">
            <label>キーワード：</label>
            <ul class=" space-x-2">
                <li class=" badge badge-primary" v-for="keyword in article.keywords">{{ keyword }}</li>
            </ul>
        </div>

        <div class="flex py-6">

            <label class="label">
                <span class=" mr-3">AI採点</span>
                <input type="text" class="!text-lg !text-inherit !bg-white !border-none" :value="article.ai_score" disabled>
            </label>

            <label class="label">
                <span class=" mr-3">あなたの採点</span>
                <select v-model="user_score" class=" select">
                    <option v-for=" s of [1,2,3,4,5]" :value="s">{{ s }}</option>
                </select>
            </label>
              
            <div class="flex-1"></div>

            <button class="btn btn-primary " @click="training" :disabled="!hasChange">
                <span v-if="!isLoading">AIに学習させる</span>
                <span v-else class="loading loading-spinner"></span>
            </button>
        </div>

    </div>

    <button class=" btn btn-circle mx-3" @click="sendPage('next')">{{ ">" }}</button>
</dialog>
</template>