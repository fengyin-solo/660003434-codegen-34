export interface WordNode {
  id: string; word: string; language: string; meaning: string
  family: string; era?: string; x?: number; y?: number
}
export interface WordLink {
  source: string; target: string
  type: 'cognate' | 'derived' | 'borrowed' | 'reconstructed'
  description?: string
}
export interface CognateSet {
  root: string; meaning: string
  languages: Record<string, string>
  period: string; family: string
}
export interface LanguageFamily {
  id: string; name: string; color: string; languages: string[]; era: string
}

/** 语义偏移类型 */
export type ShiftType =
  | 'metaphor'   // 隐喻扩展
  | 'narrowing'  // 语义收窄
  | 'widening'   // 语义扩大
  | 'metonymy'   // 转喻/借代
  | 'calque'     // 仿译合成
  | 'borrowing'  // 跨语借用
  | 'parallel'   // 平行演化
  | 'split'      // 词根分化

export interface TravelForm {
  word: string
  /** 该形式的特殊来源说明（外来词/仿译等），缺省即由共同词根正常派生 */
  note?: string
}

/** 语义演化时间轴上的一步 */
export interface EtymStep {
  era: string
  form: string
  gloss: string
}

export interface TravelTerm {
  id: string
  scene: string         // 场景 id
  concept: string       // 概念（中文）
  root: string          // 共同词根（多源时为简述）
  rootMeaning: string   // 词根本义
  multiSource?: boolean // 是否多源/无统一词根
  shift: ShiftType
  shiftLabel: string    // 语义偏移简述
  forms: Partial<Record<string, TravelForm>>
  evolution: EtymStep[]
}
