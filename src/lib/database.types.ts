/**
 * Tipos de la base de datos, escritos a mano para reflejar exactamente el
 * esquema de `specs/03-backend.md`. Cuando tengas las credenciales podés
 * regenerarlos con:  `supabase gen types typescript --project-id <id>`.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      areas: {
        Row: {
          id: string;
          user_id: string;
          nombre: string;
          orden: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          nombre: string;
          orden?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          nombre?: string;
          orden?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      rutina_bloques: {
        Row: {
          id: string;
          user_id: string;
          dia_semana: number;
          hora_inicio: string;
          hora_fin: string | null;
          titulo: string;
          descripcion: string | null;
          area_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          dia_semana: number;
          hora_inicio: string;
          hora_fin?: string | null;
          titulo: string;
          descripcion?: string | null;
          area_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          dia_semana?: number;
          hora_inicio?: string;
          hora_fin?: string | null;
          titulo?: string;
          descripcion?: string | null;
          area_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      habitos: {
        Row: {
          id: string;
          user_id: string;
          area_id: string;
          nombre: string;
          tipo: string;
          meta: number | null;
          unidad: string | null;
          incremento_rapido: number | null;
          frecuencia: number[];
          bloque_id: string | null;
          activo: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          area_id: string;
          nombre: string;
          tipo?: string;
          meta?: number | null;
          unidad?: string | null;
          incremento_rapido?: number | null;
          frecuencia?: number[];
          bloque_id?: string | null;
          activo?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          area_id?: string;
          nombre?: string;
          tipo?: string;
          meta?: number | null;
          unidad?: string | null;
          incremento_rapido?: number | null;
          frecuencia?: number[];
          bloque_id?: string | null;
          activo?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      registros: {
        Row: {
          id: string;
          user_id: string;
          habito_id: string;
          fecha: string;
          valor: number;
          nota: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          habito_id: string;
          fecha: string;
          valor?: number;
          nota?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          habito_id?: string;
          fecha?: string;
          valor?: number;
          nota?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      waitlist: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      perfiles: {
        Row: {
          user_id: string;
          prioridades: string[];
          frase: string | null;
          tema: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          prioridades?: string[];
          frase?: string | null;
          tema?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          prioridades?: string[];
          frase?: string | null;
          tema?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
}
