<script setup lang="ts">

const users:User[] = [
  { user_id:1,user_name:'ユーザー1'},
  { user_id:2,user_name:'ユーザー2'},
  { user_id:3,user_name:'ユーザー3'},
]


const currentUser = useState<User>('currentUser',()=>({user_id:1,user_name:'ユーザー1'})).value

const pages = [
  {
    title:'記事一覧',
    to:'/articles'
  },{
    title:'ユーザーコンフィグ',
    to:'/user-config'
  }
] 

</script>

<template>
    <!-- <NuxtRouteAnnouncer /> -->  

  <div class=" drawer h-screen">
    <input id="my-drawer-3" type="checkbox" class=" drawer-toggle">

    <div class=" drawer-side">
        <label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay"></label>
        <div class=" h-full">
          <ul class="menu bg-gray-300 min-h-full w-80 p-4">
            <!-- Sidebar content here -->
            <li v-for="page in pages">
              <NuxtLink :to="page.to">{{ page.title }}</NuxtLink>
            </li>
          </ul>
        </div>
    </div>

    <main class=" drawer-content">
        <nav class=" navbar bg-base-300">
          <div class="flex-none">
              <label for="my-drawer-3" aria-label="open sidebar" class="btn btn-square btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block h-6 w-6 stroke-current">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </label>
          </div>

          <div class="title">{{ $route.name }}</div>

          <div class="flex-1"></div>

          <div>
            <label>
                <span v-if="!currentUser.user_id" class=" label-text text-red-600">ユーザーを選択してください</span>
                <select v-model="currentUser.user_id" class="select select-sm">
                  <option v-for="u in users" :value="u.user_id">{{ u.user_name }}</option>
                </select>              
            </label>
          </div>
        </nav>

        <NuxtPage :key="currentUser.user_id" />
    </main>    

  </div>
</template>

<style>
.title {
  @apply font-bold text-3xl p-2
}

.jdropdown-container {
  @apply bg-base-300 !w-[50px] overflow-clip shadow-lg mx-5 absolute
}

.jdropdown-close:hover {
  @apply bg-orange-50
}

.jdropdown-item:hover {
  @apply bg-orange-50
}


select {
  @apply select select-sm
}

input[type='text'] {
  @apply input input-sm
}
</style>