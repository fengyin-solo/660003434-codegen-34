import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { COGNATE_SETS, LANGUAGE_FAMILIES, buildGraph } from '../mock/data'
import { TRAVEL_TERMS } from '../mock/travel'
export { LANGUAGE_FAMILIES, COGNATE_SETS }

export const useEtymologyStore = defineStore('etymology', () => {
  const graph = ref(buildGraph())
  const selectedNode = ref<any>(null)
  const searchQuery = ref('')
  const selectedFamily = ref('all')

  const filteredCognates = computed(() =>
    COGNATE_SETS.filter(cs => {
      const q = searchQuery.value.toLowerCase()
      const matchSearch = !q || cs.root.toLowerCase().includes(q) || cs.meaning.includes(q) || Object.values(cs.languages).some((w: string) => w.toLowerCase().includes(q))
      const matchFamily = selectedFamily.value === 'all' || cs.family === selectedFamily.value
      return matchSearch && matchFamily
    })
  )

  // —— 旅行用语专题 ——
  const activeScene = ref<string>('all')
  const travelQuery = ref('')

  const filteredTravelTerms = computed(() =>
    TRAVEL_TERMS.filter(t => {
      const matchScene = activeScene.value === 'all' || t.scene === activeScene.value
      const q = travelQuery.value.trim().toLowerCase()
      if (!q) return matchScene
      const haystack = [t.concept, t.root, t.rootMeaning, t.shiftLabel, ...Object.values(t.forms).map(f => f?.word ?? ''), ...Object.values(t.forms).map(f => f?.note ?? '')]
      return matchScene && haystack.some(s => s.toLowerCase().includes(q))
    })
  )

  return {
    graph, selectedNode, searchQuery, selectedFamily, filteredCognates,
    activeScene, travelQuery, filteredTravelTerms,
  }
})
