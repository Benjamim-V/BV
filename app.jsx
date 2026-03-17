import { useState, useEffect } from "react";
import { supabase } from "./services/supabase";
import Login from "./components/Login";
import Aluno from "./components/Aluno";
import Professor from "./components/Professor";
import Admin from "./components/Admin";

export default function App() {
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Monitoriza a sessão do Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserRole(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchUserRole(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchUserRole(userId) {
    const { data } = await supabase
      .from("users")
      .select("tipo")
      .eq("auth_uid", userId)
      .single();
    if (data) setUserRole(data.tipo);
  }

  if (!session) return <Login />;

  return (
    <div>
      <nav style={{ padding: 10, background: "#eee", display: "flex", justifyContent: "space-between" }}>
        <span>Utilizador: {session.user.email} ({userRole})</span>
        <button onClick={() => supabase.auth.signOut()}>Sair</button>
      </nav>

      {userRole === "aluno" && <Aluno user={session.user} />}
      {userRole === "professor" && <Professor user={session.user} />}
      {userRole === "admin" && <Admin />}
    </div>
  );
}