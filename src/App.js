import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { getDatabase, ref, set, push, onValue, remove } from 'firebase/database';

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

// 🌟 NOVO: VARREDURA PROFUNDA ANTI-ERROS DO FIREBASE 🌟
// Esta função caça fantasmas e limpa qualquer ponto, barra ou símbolo proibido de Rascunhos antigos!
const sanitizeFirebaseKeys = (obj) => {
  if (typeof obj !== 'object' || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeFirebaseKeys);
  const newObj = {};
  for (let key in obj) {
    const safeKey = key.replace(/[.#$\[\]\/]/g, '_');
    newObj[safeKey] = sanitizeFirebaseKeys(obj[key]);
  }
  return newObj;
};

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

const TextareaPrint = ({ value, onChange, name, placeholder, minHeight = '120px' }) => (
  <div style={{ width: '100%' }}>
    <textarea className="no-print" style={{ ...s.input, minHeight, width: '100%', resize: 'vertical' }} name={name} value={value || ''} onChange={onChange} placeholder={placeholder} />
    <div className="print-only" style={{ whiteSpace: 'pre-wrap', borderBottom: '1px solid black', width: '100%', padding: '5px 0', minHeight: '25px', color: 'black' }}>{value || ''}</div>
  </div>
);

const Checkbox = ({ label, formData, handleCheckbox }) => {
  const safeKey = label.replace(/[.#$\[\]\/]/g, '_');
  return (
    <label className="checkbox-row" style={s.checkboxContainer}>
      <input type="checkbox" checked={!!(formData.opcoes || {})[safeKey]} onChange={() => handleCheckbox(safeKey)} style={{ width: '18px', height: '18px', accentColor: '#10b981' }} />
      <span style={{ fontSize: '0.95rem', color: '#334155', fontWeight: '500' }}>{label}</span>
    </label>
  );
};

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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h3 style={{ color: '#059669', margin: '0', fontSize: '1.3rem' }}>{aluno.aluno}</h3>
                  <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: aluno.tipoDocumento === 'PAEE' ? '#dbeafe' : '#d1fae5', color: aluno.tipoDocumento === 'PAEE' ? '#1e40af' : '#065f46' }}>
                    {aluno.tipoDocumento || 'PEI'}
                  </span>
                </div>
                <div style={{ backgroundColor: 'rgba(209, 250, 229, 0.4)', padding: '12px', borderRadius: '8px', marginBottom: '15px' }}>
                  <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem' }}><strong>Turma:</strong> {aluno.anoSerie || '-'} {aluno.turma}</p>
                  <p style={{ margin: '0', fontSize: '0.9rem' }}><strong>Diagnóstico:</strong> {aluno.diagnostico || 'Não informado'}</p>
                </div>
                <p style={{ margin: '0 0 20px 0', fontSize: '0.75rem', color: '#94a3b8' }}>Criado por: {aluno.criadoPor}</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button style={{...s.btnSecondary, flex: '1', backgroundColor: 'white'}} onClick={() => onEditar(aluno)}>Abrir / Editar</button>
                <button style={{...s.btnDanger, padding: '10px'}} onClick={() => deletarAluno(aluno.dbKey)}>Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 4A. FORMULÁRIO PEI 
const SistemaPEI = ({ alunoData, onVoltar, usuario }) => {
  const estadoInicial = { tipoDocumento: 'PEI', aluno: '', nascimento: '', anoSerie: '', turma: '', responsaveis: '', diagnostico: '', cid: '', crm: '', resultadoAvaliacao: '', rotinaFamiliar: '', fatoresAmbientais: '', resumoAluno: '', campoLinguagem: '', campoMatematica: '', anexos: {}, conteudos: {}, diario: {}, opcoes: {} };
  
  const [formData, setFormData] = useState(() => { 
    if (alunoData) return { ...estadoInicial, ...alunoData, anexos: alunoData.anexos || {} };
    try {
      const rascunho = localStorage.getItem('rascunhoPEI');
      if (rascunho) return JSON.parse(rascunho);
    } catch(e) {}
    return estadoInicial; 
  });
  
  const [aEnviar, setAEnviar] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [zoomImg, setZoomImg] = useState(null);
  const disciplinas = ['Língua Portuguesa', 'Matemática', 'Ciências', 'História', 'Geografia', 'Artes', 'Educação Física', 'Inglês', 'Informática'];
  const bimestres = ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'];

  useEffect(() => {
    if (!alunoData) {
      try { localStorage.setItem('rascunhoPEI', JSON.stringify(formData)); } 
      catch (e) { console.warn("Rascunho cheio demais"); }
    }
  }, [formData, alunoData]);

  const limparRascunho = () => {
    if(window.confirm("Deseja apagar tudo e começar um formulário em branco?")) {
      setFormData(estadoInicial);
      localStorage.removeItem('rascunhoPEI');
    }
  };

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleCheckbox = (opcao) => setFormData(prev => ({ ...prev, opcoes: { ...(prev.opcoes || {}), [opcao]: !(prev.opcoes || {})[opcao] } }));
  const handleNestedText = (cat, chave, valor) => setFormData(prev => ({ ...prev, [cat]: { ...(prev[cat] || {}), [chave]: valor } }));

  const salvarNoBanco = async () => {
    if (!formData.aluno) { alert("Preencha o nome do aluno para salvar."); return; }
    setSalvando(true);
    try {
      const dadosParaSalvar = { ...formData, criadoPor: formData.criadoPor || usuario.email };
      
      // 🌟 LIMPEZA PROFUNDA: Varrer o Rascunho inteiro e curar erros
      const dadosLimpos = sanitizeFirebaseKeys(JSON.parse(JSON.stringify(dadosParaSalvar))); 

      let dbRef;
      if (alunoData?.dbKey) {
        // Editando registro existente - mantém a chave original
        dbRef = ref(db, `alunos/${alunoData.dbKey}`);
      } else {
        // Novo registro - gera chave única via push() para nunca sobrescrever outro aluno
        dbRef = push(ref(db, 'alunos'));
      }
      
      await set(dbRef, dadosLimpos); 
      alert(`✅ PEI salvo na nuvem com sucesso!`); 
      localStorage.removeItem('rascunhoPEI');
    } 
    catch (error) { 
      alert(`Erro técnico reportado pelo Firebase: ${error.message}\n\n🚨 Fique tranquilo! Seus dados estão salvos no rascunho automático no seu computador.\nAtualize a página e tente salvar novamente em alguns instantes.`); 
    }
    finally {
      setSalvando(false);
    }
  };

  const handleFileUpload = (e, campoID) => {
    const file = e.target.files[0]; if (!file) return;
    setAEnviar(true); const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas'); const scaleSize = 600 / img.width; canvas.width = 600; canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setFormData(prev => ({ ...prev, anexos: { ...(prev.anexos || {}), [campoID]: canvas.toDataURL('image/jpeg', 0.4) } }));
        setAEnviar(false);
      }; img.src = event.target.result;
    }; reader.readAsDataURL(file);
  };

  const removerAnexo = (campoID) => {
    setFormData(prev => { const novosAnexos = { ...(prev.anexos || {}) }; delete novosAnexos[campoID]; return { ...prev, anexos: novosAnexos }; });
  };

  const FileUpload = ({ label, campoID }) => (
    <div className="no-print print-block" style={s.uploadBox}>
      {formData.anexos && formData.anexos[campoID] ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src={formData.anexos[campoID]} alt="Anexo" title="Clique para ampliar" onClick={() => setZoomImg(formData.anexos[campoID])} style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '8px', border: '1px solid #a7f3d0', cursor: 'zoom-in' }} />
          <button type="button" onClick={() => removerAnexo(campoID)} style={{ marginTop: '12px', padding: '8px 16px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Remover Imagem</button>
        </div>
      ) : (
        <>
          <span style={{ fontSize: '2rem' }}>📷</span><p style={{ margin: '8px 0', fontWeight: '600', color: '#059669' }}>{label}</p>
          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, campoID)} disabled={aEnviar} />
          {aEnviar && <span style={{color: '#ef4444', display: 'block', marginTop: '8px'}}>Comprimindo imagem...</span>}
        </>
      )}
    </div>
  );

  return (
    <div className="print-page" style={s.page}>
      <GlobalCSS />
      <div className="glass-panel no-print" style={s.topbar}>
        <div><h2 style={{margin: 0, color: '#0f172a'}}>Editor de PEI</h2></div>
        <div style={s.btnGroup}>
          <button style={s.btnSecondary} onClick={onVoltar} disabled={salvando}>← Voltar</button>
          {!alunoData && <button style={{...s.btnSecondary, color: '#dc2626', borderColor: '#fecaca'}} onClick={limparRascunho} disabled={salvando}>Limpar Formulário</button>}
          <button style={s.btnPrimary} onClick={salvarNoBanco} disabled={salvando}>{salvando ? '⏳ Salvando...' : '✓ Salvar Nuvem'}</button>
          <button style={s.btnSuccess} onClick={()=>window.print()} disabled={salvando}>🖨️ Imprimir PDF</button>
        </div>
      </div>

      <div className="print-only" style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid black', paddingBottom: '15px' }}>
        <h2 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>PREFEITURA MUNICIPAL DE REDENÇÃO DA SERRA</h2>
        <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>EMEIEF “PROFESSORA EDNA REGINA DE OLIVEIRA E SILVA”</h3>
        <h1 style={{ marginTop: '20px', fontSize: '1.4rem' }}>PLANO EDUCACIONAL INDIVIDUALIZADO – PEI</h1>
      </div>

      <div className="glass-panel card-print">
        <div style={s.cardHeader}><span className="badge-print" style={s.badge}>A</span> Identificação do Aluno</div>
        <div className="print-block" style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '30px' }}>
          <div className="no-print"><FileUpload label="Foto do Aluno" campoID="foto_perfil" /></div>
          <div className="print-block" style={s.grid2}>
            <div className="print-input-group"><label style={s.label}>Nome do Aluno *</label><input style={s.input} name="aluno" value={formData.aluno} onChange={handleChange} /></div>
            <div className="print-input-group"><label style={s.label}>Data de Nascimento</label><input style={s.input} name="nascimento" value={formData.nascimento} onChange={handleChange} /></div>
            <div className="print-input-group"><label style={s.label}>Ano/Série</label><input style={s.input} name="anoSerie" value={formData.anoSerie} onChange={handleChange} /></div>
            <div className="print-input-group"><label style={s.label}>Turma</label><input style={s.input} name="turma" value={formData.turma} onChange={handleChange} /></div>
            <div className="print-input-group"><label style={s.label}>Responsáveis</label><input style={s.input} name="responsaveis" value={formData.responsaveis} onChange={handleChange} /></div>
          </div>
        </div>
      </div>

      <div className="glass-panel card-print">
        <div style={s.cardHeader}><span className="badge-print" style={s.badge}>B</span> Informações Clínicas</div>
        <div className="print-block" style={s.grid3}>
          <div className="print-input-group"><label style={s.label}>Diagnóstico</label><input style={s.input} name="diagnostico" value={formData.diagnostico} onChange={handleChange} /><FileUpload label="Anexar Laudo" campoID="laudo_medico" /></div>
          <div className="print-input-group"><label style={s.label}>Códigos CID</label><input style={s.input} name="cid" value={formData.cid} onChange={handleChange} /></div>
          <div className="print-input-group"><label style={s.label}>CRM do Médico</label><input style={s.input} name="crm" value={formData.crm} onChange={handleChange} /></div>
        </div>
      </div>

      <div className="glass-panel card-print">
        <div style={s.cardHeader}><span className="badge-print" style={s.badge}>C</span> Medicação e Terapias</div>
        <div className="print-block" style={s.grid2}>
          <div className="print-input-group"><Checkbox label="O aluno utiliza medicação?" formData={formData} handleCheckbox={handleCheckbox} /><FileUpload label="Anexar Receita" campoID="receita_medica" /></div>
          <div className="print-input-group"><Checkbox label="Acompanhamento terapêutico?" formData={formData} handleCheckbox={handleCheckbox} /></div>
        </div>
        <div className="print-block" style={{...s.grid2, marginTop: '20px'}}>
          <div className="print-input-group"><label style={s.label}>Campo de Experiência: Linguagem</label><TextareaPrint name="campoLinguagem" value={formData.campoLinguagem} onChange={handleChange} placeholder="Objetivos para a área da linguagem..." /></div>
          <div className="print-input-group"><label style={s.label}>Campo de Experiência: Matemática</label><TextareaPrint name="campoMatematica" value={formData.campoMatematica} onChange={handleChange} placeholder="Objetivos para a área da matemática..." /></div>
        </div>
        <div className="print-block" style={{ marginTop: '20px' }}><h4>Especialistas que acompanham o aluno:</h4><div className="print-block" style={s.grid3}><Checkbox label="Neurologista" formData={formData} handleCheckbox={handleCheckbox} /><Checkbox label="Psicólogo" formData={formData} handleCheckbox={handleCheckbox} /><Checkbox label="Fonoaudiólogo" formData={formData} handleCheckbox={handleCheckbox} /><Checkbox label="Psicopedagogo" formData={formData} handleCheckbox={handleCheckbox} /><Checkbox label="Terapeuta Ocupacional" formData={formData} handleCheckbox={handleCheckbox} /><Checkbox label="ABA / TCC" formData={formData} handleCheckbox={handleCheckbox} /></div></div>
      </div>

      <div className="glass-panel card-print">
        <div style={s.cardHeader}><span className="badge-print" style={s.badge}>D</span> Avaliação Diagnóstica</div>
        <div className="print-block" style={s.grid2}>
          <div className="print-input-group"><label style={s.label}>Resultado da Avaliação</label><TextareaPrint name="resultadoAvaliacao" value={formData.resultadoAvaliacao} onChange={handleChange} placeholder="Descreva os resultados..." /></div>
          <div className="print-input-group"><label style={s.label}>Evidência / Avaliação</label><FileUpload label="Anexar Avaliação" campoID="avaliacao_diagnostica" /></div>
        </div>
      </div>

      <div className="glass-panel card-print">
        <div style={s.cardHeader}><span className="badge-print" style={s.badge}>E</span> Adaptações por Disciplina</div>
        <div className="print-block" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {disciplinas.map((disc) => (
            <div key={disc} className="print-block" style={{ border: '1px solid rgba(203, 213, 225, 0.5)', padding: '18px', backgroundColor: 'rgba(209, 250, 229, 0.2)' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#065f46' }}>{disc}</h4>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '15px' }}>
                <Checkbox label={`${disc} - Priorização de conteúdos`} formData={formData} handleCheckbox={handleCheckbox} />
                <Checkbox label={`${disc} - Introdução de conteúdos alternativos`} formData={formData} handleCheckbox={handleCheckbox} />
              </div>
              <label style={s.label}>Conteúdo Ministrado (Registro Anual):</label>
              <TextareaPrint minHeight="150px" value={(formData.conteudos || {})[disc]} onChange={(e) => handleNestedText('conteudos', disc, e.target.value)} placeholder={`Registre aqui todo o conteúdo planejado para ${disc}...`} />
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel card-print">
        <div style={s.cardHeader}><span className="badge-print" style={s.badge}>H</span> Métodos de Avaliação</div>
        <div className="print-block print-input-group" style={s.grid3}><Checkbox label="Sondagem pedagógica" formData={formData} handleCheckbox={handleCheckbox} /><Checkbox label="Múltipla escolha (objetiva)" formData={formData} handleCheckbox={handleCheckbox} /><Checkbox label="Resposta oral" formData={formData} handleCheckbox={handleCheckbox} /><Checkbox label="Exercícios práticos" formData={formData} handleCheckbox={handleCheckbox} /><Checkbox label="Trabalhos escritos/orais" formData={formData} handleCheckbox={handleCheckbox} /></div>
      </div>

      <div className="glass-panel card-print">
        <div style={s.cardHeader}><span className="badge-print" style={s.badge}>I</span> Diário do Aluno (Acompanhamento)</div>
        <div className="print-block" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {bimestres.map((bim, index) => (
            <div key={bim} className="print-block" style={{ border: '1px solid rgba(203, 213, 225, 0.5)', padding: '18px', backgroundColor: 'rgba(209, 250, 229, 0.2)' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#065f46' }}>{bim}</h4>
              <TextareaPrint minHeight="120px" value={(formData.diario || {})[bim]} onChange={(e) => handleNestedText('diario', bim, e.target.value)} placeholder="Evolução, observações e conquistas..." />
              <div style={{ marginTop: '15px' }}><FileUpload label="Anexar Evidência / Atividade" campoID={`diario_bimestre_${index+1}`} /></div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="glass-panel card-print section-break">
        <div style={s.cardHeader}><span className="badge-print" style={s.badge}>J</span> Revisão Final</div>
        <div className="print-input-group"><label style={s.label}>Resumo do Aluno</label><TextareaPrint name="resumoAluno" value={formData.resumoAluno} onChange={handleChange} placeholder="Considerações finais..." minHeight="150px" /></div>
        <div className="print-only" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px' }}>
          {['Professor(a)', 'Coordenação', 'Responsáveis'].map(r => (<div key={r} style={{ flex: 1, textAlign: 'center', margin: '0 10px' }}><div style={{ borderBottom: '1px solid black', height: '30px' }}></div><p>{r}</p></div>))}
        </div>
      </div>

      {zoomImg && (
        <div className="no-print" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'zoom-out' }} onClick={() => setZoomImg(null)}>
          <img src={zoomImg} alt="Zoom" style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '8px', border: '3px solid white', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }} />
          <p style={{ color: 'white', marginTop: '15px', fontWeight: 'bold', fontSize: '1.1rem' }}>Clique em qualquer lugar para fechar</p>
        </div>
      )}
    </div>
  );
};

// 4B. NOVO FORMULÁRIO: PAEE 
const SistemaPAEE = ({ alunoData, onVoltar, usuario }) => {
  const estadoInicial = {
    tipoDocumento: 'PAEE', aluno: '', nascimento: '', sexo: '',
    escola: 'EMEIEF "PROFESSORA EDNA REGINA DE OLIVEIRA E SILVA"',
    turno: '', turma: '', anoSerie: '', informacoesEstudante: '', 
    estudoDeCaso: '', aeeComplementar: '', medidasEscola: '', 
    assuntoPreferencia: '', quaisFixacao: '', organizacaoTipo: '', 
    organizacaoAtendimentos: '', organizacaoTempo: '', organizacaoDias: '', 
    organizacaoDatasObservacao: '', organizacaoDatasAtendimento: '', 
    organizacaoDatasAtendimentoFamiliar: '', qualDiagnostico: '', 
    medicamentos: '', tipoFonte: '', qtdAtivImpressas: '', 
    qtdAtivCopiadas: '', observacoesEstrategias: '', outrosAEE: '', 
    objetivosAEE: '', opcoes: {}, textos: {}, anexos: {}
  };
  
  const [formData, setFormData] = useState(() => { 
    if (alunoData) return { ...estadoInicial, ...alunoData, anexos: alunoData.anexos || {} };
    try {
      const rascunho = localStorage.getItem('rascunhoPAEE');
      if (rascunho) return JSON.parse(rascunho);
    } catch(e) {}
    return estadoInicial; 
  });
  
  const [aEnviar, setAEnviar] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [zoomImg, setZoomImg] = useState(null); 

  useEffect(() => {
    if (!alunoData) {
      try { localStorage.setItem('rascunhoPAEE', JSON.stringify(formData)); } 
      catch (e) { console.warn("Rascunho cheio demais"); }
    }
  }, [formData, alunoData]);

  const limparRascunho = () => {
    if(window.confirm("Deseja apagar tudo e começar um formulário em branco?")) {
      setFormData(estadoInicial);
      localStorage.removeItem('rascunhoPAEE');
    }
  };

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleCheckbox = (opcao) => setFormData(prev => ({ ...prev, opcoes: { ...(prev.opcoes || {}), [opcao]: !(prev.opcoes || {})[opcao] } }));

  const salvarNoBanco = async () => {
    if (!formData.aluno) { alert("Preencha o nome do aluno."); return; }
    setSalvando(true);
    try {
      const dadosParaSalvar = { ...formData, criadoPor: formData.criadoPor || usuario.email };
      
      // 🌟 LIMPEZA PROFUNDA: Varrer o Rascunho inteiro e curar erros
      const dadosLimpos = sanitizeFirebaseKeys(JSON.parse(JSON.stringify(dadosParaSalvar))); 

      let dbRef;
      if (alunoData?.dbKey) {
        // Editando registro existente - mantém a chave original
        dbRef = ref(db, `alunos/${alunoData.dbKey}`);
      } else {
        // Novo registro - gera chave única via push() para nunca sobrescrever outro aluno
        dbRef = push(ref(db, 'alunos'));
      }
      
      await set(dbRef, dadosLimpos); 
      alert(`✅ Documento PAEE salvo na nuvem com sucesso!`); 
      localStorage.removeItem('rascunhoPAEE');
    } 
    catch (error) { 
      alert(`Erro técnico reportado pelo Firebase: ${error.message}\n\n🚨 Fique tranquilo! Seus dados estão salvos no rascunho automático no seu computador.\nAtualize a página e tente salvar novamente em alguns instantes.`); 
    }
    finally {
      setSalvando(false);
    }
  };

  const handleFileUpload = (e, campoID) => {
    const file = e.target.files[0]; if (!file) return;
    setAEnviar(true); const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas'); const scaleSize = 600 / img.width; canvas.width = 600; canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setFormData(prev => ({ ...prev, anexos: { ...(prev.anexos || {}), [campoID]: canvas.toDataURL('image/jpeg', 0.4) } }));
        setAEnviar(false);
      }; img.src = event.target.result;
    }; reader.readAsDataURL(file);
  };

  const removerAnexo = (campoID) => {
    setFormData(prev => { const novosAnexos = { ...(prev.anexos || {}) }; delete novosAnexos[campoID]; return { ...prev, anexos: novosAnexos }; });
  };

  const FileUpload = ({ label, campoID }) => (
    <div className="no-print print-block" style={s.uploadBox}>
      {formData.anexos && formData.anexos[campoID] ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src={formData.anexos[campoID]} alt="Anexo" title="Clique para ampliar" onClick={() => setZoomImg(formData.anexos[campoID])} style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '8px', border: '1px solid #a7f3d0', cursor: 'zoom-in' }} />
          <button type="button" onClick={() => removerAnexo(campoID)} style={{ marginTop: '12px', padding: '8px 16px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Remover Imagem</button>
        </div>
      ) : (
        <>
          <span style={{ fontSize: '2rem' }}>📷</span><p style={{ margin: '8px 0', fontWeight: '600', color: '#059669' }}>{label}</p>
          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, campoID)} disabled={aEnviar} />
          {aEnviar && <span style={{color: '#ef4444', display: 'block', marginTop: '8px'}}>Comprimindo imagem...</span>}
        </>
      )}
    </div>
  );

  return (
    <div className="print-page" style={s.page}>
      <GlobalCSS />
      <div className="glass-panel no-print" style={s.topbar}>
        <div><h2 style={{margin: 0, color: '#1e40af'}}>Editor de PAEE (Especialista AEE)</h2><p style={{margin:0, fontSize:'0.85rem'}}>Documento Oficial da Educação Especial</p></div>
        <div style={s.btnGroup}>
          <button style={s.btnSecondary} onClick={onVoltar} disabled={salvando}>← Voltar</button>
          {!alunoData && <button style={{...s.btnSecondary, color: '#dc2626', borderColor: '#fecaca'}} onClick={limparRascunho} disabled={salvando}>Limpar Formulário</button>}
          <button style={{...s.btnPrimary, background: '#1e40af'}} onClick={salvarNoBanco} disabled={salvando}>{salvando ? '⏳ Salvando...' : '✓ Salvar Nuvem'}</button>
          <button style={s.btnSuccess} onClick={()=>window.print()} disabled={salvando}>🖨️ Imprimir PDF</button>
        </div>
      </div>

      <div className="print-only" style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid black', paddingBottom: '15px' }}>
        <h2 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>PREFEITURA MUNICIPAL DE REDENÇÃO DA SERRA</h2>
        <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>EMEIEF "PROFESSORA EDNA REGINA DE OLIVEIRA E SILVA"</h3>
        <h1 style={{ marginTop: '20px', fontSize: '1.4rem' }}>PLANO DE ATENDIMENTO EDUCACIONAL ESPECIALIZADO - PAEE</h1>
      </div>

      <div className="glass-panel card-print">
        <div style={s.cardHeader}><span className="badge-print" style={s.badge}>I</span> Informações do Estudante</div>
        <div className="print-block" style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '30px' }}>
          <div className="no-print"><FileUpload label="Foto do Aluno" campoID="foto_perfil" /></div>
          <div className="print-block" style={s.grid2}>
            <div className="print-input-group"><label style={s.label}>Nome Completo *</label><input style={s.input} name="aluno" value={formData.aluno} onChange={handleChange} /></div>
            <div className="print-input-group"><label style={s.label}>Data de Nascimento</label><input style={s.input} name="nascimento" value={formData.nascimento} onChange={handleChange} /></div>
            <div className="print-input-group"><label style={s.label}>Sexo</label><input style={s.input} placeholder="Feminino ou Masculino" name="sexo" value={formData.sexo} onChange={handleChange} /></div>
            <div className="print-input-group"><label style={s.label}>Turno</label><input style={s.input} name="turno" value={formData.turno} onChange={handleChange} /></div>
            <div className="print-input-group"><label style={s.label}>Ano de Escolaridade</label><input style={s.input} name="anoSerie" value={formData.anoSerie} onChange={handleChange} /></div>
            <div className="print-input-group"><label style={s.label}>Turma</label><input style={s.input} name="turma" value={formData.turma} onChange={handleChange} /></div>
          </div>
        </div>
        <h4 style={s.sectionTitle}>Estudante elegível aos serviços da Educação Especial</h4>
        <div className="print-block print-input-group" style={s.grid3}>
          <Checkbox label="Deficiência Intelectual" formData={formData} handleCheckbox={handleCheckbox} />
          <Checkbox label="Deficiência Visual" formData={formData} handleCheckbox={handleCheckbox} />
          <Checkbox label="Deficiência Física" formData={formData} handleCheckbox={handleCheckbox} />
          <Checkbox label="Deficiência Auditiva/Surdez" formData={formData} handleCheckbox={handleCheckbox} />
          <Checkbox label="Surdocegueira" formData={formData} handleCheckbox={handleCheckbox} />
          <Checkbox label="Deficiência Múltipla" formData={formData} handleCheckbox={handleCheckbox} />
          <Checkbox label="Altas habilidades/superdotação" formData={formData} handleCheckbox={handleCheckbox} />
          <Checkbox label="Transtorno do Espectro Autista" formData={formData} handleCheckbox={handleCheckbox} />
        </div>
        <h4 style={s.sectionTitle}>Nível de Apoio</h4>
        <div className="print-block print-input-group" style={{display: 'flex', gap: '30px', flexWrap: 'wrap'}}>
          <Checkbox label="Nível 1" formData={formData} handleCheckbox={handleCheckbox} />
          <Checkbox label="Nível 2" formData={formData} handleCheckbox={handleCheckbox} />
          <Checkbox label="Nível 3" formData={formData} handleCheckbox={handleCheckbox} />
        </div>

        <div className="print-input-group" style={{marginTop: '20px'}}>
          <label style={s.label}>Laudo Médico / Diagnóstico:</label>
          <FileUpload label="Anexar Foto do Laudo" campoID="laudo_medico" />
        </div>
        
        <div className="print-input-group" style={{marginTop: '20px'}}>
          <label style={s.label}>I – Informações do Estudante</label>
          <TextareaPrint name="informacoesEstudante" value={formData.informacoesEstudante} onChange={handleChange} minHeight="120px" />
        </div>
        <div className="print-input-group" style={{marginTop: '20px'}}>
          <label style={s.label}>II – Informações identificadas no Estudo de Caso</label>
          <TextareaPrint name="estudoDeCaso" value={formData.estudoDeCaso} onChange={handleChange} minHeight="120px" />
        </div>
      </div>

      <div className="glass-panel card-print">
        <div style={s.cardHeader}><span className="badge-print" style={s.badge}>III</span> Apoios, Recursos e Serviços</div>
        <div className="print-block" style={s.grid2}>
          <div className="print-input-group">
            <Checkbox label="Recursos Pedagógicos, de Acessibilidade e de T.A." formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Professor de Libras ou Professor interlocutor de Libras" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Professor Instrutor-mediador ou Guia-intérprete" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Serviço de Profissional de Apoio Escolar" formData={formData} handleCheckbox={handleCheckbox} />
          </div>
          <div className="print-input-group">
            <p style={{margin: '0 0 10px 0', fontWeight: 'bold'}}>Apoio Escolar para:</p>
            <Checkbox label="Alimentação, no cotidiano escolar" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Higiene pessoal, íntima e bucal / uso do banheiro" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Locomoção nos ambientes escolares" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Autocuidado no cotidiano escolar" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Mediação e auxílio à superação de desafios escolares" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Suporte à comunicação e à interação social" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Instrumentos para oportunizar a socialização" formData={formData} handleCheckbox={handleCheckbox} />
          </div>
        </div>
        <div className="print-input-group" style={{marginTop: '20px'}}>
          <label style={s.label}>AEE de forma complementar ou suplementar ao currículo:</label>
          <TextareaPrint name="aeeComplementar" value={formData.aeeComplementar} onChange={handleChange} minHeight="120px" />
        </div>
        <div className="print-input-group" style={{marginTop: '20px'}}>
          <label style={s.label}>Quais medidas a escola deve implementar para superar as barreiras identificadas no Estudo de Caso?</label>
          <TextareaPrint name="medidasEscola" value={formData.medidasEscola} onChange={handleChange} minHeight="120px" />
        </div>
      </div>

      <div className="glass-panel card-print">
        <div style={s.cardHeader}><span className="badge-print" style={s.badge}>IV</span> Perfil do Aluno</div>
        <div className="print-block" style={s.grid2}>
          <div className="print-input-group">
            <h4>Linguagem e Comunicação</h4>
            <Checkbox label="Apresenta fala" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Tem comunicação verbal" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Apresenta comunicação não verbal" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Apresenta linguagem oral constituída" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Apresenta ecolalias" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Aponta (para expressar o que quer e o que não quer)" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Faz uso de comunicação alternativa e aumentativa" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Usa gestos para se comunicar" formData={formData} handleCheckbox={handleCheckbox} />
            <div className="print-input-group" style={{marginTop: '8px'}}><label style={s.label}>Assunto de preferência:</label><input style={s.input} name="assuntoPreferencia" value={formData.assuntoPreferencia} onChange={handleChange} /></div>
          </div>
          <div className="print-input-group">
            <h4>Perfil Sensorial</h4>
            <Checkbox label="Sensibilidade a luz" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Sensibilidade tátil" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Sensibilidade Olfativa" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Alimentação seletiva" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Sensibilidade auditiva" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Não faz contato visual" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Não faz uso social da audição" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Apresenta agitação motora" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Apresenta movimentos repetitivos" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Esteriotipias constantes e de modo disfuncional" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Eventual uso de esteriotipia" formData={formData} handleCheckbox={handleCheckbox} />
          </div>
        </div>
        <div className="print-block" style={{...s.grid2, marginTop: '20px'}}>
          <div className="print-input-group">
            <h4>Habilidades Sociais</h4>
            <Checkbox label="Brinca com os colegas" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Reconhece sua professora, os colegas e os diferencia das outras crianças" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Prefere adultos" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Não brinca, mas permanece próximo das outras crianças" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Resiste a interação e procura isolar-se" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Imita os colegas" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Apresenta reações de desregulação emocional: Raiva, Agressividade, Choro sem motivo" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Apresenta Autoagressão" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Apresenta fixação por brinquedos/objetos" formData={formData} handleCheckbox={handleCheckbox} />
            <div className="print-input-group" style={{marginTop: '8px'}}><label style={s.label}>Quais (fixações):</label><input style={s.input} name="quaisFixacao" value={formData.quaisFixacao} onChange={handleChange} /></div>
          </div>
          <div className="print-input-group">
            <h4>Atividades de Vida Diária e Vida Prática (Autonomia)</h4>
            <Checkbox label="Veste-se sozinho" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Faz uso do banheiro com autonomia" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Solicita água, comida, e o uso do banheiro" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Alimenta-se com autonomia" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Identifica situação de risco/perigo" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Demonstra comportamento preventivo e de autoproteção diante de aventuras, riscos e novidades" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Apresenta comportamentos de autocuidado e higiene pessoal" formData={formData} handleCheckbox={handleCheckbox} />
          </div>
        </div>
      </div>

      <div className="glass-panel card-print">
        <div style={s.cardHeader}><span className="badge-print" style={s.badge}>IV.B</span> Habilidades para Aprender e Estratégias Didáticas</div>
        <div className="print-block" style={s.grid2}>
          <div className="print-input-group">
            <h4>Habilidades Básicas para Aprender</h4>
            <Checkbox label="Permanece sentado na cadeira ou no chão" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Demonstra ouvir com atenção quando o professor está falando" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Necessita de uma mediação do educador/mediador ou terapeuta" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Necessita de toque físico e modelo para começar a tarefa" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Resiste categoricamente a um novo ambiente para aprender" formData={formData} handleCheckbox={handleCheckbox} />
          </div>
          <div className="print-input-group">
            <h4>Estratégias Didáticas (Na sala de aula, a criança precisa:)</h4>
            <Checkbox label="Sentar-se em lugar pouco iluminado" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Sentar-se próximo ao professor" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Sentar-se próximo ao educador/mediador" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Necessita de cartões visuais com regras básicas" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Necessita de tempo livre de alternância entre uma atividade e outra" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Necessita de recursos de recompensa após um esforço" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Diário de bordo para registro dos comportamentos e vocabulário novo" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="A criança precisa do apoio de um ledor" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="A criança necessita de uso de próteses (tabelas, lembretes, marcadores coloridos) para apoio da memória" formData={formData} handleCheckbox={handleCheckbox} />
          </div>
        </div>
        <div className="print-block" style={{...s.grid2, marginTop: '15px'}}>
          <div className="print-input-group">
            <h4>Atividades de Registro</h4>
            <div className="print-input-group"><label style={s.label}>Tipo de fonte (modelo, maiúscula/minúscula, cursiva/impressa):</label><input style={s.input} name="tipoFonte" value={formData.tipoFonte} onChange={handleChange} /></div>
            <div className="print-input-group"><label style={s.label}>Quantidade de atividades impressas no dia:</label><input style={s.input} name="qtdAtivImpressas" value={formData.qtdAtivImpressas} onChange={handleChange} /></div>
            <div className="print-input-group"><label style={s.label}>Quantidade de atividades copiadas do quadro:</label><input style={s.input} name="qtdAtivCopiadas" value={formData.qtdAtivCopiadas} onChange={handleChange} /></div>
            <Checkbox label="Exercícios com enunciados curtos" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Exercícios avaliativos com apenas um comando" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Treino com exercícios que apresentam 2 e 3 comandos" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Inferências explícitas no texto" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Treino de inferências implícitas no texto" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Recompensa especial para as atividades de registro" formData={formData} handleCheckbox={handleCheckbox} />
          </div>
          <div className="print-input-group">
            <h4>Observações</h4>
            <TextareaPrint name="observacoesEstrategias" value={formData.observacoesEstrategias} onChange={handleChange} placeholder="Observações sobre estratégias..." minHeight="180px" />
          </div>
        </div>
      </div>

      <div className="glass-panel card-print">
        <div style={s.cardHeader}><span className="badge-print" style={s.badge}>V</span> Organização do AEE</div>
        <div className="print-block" style={s.grid2}>
          <div className="print-input-group">
            <label style={s.label}>Organização do atendimento no AEE:</label>
            <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
              <Checkbox label="Individual" formData={formData} handleCheckbox={handleCheckbox} />
              <Checkbox label="Coletivo" formData={formData} handleCheckbox={handleCheckbox} />
            </div>
          </div>
          <div className="print-input-group"><label style={s.label}>Quantos atendimentos na semana:</label><input style={s.input} name="organizacaoAtendimentos" value={formData.organizacaoAtendimentos} onChange={handleChange} /></div>
          <div className="print-input-group"><label style={s.label}>Tempo de atendimento:</label><input style={s.input} name="organizacaoTempo" value={formData.organizacaoTempo} onChange={handleChange} /></div>
          <div className="print-input-group">
            <label style={s.label}>O tipo de atendimento:</label>
            <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
              <Checkbox label="Apoio" formData={formData} handleCheckbox={handleCheckbox} />
              <Checkbox label="Avaliação" formData={formData} handleCheckbox={handleCheckbox} />
            </div>
          </div>
          <div className="print-input-group">
            <label style={s.label}>Tem Diagnóstico?</label>
            <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
              <Checkbox label="Não tem diagnóstico" formData={formData} handleCheckbox={handleCheckbox} />
              <Checkbox label="Sim, tem diagnóstico" formData={formData} handleCheckbox={handleCheckbox} />
            </div>
            <input style={{...s.input, marginTop: '8px'}} name="qualDiagnostico" value={formData.qualDiagnostico} onChange={handleChange} placeholder="Qual diagnóstico?" />
          </div>
          <div className="print-input-group"><label style={s.label}>O aluno faz uso de medicações? Quais?</label><input style={s.input} name="medicamentos" value={formData.medicamentos} onChange={handleChange} /></div>
        </div>

        <div className="print-block" style={{...s.grid2, marginTop: '20px'}}>
          <div className="print-input-group">
            <label style={s.label}>Observação do aluno no contexto de sala de aula:</label>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '4px'}}>
              {['semanal','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira'].map(d => (
                <Checkbox key={`obs-${d}`} label={`Obs: ${d}`} formData={formData} handleCheckbox={handleCheckbox} />
              ))}
            </div>
            <div style={{marginTop: '8px'}}><label style={s.label}>quinzenal - Datas:</label><input style={s.input} name="organizacaoDatasObservacao" value={formData.organizacaoDatasObservacao} onChange={handleChange} /></div>
          </div>
          <div className="print-input-group">
            <label style={s.label}>Atendimento:</label>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '4px'}}>
              {['semanal','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira'].map(d => (
                <Checkbox key={`at-${d}`} label={`At: ${d}`} formData={formData} handleCheckbox={handleCheckbox} />
              ))}
            </div>
            <div style={{marginTop: '8px'}}><label style={s.label}>quinzenal - Datas:</label><input style={s.input} name="organizacaoDatasAtendimento" value={formData.organizacaoDatasAtendimento} onChange={handleChange} /></div>
          </div>
        </div>

        <div className="print-block" style={{marginTop: '15px'}}>
          <div className="print-input-group">
            <label style={s.label}>Atendimento familiar:</label>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '4px'}}>
              {['semanal','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira'].map(d => (
                <Checkbox key={`fam-${d}`} label={`Fam: ${d}`} formData={formData} handleCheckbox={handleCheckbox} />
              ))}
            </div>
            <div style={{marginTop: '8px'}}><label style={s.label}>quinzenal - Datas:</label><input style={s.input} name="organizacaoDatasAtendimentoFamiliar" value={formData.organizacaoDatasAtendimentoFamiliar} onChange={handleChange} /></div>
          </div>
        </div>

        <div className="print-block" style={{...s.grid2, marginTop: '15px'}}>
          <div className="print-input-group">
            <label style={s.label}>O aluno necessita de Monitor de apoio?</label>
            <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
              <Checkbox label="Sim (monitor de apoio)" formData={formData} handleCheckbox={handleCheckbox} />
              <Checkbox label="Não (monitor de apoio)" formData={formData} handleCheckbox={handleCheckbox} />
            </div>
          </div>
          <div className="print-input-group">
            <label style={s.label}>O aluno necessita de Apoio direto do Monitor?</label>
            <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
              <Checkbox label="Sim (apoio direto)" formData={formData} handleCheckbox={handleCheckbox} />
              <Checkbox label="Não (apoio direto)" formData={formData} handleCheckbox={handleCheckbox} />
              <Checkbox label="Em alguns momentos" formData={formData} handleCheckbox={handleCheckbox} />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel card-print">
        <div style={s.cardHeader}><span className="badge-print" style={s.badge}>VI</span> Áreas de Desenvolvimento (Foco do AEE)</div>
        <div className="print-block" style={s.grid3}>
          <div className="print-input-group">
            <h4>Coordenação Motora</h4>
            <Checkbox label="Coordenação motora grossa" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Coordenação motora fina" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Coordenação grafomotora" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Esquema corporal" formData={formData} handleCheckbox={handleCheckbox} />
          </div>
          <div className="print-input-group">
            <h4>Comunicação e Linguagem</h4>
            <Checkbox label="Compreensão verbal" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Raciocínio Verbal" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Fluência Verbal" formData={formData} handleCheckbox={handleCheckbox} />
          </div>
          <div className="print-input-group">
            <h4>Memória</h4>
            <Checkbox label="Memória visual" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Memória auditiva" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Memória verbal e numérica" formData={formData} handleCheckbox={handleCheckbox} />
          </div>
        </div>

        <div className="print-block" style={{...s.grid2, marginTop: '15px'}}>
          <div className="print-input-group">
            <h4>Aprendizagem</h4>
            <Checkbox label="Compreensão do Alfabeto" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Compreensão dos Números" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Compreensão da Leitura" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Compreensão da produção textual" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Compreensão das operações matemáticas" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Desenvolvimento das fases da escrita" formData={formData} handleCheckbox={handleCheckbox} />
          </div>
          <div className="print-input-group">
            <h4>Lateralidade e Noções Espaciais</h4>
            <Checkbox label="Direita e esquerda" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Pequeno e grande / Perto e Longe" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Em cima e embaixo / Fora e dentro" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Cheio e vazio / Fechado e aberto" formData={formData} handleCheckbox={handleCheckbox} />
          </div>
        </div>

        <div className="print-block" style={{...s.grid2, marginTop: '15px'}}>
          <div className="print-input-group">
            <h4>Percepção</h4>
            <Checkbox label="Visual" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Auditiva" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Tátil" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Sinestésica" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Temporal" formData={formData} handleCheckbox={handleCheckbox} />
          </div>
          <div className="print-input-group">
            <label style={s.label}>Outros:</label>
            <input style={s.input} name="outrosAEE" value={formData.outrosAEE} onChange={handleChange} placeholder="Outras necessidades..." />
          </div>
        </div>

        <div className="print-block print-input-group" style={{marginTop: '25px'}}>
          <label style={s.label}>Relatório Final:</label>
          <TextareaPrint name="objetivosAEE" value={formData.objetivosAEE} onChange={handleChange} placeholder="Descreva o relatório final do atendimento..." minHeight="150px" />
        </div>
      </div>

      <div className="glass-panel card-print section-break">
        <div style={s.cardHeader}><span className="badge-print" style={s.badge}>VII</span> Momentos AEE</div>
        <div className="print-block" style={s.grid2}>
          <FileUpload label="Adicionar Foto (Momento 1)" campoID="momento_aee_1" />
          <FileUpload label="Adicionar Foto (Momento 2)" campoID="momento_aee_2" />
        </div>
      </div>

      <div className="glass-panel card-print section-break">
        <div className="print-only" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px', flexWrap: 'wrap', gap: '20px' }}>
          {['Diretor(a)', 'Coordenador(a)', 'Prof. AEE', 'Prof. Regente', 'Responsável'].map(role => (<div key={role} style={{ flex: '1', minWidth: '130px', textAlign: 'center' }}><div style={{ borderBottom: '1px solid black', marginBottom: '10px', height: '30px' }}></div><p style={{ fontWeight: 'bold', margin: 0, fontSize: '9pt' }}>{role}</p></div>))}
        </div>
      </div>

      {zoomImg && (
        <div className="no-print" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'zoom-out' }} onClick={() => setZoomImg(null)}>
          <img src={zoomImg} alt="Zoom" style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '8px', border: '3px solid white', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }} />
          <p style={{ color: 'white', marginTop: '15px', fontWeight: 'bold', fontSize: '1.1rem' }}>Clique em qualquer lugar para fechar</p>
        </div>
      )}
    </div>
  );
};

// 5. COMPONENTE PRINCIPAL
export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [telaAtiva, setTelaAtiva] = useState('lista'); 
  const [alunoEditando, setAlunoEditando] = useState(null);

  useEffect(() => { const unsubscribe = onAuthStateChanged(auth, (user) => { setUsuario(user); setCarregando(false); }); return () => unsubscribe(); }, []);
  
  const fazerLogout = () => signOut(auth);
  const irParaNovoPEI = () => { localStorage.removeItem('rascunhoPEI'); setAlunoEditando(null); setTelaAtiva('formularioPEI'); };
  const irParaNovoPAEE = () => { localStorage.removeItem('rascunhoPAEE'); setAlunoEditando(null); setTelaAtiva('formularioPAEE'); };
  const irParaEditar = (aluno) => { setAlunoEditando(aluno); setTelaAtiva(aluno.tipoDocumento === 'PAEE' ? 'formularioPAEE' : 'formularioPEI'); };

  if (carregando) return <div style={{ textAlign: 'center', marginTop: '50px' }}>A carregar o ambiente pedagógico...</div>;
  if (!usuario) return <LoginScreen />;
  
  if (telaAtiva === 'lista') return <ListaAlunos onNovoPEI={irParaNovoPEI} onNovoPAEE={irParaNovoPAEE} onEditar={irParaEditar} onLogout={fazerLogout} usuario={usuario} />;
  if (telaAtiva === 'formularioPAEE') return <SistemaPAEE alunoData={alunoEditando} onVoltar={() => setTelaAtiva('lista')} usuario={usuario} />;
  return <SistemaPEI alunoData={alunoEditando} onVoltar={() => setTelaAtiva('lista')} usuario={usuario} />;
}
