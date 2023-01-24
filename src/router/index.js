import {createRouter, createWebHistory} from 'vue-router'
import Entry from '../views/Entry.vue'
import Exit from '../views/Exit.vue'


const routes =[
    {
        path : '/',
        name : 'Entry',
        component : Entry
    },
    {
        path : '/Exit',
        name : 'Exit',
        component : Exit
    },

]

const router = createRouter({
    history : createWebHistory(),
    routes
})

export default router