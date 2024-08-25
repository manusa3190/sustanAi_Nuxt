<script setup lang="ts">
const currentUser = useState('currentUser',()=>({
  userId:1,
  userName:"ユーザー1"
}))

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
              <input type="text" class=" input" v-model="currentUser.userName" placeholder="ユーザー名">
          </div>
        </nav>

        <NuxtPage />
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
</style>