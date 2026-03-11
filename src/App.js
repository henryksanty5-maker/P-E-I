import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { getDatabase, ref, set, onValue, remove } from 'firebase/database';

// IMPORTAÇÃO DA IMAGEM: Esta linha é essencial!
// Certifique-se de que o arquivo "logo_pei.png" está na mesma pasta que este App.js
import logoPei from './logo_pei.png'; 

// 1. Configuração do Firebase (SEU BANCO DE DADOS ATIVO)
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

// --- ESTILOS MODERNOS (Paleta: Verde e Vermelho da Cidade) ---
const s = {
  page: { minHeight: '100vh', padding: '30px 20px', color: '#1e293b' },
  topbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 25px', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' },
  profile: { display: 'flex', alignItems: 'center', gap: '15px' },
  avatar: { width: '48px', height: '48px', background: 'linear-gradient(135deg, #059669 0%, #ef4444 100%)', color: 'white', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(5, 150, 105, 0.3)' },
  btnGroup: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  
  // Botões com Gradientes (Verde e Vermelho)
  btnPrimary: { background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', letterSpacing: '0.5px' },
  btnSuccess: { background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', letterSpacing: '0.5px' },
  btnSecondary: { background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', color: '#334155', border: '1px solid #cbd5e1', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  btnDanger: { background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', color: '#dc2626', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  
  card: { padding: '28px', marginBottom: '24px' },
  cardHeader: { color: '#059669', fontSize: '1.25rem', fontWeight: '700', borderBottom: '2px solid rgba(16, 185, 129, 0.1)', paddingBottom: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' },
  badge: { background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', color: '#065f46', padding: '6px 12px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
  
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' },
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' },
  
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' },
  label: { fontWeight: '600', color: '#334155', fontSize: '0.95rem' },
  input: { padding: '12px', border: '1px solid rgba(203, 213, 225, 0.6)', borderRadius: '8px', width: '100%', boxSizing: 'border-box', backgroundColor: 'rgba(255, 255, 255, 0.9)', outline: 'none', fontSize: '0.95rem', transition: 'all 0.3s ease' },
  
  checkboxContainer: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', cursor: 'pointer', padding: '6px 8px', borderRadius: '6px' },
  uploadBox: { border: '2px dashed #a7f3d0', borderRadius: '12px', padding: '20px', textAlign: 'center', backgroundColor: 'rgba(209, 250, 229, 0.4)', marginTop: '10px' },
  sectionTitle: { color: '#1e293b', marginBottom: '15px', fontSize: '1.05rem', borderBottom: '1px solid rgba(203, 213, 225, 0.5)', paddingBottom: '8px', fontWeight: '600' }
};

// --- CSS GLOBAL (Animações e Fonte Poppins) ---
const GlobalCSS = () => (
  <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
      
      body {
        font-family: 'Poppins', sans-serif !important;
        margin: 0;
        background-color: #f0f4f8;
        background-image: radial-gradient(at 0% 0%, hsla(158,100%,76%,0.08) 0px, transparent 50%),
                          radial-gradient(at 100% 0%, hsla(0,100%,76%,0.05) 0px, transparent 50%),
                          radial-gradient(at 100% 100%, hsla(158,100%,76%,0.08) 0px, transparent 50%);
        background-attachment: fixed;
      }

      .glass-panel {
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.6);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
        border-radius: 16px;
      }

      button { transition: all 0.3s ease !important; }
      button:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15); filter: brightness(1.05); }
      button:active { transform: translateY(0); }
      input:focus, textarea:focus { border-color: #10b981 !important; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2) !important; background-color: #ffffff !important; }
      label.checkbox-row:hover { background-color: rgba(209, 250, 229, 0.5); }

      @media screen { .print-only { display: none !important; } }
      @media print {
        body { background: white !important; }
        .no-print { display: none !important; }
        .print-only { display: block !important; }
        .glass-panel { background: white !important; border: none !important; box-shadow: none !important; padding: 10px 0 !important; margin-bottom: 20px !important; }
        input, textarea { border: none !important; border-bottom: 1px dashed #999 !important; border-radius: 0 !important; background: transparent !important; padding: 5px 0 !important; color: black !important; }
        textarea { height: auto !important; min-height: 40px !important; }
        h1, h3, h4 { color: black !important; }
        .badge-print { background: none !important; color: black !important; border: 1px solid black; padding: 2px 6px; }
      }
    `}
  </style>
);

// 2. Tela de Login (COM A NOVA IMAGEM E CORES DA CIDADE)
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro(''); setMensagem('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setErro('E-mail ou senha incorretos. Tente novamente.');
    }
  };

  const handleEsqueciSenha = async () => {
    if (!email) {
      setErro('Por favor, digite o seu e-mail acima antes de clicar em mudar a senha.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMensagem('E-mail enviado! Verifique a sua caixa de entrada para criar a nova senha.');
      setErro('');
    } catch (error) {
      setErro('Erro ao enviar e-mail. Verifique se o e-mail está digitado corretamente.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: '20px' }}>
      <GlobalCSS />
      <div className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '420px', textAlign: 'center' }}>
        
        {/* EXIBIÇÃO DA NOVA IMAGEM PEDAGÓGICA */}
        <img 
          src={logoPei} 
          alt="Sistema PEI - Construindo caminhos individualizados para cada aluno" 
          style={{ maxWidth: '100%', height: 'auto', marginBottom: '30px', borderRadius: '12px' }} 
        />
        
        {erro && <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center', fontWeight: '500' }}>{erro}</div>}
        {mensagem && <div style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center', fontWeight: '500' }}>{mensagem}</div>}
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input type="email" placeholder="E-mail institucional" value={email} onChange={(e) => setEmail(e.target.value)} style={s.input} required />
          <input type="password" placeholder="Senha de acesso" value={password} onChange={(e) => setPassword(e.target.value)} style={s.input} required />
          <button type="submit" style={{...s.btnPrimary, padding: '14px', fontSize: '1.05rem', marginTop: '10px'}}>Acessar Plataforma</button>
        </form>
        
        <div style={{ marginTop: '25px', textAlign: 'center' }}>
          <button type="button" onClick={handleEsqueciSenha} style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500' }}>
            Esqueci ou quero mudar a minha senha
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. Tela de Lista de Alunos (COM NOVAS CORES VERDE E VERMELHO)
const ListaAlunos = ({ onNovo, onEditar, onLogout, usuario }) => {
  const [alunos, setAlunos] = useState([]);

  // 🌟 AQUI FICA A SUA LISTA VIP: Digite os e-mails reais aqui!
  const listaEspecialistas = [
    'seu_email_aqui@gmail.com', // <--- COLOQUE SEU E-MAIL AQUI
    'direcao@escola.com'        // Pode colocar o da direção ou apagar essa linha
  ];
  
  const isEspecialista = listaEspecialistas.includes(usuario.email);

  useEffect(() => {
    const dbRef = ref(db, 'alunos');
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        let lista = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        if (!isEspecialista) {
          lista = lista.filter(aluno => aluno.criadoPor === usuario.email);
        }
        setAlunos(lista);
      } else {
        setAlunos([]);
      }
    });
  }, [usuario.email, isEspecialista]);

  const deletarAluno = async (id) => {
    if(window.confirm(`Tem certeza que deseja excluir o PEI do(a) ${id}? Esta ação não pode ser desfeita.`)) {
      await remove(ref(db, `alunos/${id}`));
    }
  };

  return (
    <div style={s.page}>
      <GlobalCSS />
      {/* BARRA SUPERIOR DO DASHBOARD COM CORES DA CIDADE */}
      <div className="glass-panel no-print" style={s.topbar}>
        <div style={s.profile}>
          <div style={s.avatar}>{usuario.email.substring(0,2).toUpperCase()}</div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', fontWeight: '600' }}>Painel do Professor</h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>
              {isEspecialista ? 'Especialista / Admin' : 'Professor Regente'} • {usuario.email}
            </p>
          </div>
        </div>
        <div style={s.btnGroup}>
          <button style={s.btnPrimary} onClick={onNovo}>+ Novo PEI</button>
          <button style={s.btnDanger} onClick={onLogout}>Sair</button>
        </div>
      </div>

      <h1 style={{ color: '#0f172a', marginBottom: '25px', fontSize: '1.8rem', fontWeight: '700' }}>
        {isEspecialista ? 'Visão Global da Escola' : 'Meus Alunos'}
      </h1>

      {alunos.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
          <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '15px' }}>📂</span>
          <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>Nenhum aluno cadastrado no seu perfil.</p>
          <p style={{ fontSize: '0.9rem' }}>Clique em "Novo PEI" no topo da tela para começar.</p>
        </div>
      ) : (
        <div style={s.grid3}>
          {alunos.map((aluno) => (
            <div key={aluno.id} className="glass-panel" style={{...s.card, marginBottom: '0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
              <div>
                <h3 style={{ color: '#059669', margin: '0 0 12px 0', fontSize: '1.3rem', fontWeight: '600' }}>{aluno.aluno}</h3>
                <div style={{ backgroundColor: 'rgba(209, 250, 229, 0.4)', padding: '12px', borderRadius: '8px', marginBottom: '15px' }}>
                  <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#334155' }}><strong>Ano/Série:</strong> {aluno.anoSerie || '-'} {aluno.turma}</p>
                  <p style={{ margin: '0', fontSize: '0.9rem', color: '#334155' }}><strong>Diagnóstico:</strong> {aluno.diagnostico || 'Não informado'}</p>
                </div>
                <p style={{ margin: '0 0 20px 0', fontSize: '0.75rem', color: '#94a3b8', fontWeight: '500' }}>Criado por: {aluno.criadoPor || 'Legado (Sem dono)'}</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button style={{...s.btnSecondary, flex: '1', backgroundColor: 'white'}} onClick={() => onEditar(aluno)}>Abrir / Editar</button>
                <button style={{...s.btnSuccess, padding: '10px'}} onClick={() => deletarAluno(aluno.id)}>✓ Fechar PEI</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 4. Tela do Formulário (COM NOVAS CORES VERDE E VERMELHO)
const SistemaPEI = ({ alunoData, onVoltar, onLogout, usuario }) => {
  const estadoInicial = {
    aluno: '', nascimento: '', anoSerie: '', turma: '', responsaveis: '', esco: 'EMEIEF "PROFESSORA EDNA REGINA DE OLIVEIRA E SILVA"', diagnostico: '', cid: '', crm: '', resultadoAvaliacao: '', rotinaFamiliar: '', fatoresAmbientais: '', resumoAluno: '', campoLinguagem: '', campoMatematica: '', anexos: {}, conteudos: {}, diario: {}, opcoes: {} 
  };

  const [formData, setFormData] = useState(() => {
    if (alunoData) { return { ...estadoInicial, ...alunoData, anexos: alunoData.anexos || {}, conteudos: alunoData.conteudos || {}, diario: alunoData.diario || {}, opcoes: alunoData.opcoes || {} }; }
    return estadoInicial;
  });

  const [aEnviar, setAEnviar] = useState(false);
  const disciplinas = ['Língua Portuguesa', 'Matemática', 'Ciências', 'História', 'Geografia', 'Artes', 'Educação Física', 'Inglês', 'Informática'];
  const bimestres = ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'];

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleCheckbox = (opcao) => setFormData(prev => ({ ...prev, opcoes: { ...(prev.opcoes || {}), [opcao]: !(prev.opcoes || {})[opcao] } }));
  const handleNestedText = (categoria, chave, valor) => setFormData(prev => ({ ...prev, [categoria]: { ...(prev[categoria] || {}), [chave]: valor } }));

  const salvarNoBanco = async () => {
    if (!formData.aluno) { alert("Por favor, preencha o nome do aluno antes de salvar."); return; }
    const dadosParaSalvar = { ...formData, criadoPor: formData.criadoPor || usuario.email };
    try {
      await set(ref(db, 'alunos/' + formData.aluno), dadosParaSalvar);
      alert(`✅ Dados salvos com sucesso na nuvem!`);
    } catch (error) { alert("Erro ao salvar os dados. Verifique a sua conexão."); }
  };

  const gerarPDF = () => window.print();

  const handleFileUpload = (e, campoID) => {
    const file = e.target.files[0];
    if (!file) return;
    setAEnviar(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scaleSize = 700 / img.width; canvas.width = 700; canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setFormData(prev => ({ ...prev, anexos: { ...(prev.anexos || {}), [campoID]: canvas.toDataURL('image/jpeg', 0.6) } }));
        setAEnviar(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const removerAnexo = (campoID) => {
    setFormData(prev => { const novosAnexos = { ...(prev.anexos || {}) }; delete novosAnexos[campoID]; return { ...prev, anexos: novosAnexos }; });
  };

  const Checkbox = ({ label }) => (
    <label className="checkbox-row" style={s.checkboxContainer}>
      <input type="checkbox" checked={!!(formData.opcoes || {})[label]} onChange={() => handleCheckbox(label)} style={{ width: '18px', height: '18px', accentColor: '#10b981' }} />
      <span style={{ fontSize: '0.95rem', color: '#334155', fontWeight: '500' }}>{label}</span>
    </label>
  );

  const FileUpload = ({ label, campoID }) => (
    <div className="no-print" style={s.uploadBox}>
      {formData.anexos && formData.anexos[campoID] ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src={formData.anexos[campoID]} alt="Anexo" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', border: '1px solid #a7f3d0', objectFit: 'contain', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }} />
          <button type="button" onClick={() => removerAnexo(campoID)} style={{ marginTop: '12px', padding: '8px 16px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>Remover Imagem</button>
        </div>
      ) : (
        <>
          <span style={{ fontSize: '2rem' }}>📷</span>
          <p style={{ margin: '8px 0', fontWeight: '600', color: '#059669', fontSize: '0.95rem' }}>{label}</p>
          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, campoID)} style={{ fontSize: '0.85rem', marginTop: '8px', maxWidth: '100%', color: '#64748b' }} disabled={aEnviar} />
          {aEnviar && <span style={{fontSize: '0.85rem', color: '#ef4444', display: 'block', marginTop: '8px', fontWeight: '500'}}>Processando...</span>}
        </>
      )}
    </div>
  );

  return (
    <div className="print-page" style={s.page}>
      <GlobalCSS />
      {/* BARRA SUPERIOR DO EDITOR */}
      <div className="glass-panel no-print" style={s.topbar}>
        <div style={s.profile}>
          <div style={s.avatar}>{usuario.email.substring(0,2).toUpperCase()}</div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', fontWeight: '600' }}>Editor do PEI</h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>{usuario.email}</p>
          </div>
        </div>
        <div style={s.btnGroup}>
          <button style={s.btnSecondary} onClick={onVoltar}>← Voltar à Lista</button>
          <button style={s.btnPrimary} onClick={salvarNoBanco}>✓ Salvar na Nuvem</button>
          <button style={{...s.btnSuccess}} onClick={gerarPDF}>🖨️ Gerar PDF</button>
        </div>
      </div>

      {/* CABEÇALHO DE IMPRESSÃO */}
      <div className="print-only" style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid black', paddingBottom: '15px' }}>
        <h2 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>PREFEITURA MUNICIPAL DE REDENÇÃO DA SERRA</h2>
        <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>SECRETARIA MUNICIPAL DE EDUCAÇÃO</h3>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem' }}>EMEIEF “PROFESSORA EDNA REGINA DE OLIVEIRA E SILVA”</h3>
        <h1 style={{ marginTop: '20px', fontSize: '1.4rem', textTransform: 'uppercase' }}>Plano Educacional Individualizado – PEI</h1>
      </div>

      <h1 className="no-print" style={{ color: '#0f172a', marginBottom: '25px', fontSize: '1.8rem', fontWeight: '700' }}>
        {alunoData ? 'Editando Documento' : 'Novo Documento'}
      </h1>

      {/* A. IDENTIFICAÇÃO */}
      <div className="glass-panel card-print" style={s.card}>
        <div style={s.cardHeader}><span className="badge-print" style={s.badge}>A</span> Identificação do Aluno</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '30px' }}>
          <div className="no-print"><FileUpload label="Selecionar Foto" campoID="foto_perfil" /></div>
          <div style={s.grid2}>
            <div style={s.inputGroup}><label style={s.label}>Nome do Aluno *</label><input style={s.input} name="aluno" value={formData.aluno} onChange={handleChange} /></div>
            <div style={s.inputGroup}><label style={s.label}>Data de Nascimento</label><input style={s.input} name="nascimento" value={formData.nascimento} onChange={handleChange} /></div>
            <div style={s.inputGroup}><label style={s.label}>Ano/Série</label><input style={s.input} name="anoSerie" value={formData.anoSerie} onChange={handleChange} /></div>
            <div style={s.inputGroup}><label style={s.label}>Turma</label><input style={s.input} name="turma" value={formData.turma} onChange={handleChange} /></div>
            <div style={{...s.inputGroup, gridColumn: '1 / -1'}}><label style={s.label}>Responsáveis</label><input style={s.input} name="responsaveis" value={formData.responsaveis} onChange={handleChange} /></div>
          </div>
        </div>
      </div>

      {/* B. CLÍNICAS */}
      <div className="glass-panel card-print" style={s.card}>
        <div style={s.cardHeader}><span className="badge-print" style={s.badge}>B</span> Informações Clínicas</div>
        <div style={s.grid3}>
          <div style={s.inputGroup}><label style={s.label}>Diagnóstico</label><input style={s.input} name="diagnostico" value={formData.diagnostico} onChange={handleChange} /><FileUpload label="Anexar Laudo" campoID="laudo_medico" /></div>
          <div style={s.inputGroup}><label style={s.label}>Códigos CID</label><input style={s.input} name="cid" value={formData.cid} onChange={handleChange} /></div>
          <div style={s.inputGroup}><label style={s.label}>CRM do Médico</label><input style={s.input} name="crm" value={formData.crm} onChange={handleChange} /></div>
        </div>
      </div>

      {/* C. MEDICAÇÃO, TERAPIAS E ADAPTAÇÕES (NOVOS CAMPOS) */}
      <div className="glass-panel card-print" style={s.card}>
        <div style={s.cardHeader}><span className="badge-print" style={s.badge}>C</span> Medicação, Terapias e Adaptações Curriculares</div>
        <div style={s.grid2}>
          <div><Checkbox label="O aluno utiliza medicação?" /><FileUpload label="Anexar Receita" campoID="receita_medica" /></div>
          <div><Checkbox label="O aluno tem acompanhamento terapêutico?" /></div>
        </div>
        <div style={{...s.grid2, marginTop: '20px'}}>
          <div style={s.inputGroup}><label style={s.label}>Campo de Experiência: Linguagem</label><textarea style={{...s.input, minHeight: '80px'}} name="campoLinguagem" value={formData.campoLinguagem} onChange={handleChange} placeholder="Adaptações e objetivos para a área da linguagem..."></textarea></div>
          <div style={s.inputGroup}><label style={s.label}>Campo de Experiência: Matemática</label><textarea style={{...s.input, minHeight: '80px'}} name="campoMatematica" value={formData.campoMatematica} onChange={handleChange} placeholder="Adaptações e objetivos para a área da matemática..."></textarea></div>
        </div>
        <div style={{ marginTop: '20px' }}><h4 style={s.sectionTitle}>Especialistas que acompanham o aluno:</h4><div style={s.grid3}><Checkbox label="Neurologista" /><Checkbox label="Psicólogo" /><Checkbox label="Fonoaudiólogo" /><Checkbox label="Psicopedagogo" /><Checkbox label="Terapeuta Ocupacional" /><Checkbox label="Psicomotricidade" /><Checkbox label="ABA / TCC" /></div></div>
      </div>

      {/* D. AVALIAÇÃO DIAGNÓSTICA E CONTEXTUAL */}
      <div className="glass-panel card-print" style={s.card}>
        <div style={s.cardHeader}><span className="badge-print" style={s.badge}>D</span> Avaliação Diagnóstica e Contextual</div>
        <div style={s.grid2}>
          <div style={s.inputGroup}><label style={s.label}>Resultado da Avaliação Diagnóstica</label><textarea style={{...s.input, minHeight: '100px'}} name="resultadoAvaliacao" value={formData.resultadoAvaliacao} onChange={handleChange} placeholder="Estágio atual de aprendizagem..."></textarea></div>
          <div style={s.inputGroup}><label style={s.label}>Evidência / Avaliação</label><FileUpload label="Anexar Avaliação" campoID="avaliacao_diagnostica" /></div>
        </div>
        <div style={{...s.grid2, marginTop: '20px'}}><div style={s.inputGroup}><label style={s.label}>Aspectos da Rotina Familiar</label><textarea style={{...s.input, minHeight: '80px'}} name="rotinaFamiliar" value={formData.rotinaFamiliar} onChange={handleChange}></textarea></div><div style={s.inputGroup}><label style={s.label}>Fatores Ambientais Facilitadores/Barreiras</label><textarea style={{...s.input, minHeight: '80px'}} name="fatoresAmbientais" value={formData.fatoresAmbientais} onChange={handleChange}></textarea></div></div>
      </div>

      {/* E. ADAPTAÇÕES CURRICULARES */}
      <div className="glass-panel card-print" style={s.card}>
        <div style={s.cardHeader}><span className="badge-print" style={s.badge}>E</span> Adaptações Curriculares</div>
        <div style={s.grid3}>
          {disciplinas.map((disc) => (
            <div key={disc} style={{ border: '1px solid rgba(203, 213, 225, 0.5)', borderRadius: '10px', padding: '18px', backgroundColor: 'rgba(209, 250, 229, 0.2)' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#065f46', borderBottom: '1px solid #a7f3d0', paddingBottom: '8px' }}>{disc}</h4>
              <Checkbox label={`${disc} - Priorização de conteúdos`} />
              <Checkbox label={`${disc} - Introdução de conteúdos alternativos`} />
              <div style={{...s.inputGroup, marginTop: '12px'}}><label style={{...s.label, fontSize: '0.85rem'}}>Conteúdo Ministrado:</label><textarea style={{...s.input, minHeight: '60px', fontSize: '0.9rem'}} value={(formData.conteudos || {})[disc] || ''} onChange={(e) => handleNestedText('conteudos', disc, e.target.value)} /></div>
            </div>
          ))}
        </div>
      </div>

      {/* H. MÉTODOS DE AVALIAÇÃO (NOVO CAMPO) */}
      <div className="glass-panel card-print" style={s.card}>
        <div style={s.cardHeader}><span className="badge-print" style={s.badge}>H</span> Métodos de Avaliação</div>
        <div style={s.grid3}><Checkbox label="Sondagem pedagógica" /><Checkbox label="Múltipla escolha (objetiva)" /><Checkbox label="Resposta oral" /><Checkbox label="Exercícios práticos" /><Checkbox label="Trabalhos escritos/orais" /></div>
      </div>

      {/* I. DIÁRIO DO ALUNO (COM IMAGENS) */}
      <div className="glass-panel card-print" style={s.card}>
        <div style={s.cardHeader}><span className="badge-print" style={s.badge}>I</span> Diário do Aluno (Acompanhamento Bimestral)</div>
        <div style={s.grid2}>
          {bimestres.map((bim, index) => (
            <div key={bim} style={{ border: '1px solid rgba(203, 213, 225, 0.5)', borderRadius: '10px', padding: '18px', backgroundColor: 'rgba(209, 250, 229, 0.2)' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#065f46' }}>{bim}</h4>
              <textarea style={{...s.input, minHeight: '80px'}} placeholder="Evolução, observações e conquistas..." value={(formData.diario || {})[bim] || ''} onChange={(e) => handleNestedText('diario', bim, e.target.value)} />
              <FileUpload label="Anexar Evidência / Atividade" campoID={`diario_bimestre_${index+1}`} />
            </div>
          ))}
        </div>
      </div>

      {/* J. REVISÃO FINAL */}
      <div className="glass-panel card-print" style={s.card}>
        <div style={s.cardHeader}><span className="badge-print" style={s.badge}>J</span> Revisão Final e Observações</div>
        <div style={s.inputGroup}><label style={s.label}>Resumo do Aluno (Pontos Fortes, Dificuldades e Recomendações)</label><textarea style={{...s.input, minHeight: '120px'}} name="resumoAluno" value={formData.resumoAluno} onChange={handleChange}></textarea></div>
        <div className="print-only" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px', flexWrap: 'wrap', gap: '20px' }}>
          {['Professor(a)', 'Direção / Coordenação', 'Pais/Responsáveis'].map(role => (<div key={role} style={{ flex: '1', minWidth: '150px', textAlign: 'center' }}><div style={{ borderBottom: '1px solid black', marginBottom: '10px', height: '30px' }}></div><p style={{ fontWeight: 'bold', margin: 0 }}>{role}</p></div>))}
        </div>
      </div>

    </div>
  );
};

// 5. Componente Principal
export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [telaAtiva, setTelaAtiva] = useState('lista');
  const [alunoEditando, setAlunoEditando] = useState(null);

  useEffect(() => { const unsubscribe = onAuthStateChanged(auth, (user) => { setUsuario(user); setCarregando(false); }); return () => unsubscribe(); }, []);
  const fazerLogout = () => signOut(auth);
  const irParaNovoFormulario = () => { setAlunoEditando(null); setTelaAtiva('formulario'); };
  const irParaEditarFormulario = (aluno) => { setAlunoEditando(aluno); setTelaAtiva('formulario'); };

  if (carregando) return <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif', color: '#64748b' }}>A carregar o ambiente pedagógico...</div>;
  if (!usuario) return <LoginScreen />;
  if (telaAtiva === 'lista') return <ListaAlunos onNovo={irParaNovoFormulario} onEditar={irParaEditarFormulario} onLogout={fazerLogout} usuario={usuario} />;
  return <SistemaPEI alunoData={alunoEditando} onVoltar={() => setTelaAtiva('lista')} onLogout={fazerLogout} usuario={usuario} />;
}
