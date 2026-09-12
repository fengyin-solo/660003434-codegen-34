<template>
  <div class="min-h-screen bg-slate-900 text-slate-200">
    <header class="border-b border-slate-700 px-6 py-4">
      <h1 class="text-2xl font-bold text-cyan-400">语言词源图谱与多语系演化追踪</h1>
      <p class="text-sm text-slate-500 mt-1">D3.js力导向图 · 印欧语系演化 · 同源词对照 · 500+词根 · 🧳 旅行用语专题</p>
    </header>
    <div class="p-4 space-y-4">
      <div class="grid lg:grid-cols-3 gap-4">
        <div class="lg:col-span-2 bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-bold text-slate-400">词源力导向网络</h3>
            <div class="flex gap-3 text-xs">
              <span v-for="f in LANGUAGE_FAMILIES" :key="f.id" class="flex items-center gap-1">
                <span class="w-3 h-3 rounded-full" :style="{backgroundColor: f.color}"></span>{{ f.name }}
              </span>
            </div>
          </div>
          <svg ref="svgRef" class="w-full bg-slate-900 rounded" style="height:460px"></svg>
        </div>
        <div class="space-y-4">
          <div class="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h3 class="text-sm font-bold text-slate-400 mb-3">语系概览</h3>
            <div class="space-y-2">
              <div v-for="f in LANGUAGE_FAMILIES" :key="f.id" class="flex items-start gap-2 text-sm">
                <span class="w-3 h-3 rounded-full mt-0.5 flex-shrink-0" :style="{backgroundColor: f.color}"></span>
                <div><div class="font-bold">{{ f.name }}</div><div class="text-xs text-slate-500">{{ f.era }} · {{ f.languages.join('/') }}</div></div>
              </div>
            </div>
          </div>
          <div v-if="store.selectedNode" class="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h3 class="text-sm font-bold text-slate-400 mb-2">选中节点</h3>
            <div class="text-lg font-bold text-cyan-400">{{ store.selectedNode.word }}</div>
            <div class="text-sm text-slate-400">{{ store.selectedNode.language }} — {{ store.selectedNode.meaning }}</div>
          </div>
          <div class="bg-slate-800 rounded-lg p-4 border border-slate-700 text-xs text-slate-400">
            <h3 class="text-sm font-bold text-slate-400 mb-2">Grimm定律</h3>
            <div class="space-y-1">
              <div class="bg-slate-900 rounded p-2"><span class="text-cyan-400">p→f: </span>pater → father</div>
              <div class="bg-slate-900 rounded p-2"><span class="text-green-400">t→θ: </span>tres → three</div>
              <div class="bg-slate-900 rounded p-2"><span class="text-orange-400">k→h: </span>cord → heart</div>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-slate-800 rounded-lg p-4 border border-cyan-900">
        <div class="flex items-center justify-between mb-1">
          <h2 class="text-base font-bold text-cyan-300">🧳 旅行用语专题 · 跨语高频场景词</h2>
          <span class="text-xs text-slate-500">聚合 9 种语言 · {{ store.filteredTravelTerms.length }} 个场景词</span>
        </div>
        <p class="text-xs text-slate-500 mb-3">按旅行场景聚合高频词，追溯共同词根，并标注语义偏移（隐喻 / 收窄 / 仿译 / 借用 / 词根分化）。</p>

        <div class="flex flex-wrap items-center gap-2 mb-3">
          <button @click="store.activeScene = 'all'"
            :class="store.activeScene === 'all' ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'"
            class="px-3 py-1 rounded-full text-xs transition-colors">全部</button>
          <button v-for="s in TRAVEL_SCENES" :key="s.id" @click="store.activeScene = s.id"
            :class="store.activeScene === s.id ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'"
            class="px-3 py-1 rounded-full text-xs transition-colors">{{ s.icon }} {{ s.name }}</button>
          <input v-model="store.travelQuery" placeholder="搜索概念 / 词根 / 任意语言词形…"
            class="flex-1 min-w-[220px] bg-slate-900 border border-slate-600 rounded px-3 py-1 text-xs focus:outline-none focus:border-cyan-500" />
        </div>

        <div v-if="store.filteredTravelTerms.length" class="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          <div v-for="t in store.filteredTravelTerms" :key="t.id"
            class="bg-slate-900 rounded-lg border border-slate-700 hover:border-cyan-700 transition-colors p-3 flex flex-col">
            <div class="flex items-start justify-between gap-2 mb-2">
              <div>
                <div class="text-sm font-bold text-slate-100">{{ t.concept }}</div>
                <div class="text-[11px] text-slate-500">{{ sceneName(t.scene) }}</div>
              </div>
              <span class="text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap font-bold"
                :style="{ color: SHIFT_META[t.shift].color, backgroundColor: SHIFT_META[t.shift].color + '22', border: '1px solid ' + SHIFT_META[t.shift].color + '55' }">
                {{ SHIFT_META[t.shift].label }}
              </span>
            </div>

            <div class="rounded bg-slate-800/70 px-2 py-1.5 mb-2">
              <div class="flex items-baseline gap-2 flex-wrap">
                <span class="font-mono text-xs" :class="t.multiSource ? 'text-red-300' : 'text-cyan-300'">{{ t.root }}</span>
                <span v-if="t.multiSource" class="text-[10px] text-red-400">多源</span>
              </div>
              <div class="text-[10px] text-slate-500 mt-0.5">本义：{{ t.rootMeaning }}</div>
            </div>

            <div class="grid grid-cols-2 gap-x-2 gap-y-1 mb-2">
              <div v-for="l in TRAVEL_LANGS" :key="l.lang" v-show="t.forms[l.lang]" class="flex items-baseline gap-1.5 min-w-0">
                <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" :style="{ backgroundColor: l.color }"></span>
                <span class="text-[10px] text-slate-500 w-14 flex-shrink-0">{{ l.lang }}</span>
                <span class="font-mono text-[11px] truncate" :style="{ color: l.color }" :title="t.forms[l.lang]?.note">{{ t.forms[l.lang]?.word }}</span>
              </div>
            </div>

            <div class="text-[11px] text-slate-400 mb-2 flex gap-1">
              <span class="text-slate-600 flex-shrink-0">偏移 →</span><span>{{ t.shiftLabel }}</span>
            </div>

            <div class="mt-auto pt-2 border-t border-slate-800 flex items-center flex-wrap gap-x-1 gap-y-1">
              <template v-for="(step, i) in t.evolution" :key="i">
                <div class="flex flex-col" :title="step.gloss">
                  <span class="text-[9px] text-slate-600 leading-tight">{{ step.era }}</span>
                  <span class="font-mono text-[10px] text-slate-400 leading-tight">{{ step.form }}</span>
                </div>
                <span v-if="i < t.evolution.length - 1" class="text-cyan-700 text-[10px] pb-2">→</span>
              </template>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-xs text-slate-500 py-8">未找到匹配的旅行用语</div>
      </div>

      <div class="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <h3 class="text-sm font-bold text-slate-400 mb-3">同源词对照表</h3>
        <div class="flex gap-2 mb-3">
          <input v-model="store.searchQuery" placeholder="搜索词根/含义..." class="flex-1 bg-slate-900 border border-slate-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-cyan-500" />
          <select v-model="store.selectedFamily" class="bg-slate-900 border border-slate-600 rounded px-2 text-sm text-slate-300">
            <option value="all">全部语系</option>
            <option v-for="f in LANGUAGE_FAMILIES" :key="f.id" :value="f.id">{{ f.name }}</option>
          </select>
        </div>
        <div class="overflow-x-auto max-h-64 overflow-y-auto">
          <table class="w-full text-xs">
            <thead class="sticky top-0 bg-slate-700">
              <tr>
                <th class="px-2 py-2 text-left text-slate-300">词根</th>
                <th class="px-2 py-2 text-left text-slate-300">含义</th>
                <th class="px-2 py-2 text-left text-cyan-400">英语</th>
                <th class="px-2 py-2 text-left text-blue-400">法语</th>
                <th class="px-2 py-2 text-left text-green-400">德语</th>
                <th class="px-2 py-2 text-left text-orange-400">西班牙语</th>
                <th class="px-2 py-2 text-left text-purple-400">俄语</th>
                <th class="px-2 py-2 text-left text-yellow-400">拉丁语</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cs in store.filteredCognates" :key="cs.root" class="border-t border-slate-700 hover:bg-slate-700">
                <td class="px-2 py-1.5 font-mono text-slate-200 font-bold">{{ cs.root }}</td>
                <td class="px-2 py-1.5 text-slate-400">{{ cs.meaning }}</td>
                <td class="px-2 py-1.5 font-mono text-cyan-300">{{ cs.languages['英语'] || '—' }}</td>
                <td class="px-2 py-1.5 font-mono text-blue-300">{{ cs.languages['法语'] || '—' }}</td>
                <td class="px-2 py-1.5 font-mono text-green-300">{{ cs.languages['德语'] || '—' }}</td>
                <td class="px-2 py-1.5 font-mono text-orange-300">{{ cs.languages['西班牙语'] || '—' }}</td>
                <td class="px-2 py-1.5 font-mono text-purple-300">{{ cs.languages['俄语'] || '—' }}</td>
                <td class="px-2 py-1.5 font-mono text-yellow-300">{{ cs.languages['拉丁语'] || '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as d3 from 'd3'
import { useEtymologyStore, LANGUAGE_FAMILIES } from './store/etymology'
import { TRAVEL_SCENES, TRAVEL_LANGS, SHIFT_META } from './mock/travel'

const store = useEtymologyStore()
const svgRef = ref<SVGSVGElement | null>(null)
const COLORS: Record<string, string> = { ie: '#3b82f6', st: '#22c55e', aa: '#f59e0b', ural: '#8b5cf6' }

function sceneName(id: string) {
  const s = TRAVEL_SCENES.find(s => s.id === id)
  return s ? `${s.icon} ${s.name}` : id
}

function drawGraph() {
  if (!svgRef.value) return
  const svg = d3.select(svgRef.value)
  svg.selectAll('*').remove()
  const W = svgRef.value.getBoundingClientRect().width || 700, H = 460
  const nodes = store.graph.nodes.map((n: any) => ({ ...n }))
  const links = store.graph.links.map((l: any) => ({ ...l }))
  const sim = d3.forceSimulation(nodes as any)
    .force('link', d3.forceLink(links as any).id((d: any) => d.id).distance(55))
    .force('charge', d3.forceManyBody().strength(-100))
    .force('center', d3.forceCenter(W / 2, H / 2))
    .force('collision', d3.forceCollide(22))
  const g = svg.append('g')
  svg.call(d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.2, 3]).on('zoom', (e) => g.attr('transform', e.transform)) as any)
  const link = g.append('g').selectAll('line').data(links).join('line')
    .attr('stroke', '#475569').attr('stroke-width', 1).attr('opacity', 0.5)
  const node = g.append('g').selectAll('g').data(nodes).join('g')
    .call(d3.drag<any, any>()
      .on('start', (e, d: any) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y })
      .on('drag', (e, d: any) => { d.fx = e.x; d.fy = e.y })
      .on('end', (e, d: any) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null }))
    .on('click', (_: any, d: any) => { store.selectedNode = d })
  node.append('circle')
    .attr('r', (d: any) => d.language === 'Proto-IE' ? 12 : 7)
    .attr('fill', (d: any) => COLORS[d.family] || '#64748b')
    .attr('stroke', '#1e293b').attr('stroke-width', 1.5)
  node.append('text').attr('dy', -14).attr('text-anchor', 'middle').attr('font-size', 9).attr('fill', '#e2e8f0')
    .text((d: any) => d.word.length > 8 ? d.word.slice(0, 8) + '…' : d.word)
  node.append('title').text((d: any) => `${d.word} (${d.language}): ${d.meaning}`)
  sim.on('tick', () => {
    link.attr('x1', (d: any) => d.source.x).attr('y1', (d: any) => d.source.y)
      .attr('x2', (d: any) => d.target.x).attr('y2', (d: any) => d.target.y)
    node.attr('transform', (d: any) => `translate(${d.x},${d.y})`)
  })
}

onMounted(() => { setTimeout(drawGraph, 100) })
</script>
