// pages/test-supabase.tsx
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface TestResult {
  connected: boolean
  error: string | null
  tablesCount: number
}

export default function TestSupabase() {
  const [result, setResult] = useState<TestResult>({
    connected: false,
    error: null,
    tablesCount: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const testConnection = async () => {
      try {
        setLoading(true)
        
        // Teste simples de conexão
        const { error, count } = await supabase
          .from('rsvp')
          .select('*', { count: 'exact', head: true })

        if (error) throw error
        
        setResult({
          connected: true,
          error: null,
          tablesCount: count || 0
        })
        
        console.log('✅ Supabase conectado com sucesso!')
        console.log('📊 Total de RSVPs:', count)
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
        
        setResult({
          connected: false,
          error: errorMessage,
          tablesCount: 0
        })
        
        console.error('❌ Erro ao conectar:', error)
      } finally {
        setLoading(false)
      }
    }

    testConnection()
  }, [])

  const testInsert = async () => {
    try {
      const { error } = await supabase
        .from('rsvp')
        .insert({
          name: 'Teste',
          email: `teste${Date.now()}@example.com`,
          guests_count: 0,
          confirmed: true
        })

      if (error) throw error
      
      alert('✅ Teste de inserção bem-sucedido!')
      
      // Atualizar contagem
      const { count } = await supabase
        .from('rsvp')
        .select('*', { count: 'exact', head: true })
      
      setResult(prev => ({ ...prev, tablesCount: count || 0 }))
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      alert(`❌ Erro no teste: ${errorMessage}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🔧 Teste Supabase</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Status da Conexão</h2>
          
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <p className="text-blue-600">🔄 Testando conexão...</p>
            </div>
          ) : result.connected ? (
            <div className="space-y-2">
              <p className="text-green-600 font-medium">✅ Conectado com sucesso!</p>
              <p className="text-gray-600">📊 Total de RSVPs: {result.tablesCount}</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-red-600 font-medium">❌ Erro na conexão</p>
              <p className="text-red-500 text-sm bg-red-50 p-3 rounded">
                {result.error}
              </p>
            </div>
          )}
        </div>

        {result.connected && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Testes Funcionais</h2>
            
            <div className="space-y-4">
              <button
                onClick={testInsert}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                🧪 Testar Inserção de RSVP
              </button>
              
              <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">ℹ️ Informações:</h3>
                <ul className="space-y-1">
                  <li>• Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30)}...</li>
                  <li>• Anon Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...</li>
                  <li>• Tabelas necessárias: rsvp, gallery, shared_files</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🛠️ Comandos SQL</h2>
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Se as tabelas não existirem, execute no SQL Editor do Supabase:</strong></p>
            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`-- Criar tabela RSVP
CREATE TABLE rsvp (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  guests_count INTEGER DEFAULT 0,
  guest_names TEXT[],
  dietary_restrictions TEXT,
  message TEXT,
  confirmed BOOLEAN DEFAULT false
);

-- Habilitar RLS e criar políticas
ALTER TABLE rsvp ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON rsvp FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select" ON rsvp FOR SELECT USING (true);`}
            </pre>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-block bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Voltar ao Site
          </Link>
        </div>
      </div>
    </div>
  )
}