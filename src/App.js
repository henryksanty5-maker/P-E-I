import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { getDatabase, ref, set, onValue, remove } from 'firebase/database';

// 1. Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDrQFf-ABIdhJocaMaBiBM0S7uzr8nfue4",
  authDomain: "pei-escola-redencao.firebaseapp.com",
  projectId: "pei-escola-redencao",
  storageBucket: "pei-escola-redencao.firebasestorage.app",
  messagingSenderId: "929602764845",
  appId: "1:929602764845:web:a90af20ee0c80ca74638a4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// --- ESTILOS MODERNOS ---
const s = {
  page: { minHeight: '100vh', padding: '30px 20px', color: '#1e293b' },
  topbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 25px', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' },
  profile: { display: 'flex', alignItems: 'center', gap: '15px' },
  avatar: { width: '48px', height: '48px', background: 'linear-gradient(135deg, #059669 0%, #ef4444 100%)', color: 'white', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(5, 150, 105, 0.3)' },
  btnGroup: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  btnPrimary: { background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  btnSuccess: { background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  btnSecondary: { background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', color: '#334155', border: '1px solid #cbd5e1', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  btnDanger: { background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', color: '#dc2626', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  btnEspecial: { background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  card: { padding: '28px', marginBottom: '24px' },
  cardHeader: { color: '#059669', fontSize: '1.25rem', fontWeight: '700', borderBottom: '2px solid rgba(16, 185, 129, 0.1)', paddingBottom: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' },
  badge: { background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', color: '#065f46', padding: '6px 12px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 'bold' },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' },
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' },
  label: { fontWeight: '600', color: '#334155', fontSize: '0.95rem' },
  input: { padding: '12px', border: '1px solid rgba(203, 213, 225, 0.6)', borderRadius: '8px', width: '100%', boxSizing: 'border-box', backgroundColor: 'rgba(255, 255, 255, 0.9)', outline: 'none', fontSize: '0.95rem' },
  checkboxContainer: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', cursor: 'pointer', padding: '6px 8px', borderRadius: '6px' },
  uploadBox: { border: '2px dashed #a7f3d0', borderRadius: '12px', padding: '20px', textAlign: 'center', backgroundColor: 'rgba(209, 250, 229, 0.4)', marginTop: '10px' },
  sectionTitle: { color: '#1e293b', marginBottom: '15px', fontSize: '1.05rem', borderBottom: '1px solid rgba(203, 213, 225, 0.5)', paddingBottom: '8px', fontWeight: '600' }
};

const GlobalCSS = () => (
  <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
      body { font-family: 'Poppins', sans-serif !important; margin: 0; background-color: #f0f4f8; overflow-x: hidden; }
      .glass-panel { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.6); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04); border-radius: 16px; }
      button { transition: all 0.3s ease !important; }
      button:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(0,0,0,0.15); filter: brightness(1.05); }
      button:disabled { cursor: not-allowed; opacity: 0.7; }

      @media screen { .print-only { display: none !important; } }
      @media print {
        @page { margin: 15mm; }
        * { background: transparent !important; color: black !important; box-shadow: none !important; position: static !important; overflow: visible !important; box-sizing: border-box !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important; filter: none !important; transform: none !important; }
        h1, h2, h3, h4, h5, h6, p, label, span { margin: 0 0 5px 0 !important; padding: 0 !important; }
        html, body, #root, .print-page { width: 100% !important; height: auto !important; min-height: 0 !important; display: block !important; }
        .no-print { display: none !important; }
        .print-only { display: block !important; }
        div, .print-block, .glass-panel, .card-print { display: block !important; width: 100% !important; margin: 0 0 10px 0 !important; border: none !important; page-break-inside: auto !important; }
        h1, h2, h3, h4, .cardHeader, .sectionTitle { page-break-after: avoid !important; break-after: avoid !important; }
        .print-input-group, .inputGroup, label.checkbox-row { page-break-inside: avoid !important; break-inside: avoid !important; }
        .section-break { page-break-before: always !important; break-before: page !important; }
        .card-print > div:first-child { border-bottom: 2px solid black !important; padding-bottom: 5px !important; margin-bottom: 10px !important; }
        input:not([type="checkbox"]) { border: none !important; border-bottom: 1px solid black !important; border-radius: 0 !important; width: 100% !important; padding: 2px 0 5px 0 !important; font-family: Arial, sans-serif !important; font-size: 11pt !important; }
        label { font-weight: bold !important; margin-top: 15px !important; display: block !important; }
        label.checkbox-row { display: flex !important; align-items: center !important; margin: 6px 0 !important; font-weight: normal !important; }
        label.checkbox-row input[type="checkbox"] { width: auto !important; margin-right: 8px !important; display: inline-block !important; }
        .badge-print { border: 1px solid black !important; }
      }
    `}
  </style>
);

// --- COMPONENTE MÁGICO PARA TEXTOS GRANDES (RESOLVE O BUG DE CORTE DO CHROME) ---
const TextareaPrint = ({ value, onChange, name, placeholder, minHeight = '120px' }) => (
  <div style={{ width: '100%' }}>
    <textarea
      className="no-print"
      style={{ ...s.input, minHeight, width: '100%', resize: 'vertical' }}
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
    />
    {/* Na impressão, a textarea esconde-se e entra esta DIV inteligente que quebra de página naturalmente! */}
    <div className="print-only" style={{ whiteSpace: 'pre-wrap', borderBottom: '1px solid black', width: '100%', padding: '5px 0', minHeight: '25px', color: 'black' }}>
      {value || ''}
    </div>
  </div>
);

const Checkbox = ({ label, formData, handleCheckbox }) => (
  <label className="checkbox-row" style={s.checkboxContainer}>
    <input type="checkbox" checked={!!(formData.opcoes || {})[label]} onChange={() => handleCheckbox(label)} style={{ width: '18px', height: '18px', accentColor: '#10b981' }} />
    <span style={{ fontSize: '0.95rem', color: '#334155', fontWeight: '500' }}>{label}</span>
  </label>
);

// 2. Tela de Login
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState(''); const [mensagem, setMensagem] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); setErro(''); setMensagem('');
    try { await signInWithEmailAndPassword(auth, email, password); } 
    catch (error) { setErro('E-mail ou senha incorretos. Tente novamente.'); }
  };

  const handleEsqueciSenha = async () => {
    if (!email) { setErro('Digite seu e-mail acima para redefinir a senha.'); return; }
    try { await sendPasswordResetEmail(auth, email); setMensagem('E-mail enviado!'); setErro(''); } 
    catch (error) { setErro('Erro ao enviar e-mail.'); }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '20px' }}>
      <GlobalCSS />
      <div className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '420px', textAlign: 'center' }}>
        <img src="/logo_pei.png" alt="Sistema PEI/PAEE" style={{ maxWidth: '100%', height: 'auto', marginBottom: '30px', borderRadius: '12px' }} />
        {erro && <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', fontWeight: '500' }}>{erro}</div>}
        {mensagem && <div style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', fontWeight: '500' }}>{mensagem}</div>}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input type="email" placeholder="E-mail institucional" value={email} onChange={(e) => setEmail(e.target.value)} style={s.input} required />
          <input type="password" placeholder="Senha de acesso" value={password} onChange={(e) => setPassword(e.target.value)} style={s.input} required />
          <button type="submit" style={{...s.btnPrimary, padding: '14px', fontSize: '1.05rem'}}>Acessar Plataforma</button>
        </form>
        <div style={{ marginTop: '25px' }}>
          <button type="button" onClick={handleEsqueciSenha} style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', fontWeight: '500' }}>Esqueci minha senha</button>
        </div>
      </div>
    </div>
  );
};

// 3. Tela de Lista de Alunos
const ListaAlunos = ({ onNovoPEI, onNovoPAEE, onEditar, onLogout, usuario }) => {
  const [alunos, setAlunos] = useState([]);

  const listaEspecialistas = [
    'henryksanty5@gmail.com', 'escolajac663@gmail.com', 'mariaroselidossantosrosa@gmail.com',
    'iquinhoslp@yahoo.com.br', 'belavista112@gmail.com', 'adriananeri@prof.educacao.sp.gov.br',
    'rackellbonete@gmail.com', 'educacaoredencao@gmail.com'
  ];
  
  const isEspecialista = listaEspecialistas.includes(usuario.email);

  useEffect(() => {
    const dbRef = ref(db, 'alunos');
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        let lista = Object.keys(data).map(key => ({ dbKey: key, ...data[key] }));
        if (!isEspecialista) { lista = lista.filter(aluno => aluno.criadoPor === usuario.email); }
        setAlunos(lista);
      } else { setAlunos([]); }
    });
  }, [usuario.email, isEspecialista]);

  const deletarAluno = async (dbKey) => {
    if(window.confirm(`Tem certeza que deseja excluir este documento?`)) { await remove(ref(db, `alunos/${dbKey}`)); }
  };

  return (
    <div style={s.page}>
      <GlobalCSS />
      <div className="glass-panel no-print" style={s.topbar}>
        <div style={s.profile}>
          <div style={s.avatar}>{usuario.email.substring(0,2).toUpperCase()}</div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>Painel Institucional</h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{isEspecialista ? 'Especialista / Admin' : 'Professor Regente'} • {usuario.email}</p>
          </div>
        </div>
        <div style={s.btnGroup}>
          <button style={s.btnPrimary} onClick={onNovoPEI}>+ Novo PEI</button>
          {isEspecialista && <button style={s.btnEspecial} onClick={onNovoPAEE}>+ Novo PAEE</button>}
          <button style={s.btnDanger} onClick={onLogout}>Sair</button>
        </div>
      </div>

      <h1 style={{ color: '#0f172a', marginBottom: '25px', fontSize: '1.8rem' }}>Documentos de Alunos</h1>

      {alunos.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>Nenhum documento cadastrado.</p>
        </div>
      ) : (
        <div className="print-block" style={s.grid3}>
          {alunos.map((aluno) => (
            <div key={aluno.dbKey} className="glass-panel" style={{...s.card, marginBottom: '0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
              <div>
                <div style={{ display: 'flex', justifyContent: '
