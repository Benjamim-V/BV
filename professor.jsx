import { useState } from "react"
import QRCode from "qrcode"

export default function Professor() {
  const [qr, setQr] = useState("")
  const [aulaId, setAulaId] = useState("")

  const gerarQR = async () => {
    if (!aulaId) return alert("Por favor, insira o ID da Aula")

    // Criamos um token que contém o ID da aula para o aluno registar na tabela 'presencas'
    const payload = `AULA|${aulaId}|${Date.now()}`

    try {
      const url = await QRCode.toDataURL(payload, { width: 300, margin: 2 })
      setQr(url)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div style={styles.container}>
      <h2>Área do Professor</h2>
      <p>Gere o código para os alunos registarem a presença.</p>

      <input
        placeholder="ID da Aula (UUID)"
        value={aulaId}
        onChange={(e) => setAulaId(e.target.value)}
        style={styles.input}
      />

      <button style={styles.btn} onClick={gerarQR}>
        Gerar QR Code de Presença
      </button>

      {qr && (
        <div style={{ marginTop: 30 }}>
          <img src={qr} alt="QR Code da Aula" style={{ border: "10px solid white", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }} />
          <p style={{ fontSize: "12px", color: "#666" }}>ID da Aula: {aulaId}</p>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { padding: 20, textAlign: "center", maxWidth: 500, margin: "0 auto" },
  input: { padding: 12, marginBottom: 15, width: "100%", borderRadius: 8, border: "1px solid #ccc" },
  btn: {
    padding: 15,
    borderRadius: 10,
    background: "#16a34a",
    color: "#fff",
    width: "100%",
    border: "none",
    fontSize: "16px",
    fontWeight: "bold"
  }
}