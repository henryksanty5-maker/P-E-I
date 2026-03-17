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

// --- ESTILOS MODERNOS DA TELA ---
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

// --- CSS GLOBAL: OPÇÃO NUCLEAR CONTRA O GOOGLE CHROME ---
const GlobalCSS = () => (
/* FORÇA BRUTA DE IMPRESSÃO (SEM CORTES, SEM PÁGINAS BRANCAS) */
      @media print {
        @page { margin: 15mm; }

        /* 1. AS SUAS REGRAS GENIAIS DE RESET */
        * {
          background: transparent !important;
          color: black !important;
          box-shadow: none !important;
          position: static !important;
          overflow: visible !important;
          box-sizing: border-box !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          filter: none !important;
          transform: none !important;
        }

        h1, h2, h3, h4, h5, h6, p, label, span {
          margin: 0 0 5px 0 !important;
          padding: 0 !important;
        }

        html, body, #root, .print-page {
          width: 100% !important;
          height: auto !important;
          min-height: 0 !important;
          display: block !important;
        }

        .no-print { display: none !important; }
        .print-only { display: block !important; }

        /* 2. ESTRUTURA DOS CARTÕES */
        div, .print-block, .glass-panel, .card-print {
          display: block !important;
          width: 100% !important;
          margin: 0 0 10px 0 !important;
          border: none !important;
          /* Deixamos o cartão quebrar se for gigante, para não dar o bug da tela branca */
          page-break-inside: auto !important; 
        }

        /* 🌟 3. AS SUAS REGRAS DE PAGINAÇÃO (APLICADAS COM SEGURANÇA) 🌟 */
        
        /* Impede que o cabeçalho fique sozinho no final de uma página */
        h1, h2, h3, h4, .cardHeader, .sectionTitle {
          page-break-after: avoid !important;
          break-after: avoid !important;
        }

        /* Impede que um pequeno bloco de input ou checkbox seja cortado ao meio */
        .print-input-group, .inputGroup, label.checkbox-row {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        /* A sua classe para forçar quebra de página (Ex: Assinaturas em nova folha) */
        .section-break {
          page-break-before: always !important;
          break-before: page !important;
        }

        /* ------------------------------------------------------------- */

        .card-print > div:first-child {
          border-bottom: 2px solid black !important;
          padding-bottom: 5px !important;
          margin-bottom: 10px !important;
        }

        input:not([type="checkbox"]), textarea {
          border: none !important;
          border-bottom: 1px solid black !important;
          border-radius: 0 !important;
          width: 100% !important;
          padding: 2px 0 5px 0 !important;
          font-family: Arial, sans-serif !important;
          font-size: 11pt !important;
          height: auto !important;
          min-height: 25px !important;
          white-space: pre-wrap !important;
        }

        label {
          font-weight: bold !important;
          margin-top: 15px !important;
          display: block !important;
        }

        label.checkbox-row {
          display: flex !important;
          align-items: center !important;
          margin: 6px 0 !important;
          font-weight: normal !important;
        }
        
        label.checkbox-row input[type="checkbox"] {
          width: auto !important;
          margin-right: 8px !important;
          display: inline-block !important;
        }

        .badge-print { border: 1px solid black !important; }
      }
const Checkbox = ({ label, formData, handleCheckbox }) => (
  <label className="checkbox-row" style={s.checkboxContainer}>
    <input type="checkbox" checked={!!(formData.opcoes || {})[label]} onChange={() => handleCheckbox(label)} style={{ width: '18px', height: '18px', accentColor: '#10b981' }} />
    <span style={{ fontSize: '0.95rem', color: '#334155', fontWeight: '500' }}>{label}</span>
  </label>
);

// 2. Tela de Login
const LoginScreen = () => {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
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

// 3. Tela de Lista de Alunos (DASHBOARD)
const ListaAlunos = ({ onNovoPEI, onNovoPAEE, onEditar, onLogout, usuario }) => {
  const [alunos, setAlunos] = useState([]);

  // 🌟 AQUI FICA A SUA LISTA VIP:
  const listaEspecialistas = [
    'henryksanty5@gmail.com',
    'escolajac663@gmail.com',
    'direcao@escola.com'
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
  const [formData, setFormData] = useState(() => { return alunoData ? { ...estadoInicial, ...alunoData, anexos: alunoData.anexos || {} } : estadoInicial; });
  const [aEnviar, setAEnviar] = useState(false);
  const disciplinas = ['Língua Portuguesa', 'Matemática', 'Ciências', 'História', 'Geografia', 'Artes', 'Educação Física', 'Inglês', 'Informática'];
  const bimestres = ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'];

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleCheckbox = (opcao) => setFormData(prev => ({ ...prev, opcoes: { ...(prev.opcoes || {}), [opcao]: !(prev.opcoes || {})[opcao] } }));
  const handleNestedText = (cat, chave, valor) => setFormData(prev => ({ ...prev, [cat]: { ...(prev[cat] || {}), [chave]: valor } }));

  const salvarNoBanco = async () => {
    if (!formData.aluno) { alert("Preencha o nome do aluno."); return; }
    const dadosParaSalvar = { ...formData, criadoPor: formData.criadoPor || usuario.email };
    const dbKey = alunoData?.dbKey || `${formData.aluno} (PEI)`; 
    try { await set(ref(db, `alunos/${dbKey}`), dadosParaSalvar); alert(`✅ PEI salvo na nuvem!`); } 
    catch (error) { alert("Erro ao salvar."); }
  };

  const handleFileUpload = (e, campoID) => {
    const file = e.target.files[0]; if (!file) return;
    setAEnviar(true); const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas'); const scaleSize = 700 / img.width; canvas.width = 700; canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setFormData(prev => ({ ...prev, anexos: { ...(prev.anexos || {}), [campoID]: canvas.toDataURL('image/jpeg', 0.6) } }));
        setAEnviar(false);
      }; img.src = event.target.result;
    }; reader.readAsDataURL(file);
  };

  const removerAnexo = (campoID) => {
    setFormData(prev => { const novosAnexos = { ...(prev.anexos || {}) }; delete novosAnexos[campoID]; return { ...prev, anexos: novosAnexos }; });
  };

  const FileUpload = ({ label, campoID }) => (
    <div className="no-print" style={s.uploadBox}>
      {formData.anexos && formData.anexos[campoID] ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src={formData.anexos[campoID]} alt="Anexo" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', border: '1px solid #a7f3d0' }} />
          <button type="button" onClick={() => removerAnexo(campoID)} style={{ marginTop: '12px', padding: '8px 16px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Remover Imagem</button>
        </div>
      ) : (
        <>
          <span style={{ fontSize: '2rem' }}>📷</span><p style={{ margin: '8px 0', fontWeight: '600', color: '#059669' }}>{label}</p>
          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, campoID)} disabled={aEnviar} />
          {aEnviar && <span style={{color: '#ef4444', display: 'block', marginTop: '8px'}}>Processando...</span>}
        </>
      )}
    </div>
  );

  return (
    <div className="print-page" style={s.page}>
      <GlobalCSS />
      <div className="glass-panel no-print" style={s.topbar}>
        <div><h2 style={{margin: 0, color: '#0f172a'}}>Editor de PEI</h2></div>
        <div style={s.btnGroup}><button style={s.btnSecondary} onClick={onVoltar}>← Voltar</button><button style={s.btnPrimary} onClick={salvarNoBanco}>✓ Salvar Nuvem</button><button style={s.btnSuccess} onClick={()=>window.print()}>🖨️ Imprimir PDF</button></div>
      </div>

      <div className="print-only" style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid black', paddingBottom: '15px' }}>
        <h2 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>PREFEITURA MUNICIPAL DE REDENÇÃO DA SERRA</h2>
        <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>EMEIEF “PROFESSORA EDNA REGINA DE OLIVEIRA E SILVA”</h3>
        <h1 style={{ marginTop: '20px', fontSize: '1.4rem' }}>PLANO EDUCACIONAL INDIVIDUALIZADO – PEI</h1>
      </div>

      <div className="glass-panel card-print">
        <div style={s.cardHeader}><span className="badge-print" style={s.badge}>A</span> Identificação do Aluno</div>
        <div className="print-block" style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '30px' }}>
          <div className="no-print"><FileUpload label="Selecionar Foto" campoID="foto_perfil" /></div>
          <div className="print-block" style={s.grid2}>
            <div><label style={s.label}>Nome do Aluno *</label><input style={s.input} name="aluno" value={formData.aluno} onChange={handleChange} /></div>
            <div><label style={s.label}>Data de Nascimento</label><input style={s.input} name="nascimento" value={formData.nascimento} onChange={handleChange} /></div>
            <div><label style={s.label}>Ano/Série</label><input style={s.input} name="anoSerie" value={formData.anoSerie} onChange={handleChange} /></div>
            <div><label style={s.label}>Turma</label><input style={s.input} name="turma" value={formData.turma} onChange={handleChange} /></div>
            <div><label style={s.label}>Responsáveis</label><input style={s.input} name="responsaveis" value={formData.responsaveis} onChange={handleChange} /></div>
          </div>
        </div>
      </div>

      <div className="glass-panel card-print">
        <div style={s.cardHeader}><span className="badge-print" style={s.badge}>B</span> Informações Clínicas</div>
        <div className="print-block" style={s.grid3}>
          <div><label style={s.label}>Diagnóstico</label><input style={s.input} name="diagnostico" value={formData.diagnostico} onChange={handleChange} /><FileUpload label="Anexar Laudo" campoID="laudo_medico" /></div>
          <div><label style={s.label}>Códigos CID</label><input style={s.input} name="cid" value={formData.cid} onChange={handleChange} /></div>
          <div><label style={s.label}>CRM do Médico</label><input style={s.input} name="crm" value={formData.crm} onChange={handleChange} /></div>
        </div>
      </div>

      <div className="glass-panel card-print">
        <div style={s.cardHeader}><span className="badge-print" style={s.badge}>C</span> Medicação e Terapias</div>
        <div className="print-block" style={s.grid2}>
          <div><Checkbox label="O aluno utiliza medicação?" formData={formData} handleCheckbox={handleCheckbox} /><FileUpload label="Anexar Receita" campoID="receita_medica" /></div>
          <div><Checkbox label="Acompanhamento terapêutico?" formData={formData} handleCheckbox={handleCheckbox} /></div>
        </div>
        <div className="print-block" style={{...s.grid2, marginTop: '20px'}}>
          <div><label style={s.label}>Campo de Experiência: Linguagem</label><textarea style={{...s.input, minHeight: '80px'}} name="campoLinguagem" value={formData.campoLinguagem} onChange={handleChange}></textarea></div>
          <div><label style={s.label}>Campo de Experiência: Matemática</label><textarea style={{...s.input, minHeight: '80px'}} name="campoMatematica" value={formData.campoMatematica} onChange={handleChange}></textarea></div>
        </div>
        <div className="print-block" style={{ marginTop: '20px' }}><h4>Especialistas que acompanham o aluno:</h4><div className="print-block" style={s.grid3}><Checkbox label="Neurologista" formData={formData} handleCheckbox={handleCheckbox} /><Checkbox label="Psicólogo" formData={formData} handleCheckbox={handleCheckbox} /><Checkbox label="Fonoaudiólogo" formData={formData} handleCheckbox={handleCheckbox} /><Checkbox label="Psicopedagogo" formData={formData} handleCheckbox={handleCheckbox} /><Checkbox label="Terapeuta Ocupacional" formData={formData} handleCheckbox={handleCheckbox} /><Checkbox label="ABA / TCC" formData={formData} handleCheckbox={handleCheckbox} /></div></div>
      </div>

      <div className="glass-panel card-print">
        <div style={s.cardHeader}><span className="badge-print" style={s.badge}>D</span> Avaliação Diagnóstica</div>
        <div className="print-block" style={s.grid2}>
          <div><label style={s.label}>Resultado da Avaliação</label><textarea style={{...s.input, minHeight: '100px'}} name="resultadoAvaliacao" value={formData.resultadoAvaliacao} onChange={handleChange}></textarea></div>
          <div><label style={s.label}>Evidência / Avaliação</label><FileUpload label="Anexar Avaliação" campoID="avaliacao_diagnostica" /></div>
        </div>
      </div>

      <div className="glass-panel card-print">
        <div style={s.cardHeader}><span className="badge-print" style={s.badge}>E</span> Adaptações por Disciplina</div>
        <div className="print-block" style={s.grid3}>
          {disciplinas.map((disc) => (
            <div key={disc} className="print-block" style={{ border: '1px solid rgba(203, 213, 225, 0.5)', padding: '18px', backgroundColor: 'rgba(209, 250, 229, 0.2)' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#065f46' }}>{disc}</h4>
              <Checkbox label={`${disc} - Priorização de conteúdos`} formData={formData} handleCheckbox={handleCheckbox} />
              <Checkbox label={`${disc} - Introdução de conteúdos alternativos`} formData={formData} handleCheckbox={handleCheckbox} />
              <div style={{marginTop: '12px'}}><label style={s.label}>Conteúdo Ministrado:</label><textarea style={{...s.input, minHeight: '60px'}} value={(formData.conteudos || {})[disc] || ''} onChange={(e) => handleNestedText('conteudos', disc, e.target.value)} /></div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel card-print">
        <div style={s.cardHeader}><span className="badge-print" style={s.badge}>H</span> Métodos de Avaliação</div>
        <div className="print-block" style={s.grid3}><Checkbox label="Sondagem pedagógica" formData={formData} handleCheckbox={handleCheckbox} /><Checkbox label="Múltipla escolha (objetiva)" formData={formData} handleCheckbox={handleCheckbox} /><Checkbox label="Resposta oral" formData={formData} handleCheckbox={handleCheckbox} /><Checkbox label="Exercícios práticos" formData={formData} handleCheckbox={handleCheckbox} /><Checkbox label="Trabalhos escritos/orais" formData={formData} handleCheckbox={handleCheckbox} /></div>
      </div>

      <div className="glass-panel card-print">
        <div style={s.cardHeader}><span className="badge-print" style={s.badge}>I</span> Diário do Aluno (Acompanhamento)</div>
        <div className="print-block" style={s.grid2}>
          {bimestres.map((bim, index) => (
            <div key={bim} className="print-block" style={{ border: '1px solid rgba(203, 213, 225, 0.5)', padding: '18px', backgroundColor: 'rgba(209, 250, 229, 0.2)' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#065f46' }}>{bim}</h4>
              <textarea style={{...s.input, minHeight: '80px'}} placeholder="Evolução, observações e conquistas..." value={(formData.diario || {})[bim] || ''} onChange={(e) => handleNestedText('diario', bim, e.target.value)} />
              <FileUpload label="Anexar Evidência / Atividade" campoID={`diario_bimestre_${index+1}`} />
            </div>
          ))}
        </div>
      </div>
      
      <div className="glass-panel card-print">
        <div style={s.cardHeader}><span className="badge-print" style={s.badge}>J</span> Revisão Final</div>
        <div><label style={s.label}>Resumo do Aluno</label><textarea style={{...s.input, minHeight: '120px'}} name="resumoAluno" value={formData.resumoAluno} onChange={handleChange}></textarea></div>
        <div className="print-only" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px' }}>
          {['Professor(a)', 'Coordenação', 'Responsáveis'].map(r => (<div key={r} style={{ flex: 1, textAlign: 'center', margin: '0 10px' }}><div style={{ borderBottom: '1px solid black', height: '30px' }}></div><p>{r}</p></div>))}
        </div>
      </div>
    </div>
  );
};

// 4B. NOVO FORMULÁRIO: PAEE 
const SistemaPAEE = ({ alunoData, onVoltar, usuario }) => {
  const estadoInicial = { tipoDocumento: 'PAEE', aluno: '', nascimento: '', sexo: '', escola: 'EMEIEF "PROFESSORA EDNA REGINA DE OLIVEIRA E SILVA"', turno: '', turma: '', anoSerie: '', nivelApoio: '', observacoesApoio: '', medidasEscola: '', organizacaoTipo: '', organizacaoAtendimentos: '', organizacaoTempo: '', organizacaoDias: '', medicamentos: '', monitorApoio: '', opcoes: {}, textos: {} };
  const [formData, setFormData] = useState(() => { return alunoData ? { ...estadoInicial, ...alunoData } : estadoInicial; });

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleCheckbox = (opcao) => setFormData(prev => ({ ...prev, opcoes: { ...(prev.opcoes || {}), [opcao]: !(prev.opcoes || {})[opcao] } }));

  const salvarNoBanco = async () => {
    if (!formData.aluno) { alert("Preencha o nome do aluno."); return; }
    const dadosParaSalvar = { ...formData, criadoPor: formData.criadoPor || usuario.email };
    const dbKey = alunoData?.dbKey || `${formData.aluno} (PAEE)`; 
    try { await set(ref(db, `alunos/${dbKey}`), dadosParaSalvar); alert(`✅ Documento PAEE salvo na nuvem!`); } 
    catch (error) { alert("Erro ao salvar."); }
  };

  return (
    <div className="print-page" style={s.page}>
      <GlobalCSS />
      <div className="glass-panel no-print" style={s.topbar}>
        <div><h2 style={{margin: 0, color: '#1e40af'}}>Editor de PAEE (Especialista AEE)</h2><p style={{margin:0, fontSize:'0.85rem'}}>Documento Oficial da Educação Especial</p></div>
        <div style={s.btnGroup}><button style={s.btnSecondary} onClick={onVoltar}>← Voltar</button><button style={{...s.btnPrimary, background: '#1e40af'}} onClick={salvarNoBanco}>✓ Salvar Nuvem</button><button style={s.btnSuccess} onClick={()=>window.print()}>🖨️ Imprimir PDF</button></div>
      </div>

      <div className="print-only" style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid black', paddingBottom: '15px' }}>
        <h2 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>PREFEITURA MUNICIPAL DE REDENÇÃO DA SERRA</h2>
        <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>EMEIEF “PROFESSORA EDNA REGINA DE OLIVEIRA E SILVA”</h3>
        <h1 style={{ marginTop: '20px', fontSize: '1.4rem' }}>PLANO DE ATENDIMENTO EDUCACIONAL ESPECIALIZADO - PAEE</h1>
      </div>

      <div className="glass-panel card-print">
        <div style={s.cardHeader}><span className="badge-print" style={s.badge}>I</span> Informações do Estudante</div>
        <div className="print-block" style={s.grid2}>
          <div><label style={s.label}>Nome Completo *</label><input style={s.input} name="aluno" value={formData.aluno} onChange={handleChange} /></div>
          <div><label style={s.label}>Data de Nascimento</label><input style={s.input} name="nascimento" value={formData.nascimento} onChange={handleChange} /></div>
          <div><label style={s.label}>Sexo</label><input style={s.input} placeholder="Feminino ou Masculino" name="sexo" value={formData.sexo} onChange={handleChange} /></div>
          <div><label style={s.label}>Turno</label><input style={s.input} name="turno" value={formData.turno} onChange={handleChange} /></div>
          <div><label style={s.label}>Ano de Escolaridade</label><input style={s.input} name="anoSerie" value={formData.anoSerie} onChange={handleChange} /></div>
          <div><label style={s.label}>Turma</label><input style={s.input} name="turma" value={formData.turma} onChange={handleChange} /></div>
        </div>
        <h4>Estudante elegível aos serviços da Educação Especial</h4>
        <div className="print-block" style={s.grid3}>
          <Checkbox label="Deficiência Intelectual" formData={formData} handleCheckbox={handleCheckbox} />
          <Checkbox label="Deficiência Visual" formData={formData} handleCheckbox={handleCheckbox} />
          <Checkbox label="Deficiência Física" formData={formData} handleCheckbox={handleCheckbox} />
          <Checkbox label="Deficiência Auditiva/Surdez" formData={formData} handleCheckbox={handleCheckbox} />
          <Checkbox label="Transtorno do Espectro Autista" formData={formData} handleCheckbox={handleCheckbox} />
          <Checkbox label="Altas habilidades/superdotação" formData={formData} handleCheckbox={handleCheckbox} />
          <Checkbox label="Deficiência Múltipla" formData={formData} handleCheckbox={handleCheckbox} />
        </div>
        <div style={{marginTop: '20px'}}><label style={s.label}>Nível de Apoio e Observações</label><textarea style={{...s.input, minHeight: '60px'}} name="observacoesApoio" value={formData.observacoesApoio} onChange={handleChange}></textarea></div>
      </div>

      <div className="glass-panel card-print">
        <div style={s.cardHeader}><span className="badge-print" style={s.badge}>III</span> Apoios, Recursos e Serviços</div>
        <div className="print-block" style={s.grid2}>
          <div>
            <Checkbox label="Recursos Pedagógicos e de T.A." formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Prof. de Libras ou Interlocutor" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Prof. Instrutor-mediador" formData={formData} handleCheckbox={handleCheckbox} />
          </div>
          <div>
            <p style={{margin: '0 0 10px 0', fontWeight: 'bold'}}>Apoio Escolar para:</p>
            <Checkbox label="Alimentação / Higiene" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Locomoção" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Comunicação e Interação Social" formData={formData} handleCheckbox={handleCheckbox} />
          </div>
        </div>
        <div style={{marginTop: '20px'}}><label style={s.label}>Medidas para superar barreiras no Estudo de Caso:</label><textarea style={{...s.input, minHeight: '80px'}} name="medidasEscola" value={formData.medidasEscola} onChange={handleChange}></textarea></div>
      </div>

      <div className="glass-panel card-print">
        <div style={s.cardHeader}><span className="badge-print" style={s.badge}>IV</span> Perfil do Aluno</div>
        <div className="print-block" style={s.grid3}>
          <div>
            <h4>Linguagem e Comunicação</h4>
            <Checkbox label="Apresenta fala/comunicação verbal" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Apresenta ecolalias" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Aponta ou usa gestos" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Faz uso de CAA (Comunicação Alt.)" formData={formData} handleCheckbox={handleCheckbox} />
          </div>
          <div>
            <h4>Perfil Sensorial/Comportamental</h4>
            <Checkbox label="Sensibilidade luz/tátil/auditiva" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Alimentação seletiva" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Não faz contato visual" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Estereotipias constantes" formData={formData} handleCheckbox={handleCheckbox} />
          </div>
          <div>
            <h4>Habilidades Sociais e AVD</h4>
            <Checkbox label="Brinca / Imita colegas" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Resiste a interação / Isola-se" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Desregulação / Agressividade" formData={formData} handleCheckbox={handleCheckbox} />
            <Checkbox label="Autonomia banheiro/alimentação" formData={formData} handleCheckbox={handleCheckbox} />
          </div>
        </div>
      </div>

      <div className="glass-panel card-print">
        <div style={s.cardHeader}><span className="badge-print" style={s.badge}>V</span> Organização e Trabalho do AEE</div>
        <div className="print-block" style={s.grid3}>
          <div><label style={s.label}>Organização do Atendimento</label><input style={s.input} placeholder="Ex: Individual / Coletivo" name="organizacaoTipo" value={formData.organizacaoTipo} onChange={handleChange} /></div>
          <div><label style={s.label}>Dias e Frequência</label><input style={s.input} placeholder="Ex: 2x na semana" name="organizacaoDias" value={formData.organizacaoDias} onChange={handleChange} /></div>
          <div><label style={s.label}>Medicações / Monitor de Apoio?</label><input style={s.input} name="medicamentos" value={formData.medicamentos} onChange={handleChange} /></div>
        </div>
        <h4>Áreas de Trabalho do AEE (Foco)</h4>
        <div className="print-block" style={s.grid3}>
          <div><Checkbox label="Atenção e Concentração" formData={formData} handleCheckbox={handleCheckbox} /><Checkbox label="Raciocínio Lógico" formData={formData} handleCheckbox={handleCheckbox} /><Checkbox label="Funções Executivas" formData={formData} handleCheckbox={handleCheckbox} /></div>
          <div><Checkbox label="Coordenação Motora Fina/Grossa" formData={formData} handleCheckbox={handleCheckbox} /><Checkbox label="Compreensão e Fluência Verbal" formData={formData} handleCheckbox={handleCheckbox} /><Checkbox label="Alfabeto e Produção Textual" formData={formData} handleCheckbox={handleCheckbox} /></div>
          <div><Checkbox label="Operações Matemáticas" formData={formData} handleCheckbox={handleCheckbox} /><Checkbox label="Noções Espaciais/Lateralidade" formData={formData} handleCheckbox={handleCheckbox} /><Checkbox label="Memória (Visual/Auditiva)" formData={formData} handleCheckbox={handleCheckbox} /></div>
        </div>
      </div>

      <div className="glass-panel card-print">
        <div className="print-only" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px', flexWrap: 'wrap', gap: '20px' }}>
          {['Diretor(a)', 'Coordenador(a)', 'Prof. AEE', 'Prof. Regente', 'Responsável'].map(role => (<div key={role} style={{ flex: '1', minWidth: '130px', textAlign: 'center' }}><div style={{ borderBottom: '1px solid black', marginBottom: '10px', height: '30px' }}></div><p style={{ fontWeight: 'bold', margin: 0, fontSize: '9pt' }}>{role}</p></div>))}
        </div>
      </div>
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
  const irParaNovoPEI = () => { setAlunoEditando(null); setTelaAtiva('formularioPEI'); };
  const irParaNovoPAEE = () => { setAlunoEditando(null); setTelaAtiva('formularioPAEE'); };
  const irParaEditar = (aluno) => { setAlunoEditando(aluno); setTelaAtiva(aluno.tipoDocumento === 'PAEE' ? 'formularioPAEE' : 'formularioPEI'); };

  if (carregando) return <div style={{ textAlign: 'center', marginTop: '50px' }}>A carregar o ambiente pedagógico...</div>;
  if (!usuario) return <LoginScreen />;
  
  if (telaAtiva === 'lista') return <ListaAlunos onNovoPEI={irParaNovoPEI} onNovoPAEE={irParaNovoPAEE} onEditar={irParaEditar} onLogout={fazerLogout} usuario={usuario} />;
  if (telaAtiva === 'formularioPAEE') return <SistemaPAEE alunoData={alunoEditando} onVoltar={() => setTelaAtiva('lista')} usuario={usuario} />;
  return <SistemaPEI alunoData={alunoEditando} onVoltar={() => setTelaAtiva('lista')} usuario={usuario} />;
}
