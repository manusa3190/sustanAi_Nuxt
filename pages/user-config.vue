<script setup lang="ts">
import jspreadsheet from 'jspreadsheet-ce'
import { Column, CustomEditor, JspreadsheetInstance } from 'jspreadsheet-ce';

definePageMeta({
    name:'ユーザーコンフィグ'
})

const currentUser = useState<User>('currentUser').value

if(!currentUser.user_id){
    alert('ユーザーを設定してください')
}

const {data} = await useFetch('http://127.0.0.1:8000/user',{
    method:'GET',
    headers: {'Content-Type': 'application/json'},
    params:{user_id:currentUser.user_id}
})

const preference = ref<Object>(
    data.value? JSON.parse(data.value.preference):{}
)

var jsp:JspreadsheetInstance;

const columns:Column[] = [{title:'キーワード',width:300},{title:'関心度',type:'numeric'}]

onMounted(()=>{
    jsp = jspreadsheet(document.getElementById('user-preference-sheet') as HTMLDivElement, {
        columns:Object.assign(columns,{
            filters:true,
            allowComments:true,
            rowResize: true,
            columnDrag: true,
        }),
        data:Object.entries(preference.value)
    });  
})

const postUserConfig= async()=>{


    const rows = jsp.getData()
    const preference = rows.reduce((item,[key,value])=>Object.assign(item,{[key]:Number(value)}),{})
    const data = {
        user_id:currentUser.user_id,
        preference:preference
    }
    console.log(data)
    await $fetch('http://127.0.0.1:8000/user_post',{
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body:JSON.stringify(data)
    })
}

</script>

<template>

    <div class="p-4">
        <button class=" btn btn-primary" @click="postUserConfig">反映</button>
        <div id="user-preference-sheet"></div>
    </div>

</template>