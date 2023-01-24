<template>
  <div class="bg-indigo-600">
    <nav class="
        container
        px-6
        py-6
        md:flex md:justify-between md:items-center
      ">
      <div class="flex" id="nav">
        <p class="
            text-xl
            font-bold
            text-gray-100
            md:text-2xl
            
          ">{{gate}} Gate
      </p>

        <!-- <h1 style="color:whitesmoke; font-weight: bold; font-size: large;">FacePlareRec</h1> -->
        <!-- Mobile menu button -->
        <div @click="toggleNav" class="flex md:hidden">
          <button type="button" class="
              text-gray-100
              hover:text-gray-400
              focus:outline-none focus:text-gray-400
            ">
            <svg viewBox="0 0 24 24" class="w-6 h-6 fill-current">
              <path fill-rule="evenodd"
                d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z">
              </path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu open: "block", Menu closed: "hidden" -->
      <ul :class="showMenu ? 'flex' : 'hidden'" class="
          flex-col
          mt-8
          space-y-4
          md:flex md:space-y-0 md:flex-row md:items-center md:space-x-10 md:mt-0
        ">
        <li class="text-gray-100 hover:text-indigo-400" @click="goToRecords">Parking Records</li>
        <!-- <li class="text-gray-100 hover:text-indigo-400">Contact Us</li>  -->
      </ul>
    </nav>
  </div>

</template>

<script setup>

const props = defineProps({
  gate : String
})


</script>

<style scoped>
#nav {
  column-gap: 20px;
  padding-left: 20px
}


#nav a.router-link-exact-active{
  color : blue;
  background : white;
  border-radius: 4px;
  padding : 4px;
  
}
</style>
