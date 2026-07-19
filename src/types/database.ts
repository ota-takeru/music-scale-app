export interface Database {
  public: {
    Tables: {
      key: {
        Row: {
          key: string
          scale: string
          a: boolean
          a_sharp: boolean
          b: boolean
          c: boolean
          c_sharp: boolean
          d: boolean
          d_sharp: boolean
          e: boolean
          f: boolean
          f_sharp: boolean
          g: boolean
          g_sharp: boolean
        }
        Insert: {
          key: string
          scale: string
          a?: boolean
          a_sharp?: boolean
          b?: boolean
          c?: boolean
          c_sharp?: boolean
          d?: boolean
          d_sharp?: boolean
          e?: boolean
          f?: boolean
          f_sharp?: boolean
          g?: boolean
          g_sharp?: boolean
        }
        Update: {
          key?: string
          scale?: string
          a?: boolean
          a_sharp?: boolean
          b?: boolean
          c?: boolean
          c_sharp?: boolean
          d?: boolean
          d_sharp?: boolean
          e?: boolean
          f?: boolean
          f_sharp?: boolean
          g?: boolean
          g_sharp?: boolean
        }
      }
      chords: {
        Row: {
          root: string
          type: string
          a: boolean
          a_sharp: boolean
          b: boolean
          c: boolean
          c_sharp: boolean
          d: boolean
          d_sharp: boolean
          e: boolean
          f: boolean
          f_sharp: boolean
          g: boolean
          g_sharp: boolean
        }
        Insert: {
          root: string
          type: string
          a?: boolean
          a_sharp?: boolean
          b?: boolean
          c?: boolean
          c_sharp?: boolean
          d?: boolean
          d_sharp?: boolean
          e?: boolean
          f?: boolean
          f_sharp?: boolean
          g?: boolean
          g_sharp?: boolean
        }
        Update: {
          root?: string
          type?: string
          a?: boolean
          a_sharp?: boolean
          b?: boolean
          c?: boolean
          c_sharp?: boolean
          d?: boolean
          d_sharp?: boolean
          e?: boolean
          f?: boolean
          f_sharp?: boolean
          g?: boolean
          g_sharp?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
