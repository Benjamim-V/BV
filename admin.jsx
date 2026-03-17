import { useEffect, useState } from "react"
import { supabase } from "../services/supabase"
import jsPDF from "jspdf"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

export default function Admin() {
  const [dados, setDados] = useState([])

  useEffect(() => {
    carregar()

    const subscription = supabase
      .channel('presencas_admin')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'presencas' }, () => {
        carregar()
      })
      .subscribe()

    return () => supabase.removeChannel(subscription)
  }, [])

  async function carregar() {
    // Busca presenças e faz join com o nome da disciplina (se existir relação) ou mostra o ID da aula
    const { data } = await supabase
      .from("presencas")
      .select("*") 
      .order("data", { ascending: false })

    setDados(data || [])
  }

  // Detecção de Fraude: Se as últimas 3 presenças ocorreram num intervalo de 60s
  const detectarFraude = () => {
    if (dados.length < 3) return false
    const tempos = dados.slice(0, 3).map(r => new Date(r.data).getTime())
    return (tempos[0] - tempos[2]) < 60000 
  }

  // Agrupar dados para o Gráfico por Aula
  const chartData = Object.values(dados.reduce((acc, d) => {
    acc[d.aula_id] = acc[d.aula_id] || { aula: d.aula_id.substring(0,8), total: 0 }
    acc[d.aula_id].total += 1
    return acc
  }, {}))

  function gerarPDF() {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text("Relatório Geral de Presenças", 10, 20)
    doc.setFontSize(12)
    
    dados.forEach((d, i) => {
      doc.text(`${i + 1}. Aula: ${d.aula_id} | Aluno: ${d.aluno_id} | Status: ${d.status}`, 10, 40 + i * 10)
    })
    doc.save("relatorio-admin.pdf")
  }

  return (
    <div style={styles.container}>
      <h2>Dashboard Administrativo</h2>

      {detectarFraude() && (
        <div style={styles.alerta}>⚠️ ALERTA: Registos suspeitos em massa detectados!</div>
      )}

      <div style={styles.statsRow}>
        <button style={styles.btn} onClick={gerarPDF}>Exportar PDF</button>
        <button style={{...styles.btn, background: "#666"}} onClick={carregar}>Atualizar</button>
      </div>

      <div style={{ width: '100%', height: 300, margin: "20px 0" }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <XAxis dataKey="aula" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={styles.table}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th>Data/Hora</th>
              <th>Aluno ID</th>
              <th>Aula ID</th>
              <th>Coordenadas</th>
            </tr>
          </thead>
          <tbody>
            {dados.map(d => (
              <tr key={d.id} style={styles.tr}>
                <td>{new Date(d.data).toLocaleString()}</td>
                <td>{d.aluno_id.substring(0,8)}...</td>
                <td>{d.aula_id.substring(0,8)}...</td>
                <td>{d.latitude?.toFixed(4)}, {d.longitude?.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const styles = {
  container: { padding: 20, maxWidth: 1000, margin: "0 auto" },
  alerta: { padding: 15, background: "#fee2e2", color: "#b91c1c", borderRadius: 8, marginBottom: 20, fontWeight: "bold", border: "1px solid #f87171" },
  statsRow: { display: "flex", gap: 10, marginBottom: 20 },
  btn: { padding: "10px 20px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: 10 },
  tr: { borderBottom: "1px solid #eee", textAlign: "left", fontSize: "14px" }
}