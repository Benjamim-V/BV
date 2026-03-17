import { useEffect, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { supabase } from "../services/supabase"

export default function Aluno() {
  const [user, setUser] = useState(null)
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  const scan = async () => {
    setScanning(true)
    const qrScanner = new Html5Qrcode("reader")

    try {
      await qrScanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        async (decodedText) => {
          // Formato esperado do QR: "AULA|UUID_DA_AULA|TIMESTAMP"
          const [prefixo, aulaId] = decodedText.split("|")

          if (prefixo !== "AULA") {
            alert("QR Code inválido para presença.")
            return
          }

          navigator.geolocation.getCurrentPosition(async (pos) => {
            const { error } = await supabase.from("presencas").insert([{
              aluno_id: user.id,
              aula_id: aulaId,
              status: "Presente",
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              data: new Date().toISOString()
            }])

            if (error) {
              alert("Erro ao registar: " + error.message)
            } else {
              alert("Presença registada com sucesso!")
              await qrScanner.stop()
              setScanning(false)
            }
          }, (geoErr) => alert("Necessário ativar GPS: " + geoErr.message))
        }
      )
    } catch (err) {
      console.error(err)
      setScanning(false)
    }
  }

  return (
    <div style={styles.container}>
      <h2>Área do Aluno</h2>
      <p>Bem-vindo, {user?.email}</p>
      
      {!scanning ? (
        <button style={styles.btn} onClick={scan}>
          Ler QR Code da Aula
        </button>
      ) : (
        <button style={{...styles.btn, background: "red"}} onClick={() => window.location.reload()}>
          Cancelar Leitura
        </button>
      )}
      
      <div id="reader" style={{ marginTop: 20 }}></div>
    </div>
  )
}

const styles = {
  container: { padding: 20, textAlign: "center", maxWidth: 500, margin: "0 auto" },
  btn: {
    padding: 15,
    borderRadius: 10,
    background: "#2563eb",
    color: "#fff",
    width: "100%",
    border: "none",
    fontSize: "16px",
    fontWeight: "bold"
  }
}