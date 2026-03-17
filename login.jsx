import { useState } from "react";
import { supabase } from "../services/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  };

  return (
    <div style={{ padding: 50, maxWidth: 400, margin: "auto" }}>
      <h2>Login Sistema Presenças</h2>
      <form onSubmit={handleLogin}>
        <input style={s.input} type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input style={s.input} type="password" placeholder="Senha" onChange={e => setPassword(e.target.value)} />
        <button style={s.btn} type="submit">Entrar</button>
      </form>
    </div>
  );
}

const s = {
  input: { display: "block", width: "100%", padding: 10, marginBottom: 10 },
  btn: { width: "100%", padding: 10, background: "#2563eb", color: "#fff", border: "none", cursor: "pointer" }
};