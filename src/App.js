import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { getDatabase, ref, set, onValue, remove } from "firebase/database";

// 1. Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDrQFf-ABIdhJocaMaBiBM0S7uzr8nfue4",
  authDomain: "pei-escola-redencao.firebaseapp.com",
  projectId: "pei-escola-redencao",
  storageBucket: "pei-escola-redencao.firebasestorage.app",
  messagingSenderId: "929602764845",
  appId: "1:929602764845:web:a90af20ee0c80ca74638a4",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// --- ESTILOS GERAIS ---
const s = {
  page: {
    backgroundColor: "#f3f4f6",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: '"Inter", system-ui, sans-serif',
    color: "#1f2937",
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: "15px 25px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "15px",
  },
  profile: { display: "flex", alignItems: "center", gap: "15px" },
  avatar: {
    width: "40px",
    height: "40px",
    backgroundColor: "#3b82f6",
    color: "white",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
  },
  btnGroup: { display: "flex", gap: "10px", flexWrap: "wrap" },
  btnPrimary: {
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
  },
  btnSuccess: {
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  btnSecondary: {
    backgroundColor: "#e5e7eb",
    color: "#374151",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
  },
  btnDanger: {
    backgroundColor: "#fee2e2",
    color: "#ef4444",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    marginBottom: "24px",
  },
  cardHeader: {
    color: "#1e3a8a",
    fontSize: "1.2rem",
    fontWeight: "bold",
    borderBottom: "2px solid #eff6ff",
    paddingBottom: "12px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  badge: {
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
    padding: "4px 10px",
    borderRadius: "4px",
    fontSize: "0.9rem",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginBottom: "15px",
  },
  label: { fontWeight: "600", color: "#4b5563", fontSize: "0.9rem" },
  input: {
    padding: "10px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "#f9fafb",
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    marginBottom: "8px",
    cursor: "pointer",
  },
  uploadBox: {
    border: "2px dashed #93c5fd",
    borderRadius: "6px",
    padding: "15px",
    textAlign: "center",
    backgroundColor: "#eff6ff",
    marginTop: "10px",
  },
  sectionTitle: {
    color: "#374151",
    marginBottom: "10px",
    fontSize: "1rem",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "5px",
  },
};

// 2. Tela de Login
const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setErro("E-mail ou senha incorretos. Tente novamente.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f3f4f6",
        fontFamily: "system-ui",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#1e3a8a",
            marginBottom: "20px",
          }}
        >
          Acesso ao Sistema PEI
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "#6b7280",
            marginBottom: "30px",
          }}
        >
          Redenção da Serra - SP
        </p>
        {erro && (
          <div
            style={{
              backgroundColor: "#fee2e2",
              color: "#ef4444",
              padding: "10px",
              borderRadius: "4px",
              marginBottom: "15px",
              fontSize: "0.9rem",
              textAlign: "center",
            }}
          >
            {erro}
          </div>
        )}
        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={s.input}
            required
          />
          <input
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={s.input}
            required
          />
          <button type="submit" style={s.btnPrimary}>
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

// 3. Tela de Lista de Alunos
const ListaAlunos = ({ onNovo, onEditar, onLogout }) => {
  const [alunos, setAlunos] = useState([]);

  useEffect(() => {
    const dbRef = ref(db, "alunos");
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const lista = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setAlunos(lista);
      } else {
        setAlunos([]);
      }
    });
  }, []);

  const deletarAluno = async (id) => {
    if (window.confirm(`Tem certeza que deseja excluir o PEI do(a) ${id}?`)) {
      await remove(ref(db, `alunos/${id}`));
    }
  };

  return (
    <div style={s.page}>
      <div style={s.topbar}>
        <div style={s.profile}>
          <div style={s.avatar}>LH</div>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.1rem", color: "#111827" }}>
              Luiz Henrique
            </h2>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#6b7280" }}>
              Professor(a) • Admin
            </p>
          </div>
        </div>
        <div style={s.btnGroup}>
          <button style={s.btnPrimary} onClick={onNovo}>
            + Novo PEI
          </button>
          <button style={s.btnDanger} onClick={onLogout}>
            Sair
          </button>
        </div>
      </div>

      <h1
        style={{ color: "#1f2937", marginBottom: "20px", fontSize: "1.5rem" }}
      >
        Alunos Cadastrados
      </h1>

      {alunos.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "50px",
            color: "#6b7280",
            backgroundColor: "white",
            borderRadius: "8px",
          }}
        >
          Nenhum aluno cadastrado ainda. Clique em "Novo PEI" para começar.
        </div>
      ) : (
        <div style={s.grid3}>
          {alunos.map((aluno) => (
            <div
              key={aluno.id}
              style={{
                ...s.card,
                marginBottom: "0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h3 style={{ color: "#1e3a8a", margin: "0 0 10px 0" }}>
                  {aluno.aluno}
                </h3>
                <p
                  style={{
                    margin: "0 0 5px 0",
                    fontSize: "0.9rem",
                    color: "#4b5563",
                  }}
                >
                  <strong>Ano/Série:</strong> {aluno.anoSerie || "-"}{" "}
                  {aluno.turma}
                </p>
                <p
                  style={{
                    margin: "0 0 15px 0",
                    fontSize: "0.9rem",
                    color: "#4b5563",
                  }}
                >
                  <strong>Diagnóstico:</strong>{" "}
                  {aluno.diagnostico || "Não informado"}
                </p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  style={{ ...s.btnSecondary, flex: "1" }}
                  onClick={() => onEditar(aluno)}
                >
                  Abrir / Editar
                </button>
                <button
                  style={{ ...s.btnDanger }}
                  onClick={() => deletarAluno(aluno.id)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 4. Tela do Formulário (Sistema PEI Completo)
const SistemaPEI = ({ alunoData, onVoltar, onLogout }) => {
  const estadoInicial = {
    aluno: "",
    nascimento: "",
    anoSerie: "",
    turma: "",
    responsaveis: "",
    escola: 'EMEIEF "PROFESSORA EDNA REGINA DE OLIVEIRA E SILVA"',
    diagnostico: "",
    cid: "",
    crm: "",
    resultadoAvaliacao: "",
    rotinaFamiliar: "",
    fatoresAmbientais: "",
    resumoAluno: "",
    anexos: {},
    conteudos: {},
    diario: {},
    opcoes: {},
  };

  const [formData, setFormData] = useState(() => {
    if (alunoData) {
      return {
        ...estadoInicial,
        ...alunoData,
        anexos: alunoData.anexos || {},
        conteudos: alunoData.conteudos || {},
        diario: alunoData.diario || {},
        opcoes: alunoData.opcoes || {},
      };
    }
    return estadoInicial;
  });

  const [aEnviar, setAEnviar] = useState(false);

  const disciplinas = [
    "Língua Portuguesa",
    "Matemática",
    "Ciências",
    "História",
    "Geografia",
    "Artes",
    "Educação Física",
    "Inglês",
    "Informática",
  ];
  const bimestres = [
    "1º Bimestre",
    "2º Bimestre",
    "3º Bimestre",
    "4º Bimestre",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (opcao) => {
    setFormData((prev) => ({
      ...prev,
      opcoes: {
        ...(prev.opcoes || {}),
        [opcao]: !(prev.opcoes || {})[opcao],
      },
    }));
  };

  const handleNestedText = (categoria, chave, valor) => {
    setFormData((prev) => ({
      ...prev,
      [categoria]: {
        ...(prev[categoria] || {}),
        [chave]: valor,
      },
    }));
  };

  const salvarNoBanco = async () => {
    if (!formData.aluno) {
      alert("Por favor, preencha o nome do aluno antes de salvar.");
      return;
    }
    try {
      await set(ref(db, "alunos/" + formData.aluno), formData);
      alert(`✅ Dados e imagens salvos com sucesso na nuvem!`);
    } catch (error) {
      alert("Erro ao salvar os dados. Verifique a sua conexão.");
    }
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
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 700;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const base64String = canvas.toDataURL("image/jpeg", 0.6);

        setFormData((prev) => ({
          ...prev,
          anexos: { ...(prev.anexos || {}), [campoID]: base64String },
        }));

        setAEnviar(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const removerAnexo = (campoID) => {
    setFormData((prev) => {
      const novosAnexos = { ...(prev.anexos || {}) };
      delete novosAnexos[campoID];
      return { ...prev, anexos: novosAnexos };
    });
  };

  const Checkbox = ({ label }) => (
    <label style={s.checkboxContainer}>
      <input
        type="checkbox"
        checked={!!(formData.opcoes || {})[label]}
        onChange={() => handleCheckbox(label)}
        style={{
          width: "16px",
          height: "16px",
          accentColor: "#2563eb",
          marginTop: "3px",
        }}
      />
      <span style={{ fontSize: "0.9rem", color: "#4b5563" }}>{label}</span>
    </label>
  );

  const FileUpload = ({ label, campoID }) => (
    <div className="no-print" style={s.uploadBox}>
      {formData.anexos && formData.anexos[campoID] ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={formData.anexos[campoID]}
            alt="Anexo"
            style={{
              maxWidth: "100%",
              maxHeight: "200px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              objectFit: "contain",
            }}
          />
          <button
            type="button"
            onClick={() => removerAnexo(campoID)}
            style={{
              marginTop: "10px",
              padding: "6px 12px",
              backgroundColor: "#fee2e2",
              color: "#ef4444",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: "bold",
            }}
          >
            Remover Imagem
          </button>
        </div>
      ) : (
        <>
          <span style={{ fontSize: "1.5rem" }}>📷</span>
          <p
            style={{
              margin: "5px 0",
              fontWeight: "bold",
              color: "#2563eb",
              fontSize: "0.9rem",
            }}
          >
            {label}
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, campoID)}
            style={{ fontSize: "0.8rem", marginTop: "8px", maxWidth: "100%" }}
            disabled={aEnviar}
          />
          {aEnviar && (
            <span
              style={{
                fontSize: "0.8rem",
                color: "#ef4444",
                display: "block",
                marginTop: "5px",
              }}
            >
              Processando imagem...
            </span>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="print-page" style={s.page}>
      <style>
        {`
          @media screen { .print-only { display: none !important; } }
          @media print {
            body, .print-page { background-color: white !important; margin: 0 !important; padding: 0 !important; color: black !important; }
            .no-print { display: none !important; }
            .print-only { display: block !important; }
            .card-print { box-shadow: none !important; border: none !important; padding: 10px 0 !important; margin-bottom: 20px !important; page-break-inside: avoid; }
            input, textarea { border: none !important; border-bottom: 1px dashed #999 !important; border-radius: 0 !important; background: transparent !important; padding: 5px 0 !important; color: black !important; }
            textarea { height: auto !important; min-height: 40px !important; }
            h1, h3, h4 { color: black !important; }
            .badge-print { background: none !important; color: black !important; border: 1px solid black; padding: 2px 6px; }
          }
        `}
      </style>

      {/* BARRA SUPERIOR */}
      <div className="no-print" style={s.topbar}>
        <div style={s.profile}>
          <div style={s.avatar}>LH</div>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.1rem", color: "#111827" }}>
              Luiz Henrique
            </h2>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#6b7280" }}>
              Professor(a) • Admin
            </p>
          </div>
        </div>
        <div style={s.btnGroup}>
          <button style={s.btnSecondary} onClick={onVoltar}>
            ← Lista
          </button>
          <button style={s.btnSuccess} onClick={salvarNoBanco}>
            Salvar na Nuvem
          </button>
          <button
            style={{ ...s.btnPrimary, backgroundColor: "#4f46e5" }}
            onClick={gerarPDF}
          >
            🖨️ Imprimir PEI
          </button>
        </div>
      </div>

      {/* CABEÇALHO DE IMPRESSÃO - Linhas Quebradas para evitar erro */}
      <div
        className="print-only"
        style={{
          textAlign: "center",
          marginBottom: "30px",
          borderBottom: "2px solid black",
          paddingBottom: "15px",
        }}
      >
        <h2 style={{ margin: "0 0 5px 0", fontSize: "1.2rem" }}>
          PREFEITURA MUNICIPAL DE REDENÇÃO DA SERRA
        </h2>
        <h3 style={{ margin: "0 0 5px 0", fontSize: "1rem" }}>
          SECRETARIA MUNICIPAL DE EDUCAÇÃO
        </h3>
        <h3 style={{ margin: "0 0 10px 0", fontSize: "1rem" }}>
          EMEIEF “PROFESSORA EDNA REGINA DE OLIVEIRA E SILVA”
        </h3>
        <h1
          style={{
            marginTop: "20px",
            fontSize: "1.4rem",
            textTransform: "uppercase",
          }}
        >
          Plano Educacional Individualizado – PEI
        </h1>
      </div>

      <h1
        className="no-print"
        style={{ color: "#1f2937", marginBottom: "20px", fontSize: "1.5rem" }}
      >
        {alunoData ? "Editando PEI" : "Novo PEI"}
      </h1>

      {/* A. IDENTIFICAÇÃO */}
      <div className="card-print" style={s.card}>
        <div style={s.cardHeader}>
          <span className="badge-print" style={s.badge}>
            A
          </span>{" "}
          Identificação do Aluno
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 3fr",
            gap: "30px",
          }}
        >
          <div className="no-print">
            <div style={s.label}>Foto do Aluno</div>
            <FileUpload label="Selecionar Foto" campoID="foto_perfil" />
          </div>
          <div style={s.grid2}>
            <div style={s.inputGroup}>
              <label style={s.label}>Nome do Aluno *</label>
              <input
                style={s.input}
                name="aluno"
                value={formData.aluno}
                onChange={handleChange}
              />
            </div>
            <div style={s.inputGroup}>
              <label style={s.label}>Data de Nascimento</label>
              <input
                style={s.input}
                name="nascimento"
                value={formData.nascimento}
                onChange={handleChange}
              />
            </div>
            <div style={s.inputGroup}>
              <label style={s.label}>Ano/Série</label>
              <input
                style={s.input}
                name="anoSerie"
                value={formData.anoSerie}
                onChange={handleChange}
              />
            </div>
            <div style={s.inputGroup}>
              <label style={s.label}>Turma</label>
              <input
                style={s.input}
                name="turma"
                value={formData.turma}
                onChange={handleChange}
              />
            </div>
            <div style={{ ...s.inputGroup, gridColumn: "1 / -1" }}>
              <label style={s.label}>Responsáveis</label>
              <input
                style={s.input}
                name="responsaveis"
                value={formData.responsaveis}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* B. CLÍNICAS */}
      <div className="card-print" style={s.card}>
        <div style={s.cardHeader}>
          <span className="badge-print" style={s.badge}>
            B
          </span>{" "}
          Informações Clínicas
        </div>
        <div style={s.grid3}>
          <div style={s.inputGroup}>
            <label style={s.label}>Diagnóstico</label>
            <input
              style={s.input}
              name="diagnostico"
              value={formData.diagnostico}
              onChange={handleChange}
            />
            <FileUpload label="Anexar Laudo" campoID="laudo_medico" />
          </div>
          <div style={s.inputGroup}>
            <label style={s.label}>Códigos CID</label>
            <input
              style={s.input}
              name="cid"
              value={formData.cid}
              onChange={handleChange}
            />
          </div>
          <div style={s.inputGroup}>
            <label style={s.label}>CRM do Médico</label>
            <input
              style={s.input}
              name="crm"
              value={formData.crm}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* C. MEDICAÇÃO E TERAPIAS */}
      <div className="card-print" style={s.card}>
        <div style={s.cardHeader}>
          <span className="badge-print" style={s.badge}>
            C
          </span>{" "}
          Medicação, Terapias e Especialistas
        </div>
        <div style={s.grid2}>
          <div>
            <Checkbox label="O aluno utiliza medicação?" />
            <FileUpload label="Anexar Receita" campoID="receita_medica" />
          </div>
          <div>
            <Checkbox label="O aluno tem acompanhamento terapêutico?" />
          </div>
        </div>
        <div style={{ marginTop: "20px" }}>
          <h4 style={s.sectionTitle}>Especialistas que acompanham o aluno:</h4>
          <div style={s.grid3}>
            <Checkbox label="Neurologista" />
            <Checkbox label="Neuropediatra" />
            <Checkbox label="Psiquiatra" />
            <Checkbox label="Psicólogo" />
            <Checkbox label="Fonoaudiólogo" />
            <Checkbox label="Psicopedagogo" />
            <Checkbox label="Terapeuta Ocupacional" />
            <Checkbox label="Psicomotricidade" />
            <Checkbox label="ABA / TCC" />
          </div>
        </div>
      </div>

      {/* D. AVALIAÇÃO DIAGNÓSTICA E CONTEXTUAL */}
      <div className="card-print" style={s.card}>
        <div style={s.cardHeader}>
          <span className="badge-print" style={s.badge}>
            D
          </span>{" "}
          Avaliação Diagnóstica e Contextual
        </div>

        <div style={s.grid2}>
          <div style={s.inputGroup}>
            <label style={s.label}>Resultado da Avaliação Diagnóstica</label>
            <textarea
              style={{ ...s.input, minHeight: "100px" }}
              name="resultadoAvaliacao"
              value={formData.resultadoAvaliacao}
              onChange={handleChange}
              placeholder="Estágio atual de aprendizagem..."
            ></textarea>
          </div>
          <div style={s.inputGroup}>
            <label style={s.label}>Evidência / Avaliação</label>
            <FileUpload
              label="Anexar Avaliação"
              campoID="avaliacao_diagnostica"
            />
          </div>
        </div>

        <div style={{ marginTop: "20px" }}>
          <Checkbox label="A avaliação é a mesma da turma regular?" />
          <Checkbox label="O aluno conta com Profissional de Apoio Especializado (PAE)?" />
        </div>

        <div style={{ ...s.grid2, marginTop: "20px" }}>
          <div style={s.inputGroup}>
            <label style={s.label}>Aspectos da Rotina Familiar</label>
            <textarea
              style={{ ...s.input, minHeight: "80px" }}
              name="rotinaFamiliar"
              value={formData.rotinaFamiliar}
              onChange={handleChange}
            ></textarea>
          </div>
          <div style={s.inputGroup}>
            <label style={s.label}>
              Fatores Ambientais (Facilitadores/Barreiras)
            </label>
            <textarea
              style={{ ...s.input, minHeight: "80px" }}
              name="fatoresAmbientais"
              value={formData.fatoresAmbientais}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
      </div>

      {/* E. ADAPTAÇÕES CURRICULARES */}
      <div className="card-print" style={s.card}>
        <div style={s.cardHeader}>
          <span className="badge-print" style={s.badge}>
            E
          </span>{" "}
          Adaptações Curriculares por Disciplina
        </div>
        <div style={s.grid3}>
          {disciplinas.map((disc) => (
            <div
              key={disc}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                padding: "15px",
                backgroundColor: "#f8fafc",
              }}
            >
              <h4
                style={{
                  margin: "0 0 10px 0",
                  borderBottom: "1px solid #e5e7eb",
                  paddingBottom: "8px",
                }}
              >
                {disc}
              </h4>
              <Checkbox label={`${disc} - Priorização de conteúdos`} />
              <Checkbox
                label={`${disc} - Introdução de conteúdos alternativos`}
              />
              <Checkbox label={`${disc} - Priorização de objetivos`} />
              <div style={{ ...s.inputGroup, marginTop: "10px" }}>
                <label style={{ ...s.label, fontSize: "0.8rem" }}>
                  Conteúdo Ministrado:
                </label>
                <textarea
                  style={{ ...s.input, minHeight: "60px", fontSize: "0.85rem" }}
                  value={(formData.conteudos || {})[disc] || ""}
                  onChange={(e) =>
                    handleNestedText("conteudos", disc, e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* F. PROCEDIMENTOS DIDÁTICOS */}
      <div className="card-print" style={s.card}>
        <div style={s.cardHeader}>
          <span className="badge-print" style={s.badge}>
            F
          </span>{" "}
          Adaptações Organizacionais e Didáticas
        </div>
        <div style={s.grid3}>
          <div>
            <h4 style={s.sectionTitle}>Procedimentos</h4>
            <Checkbox label="Organização de materiais" />
            <Checkbox label="Atividades alternativas" />
            <Checkbox label="Modificação de complexidade" />
            <Checkbox label="Agrupamento de alunos" />
            <Checkbox label="Pistas contextuais" />
          </div>
          <div>
            <h4 style={s.sectionTitle}>Apoio Visual / Estrutural</h4>
            <Checkbox label="Listas de vocabulário" />
            <Checkbox label="Recursos visuais/imagens" />
            <Checkbox label="Resumos e sínteses" />
            <Checkbox label="Organizadores gráficos" />
          </div>
          <div>
            <h4 style={s.sectionTitle}>Treinamento e Ferramentas</h4>
            <Checkbox label="Treino: Ditado" />
            <Checkbox label="Treino: Trabalho reduzido" />
            <Checkbox label="Treino: Decodificação" />
            <Checkbox label="Instrumentos facilitadores (calculadora, tablet, etc)" />
          </div>
        </div>
      </div>

      {/* G. ESPAÇO E TECNOLOGIA */}
      <div className="card-print" style={s.card}>
        <div style={s.cardHeader}>
          <span className="badge-print" style={s.badge}>
            G
          </span>{" "}
          Adaptações de Espaço e Tecnologia
        </div>
        <div style={s.grid3}>
          <div>
            <h4 style={s.sectionTitle}>Espaço Físico</h4>
            <Checkbox label="Acessibilidade" />
            <Checkbox label="Disposição de mobiliário" />
            <Checkbox label="Equipamentos adaptados" />
          </div>
          <div>
            <h4 style={s.sectionTitle}>Tecnologia Assistiva</h4>
            <Checkbox label="Acesso ao computador" />
            <Checkbox label="Auxílios visuais/auditivos" />
            <Checkbox label="CAA - Comunicação Aumentativa" />
          </div>
          <div>
            <h4 style={s.sectionTitle}>Adaptações Temporais</h4>
            <Checkbox label="Tempo estendido para atividades" />
            <Checkbox label="Escolarização prolongada" />
          </div>
        </div>
      </div>

      {/* H. MÉTODOS DE AVALIAÇÃO */}
      <div className="card-print" style={s.card}>
        <div style={s.cardHeader}>
          <span className="badge-print" style={s.badge}>
            H
          </span>{" "}
          Métodos de Avaliação
        </div>
        <div style={s.grid3}>
          <Checkbox label="Múltipla escolha (objetiva)" />
          <Checkbox label="Questões discursivas (claras)" />
          <Checkbox label="Alternativas reduzidas" />
          <Checkbox label="Ilustrações" />
          <Checkbox label="Resposta oral" />
          <Checkbox label="Exercícios práticos" />
          <Checkbox label="Trabalhos escritos/orais" />
        </div>
      </div>

      {/* I. DIÁRIO DO ALUNO (COM IMAGENS) */}
      <div className="card-print" style={s.card}>
        <div style={s.cardHeader}>
          <span className="badge-print" style={s.badge}>
            I
          </span>{" "}
          Diário do Aluno (Acompanhamento Bimestral)
        </div>
        <div style={s.grid2}>
          {bimestres.map((bim, index) => (
            <div
              key={bim}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                padding: "15px",
              }}
            >
              <h4 style={{ margin: "0 0 10px 0" }}>{bim}</h4>
              <textarea
                style={{ ...s.input, minHeight: "80px" }}
                placeholder="Evolução, observações e conquistas..."
                value={(formData.diario || {})[bim] || ""}
                onChange={(e) =>
                  handleNestedText("diario", bim, e.target.value)
                }
              />
              <FileUpload
                label="Anexar Evidência / Atividade"
                campoID={`diario_bimestre_${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* J. REVISÃO FINAL */}
      <div className="card-print" style={s.card}>
        <div style={s.cardHeader}>
          <span className="badge-print" style={s.badge}>
            J
          </span>{" "}
          Revisão Final e Observações
        </div>
        <div style={s.inputGroup}>
          <label style={s.label}>
            Resumo do Aluno (Pontos Fortes, Dificuldades e Recomendações)
          </label>
          <textarea
            style={{ ...s.input, minHeight: "120px" }}
            name="resumoAluno"
            value={formData.resumoAluno}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* ASSINATURAS */}
        <div
          className="print-only"
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "60px",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          {["Professor(a)", "Direção / Coordenação", "Pais/Responsáveis"].map(
            (role) => (
              <div
                key={role}
                style={{ flex: "1", minWidth: "150px", textAlign: "center" }}
              >
                <div
                  style={{
                    borderBottom: "1px solid black",
                    marginBottom: "10px",
                    height: "30px",
                  }}
                ></div>
                <p style={{ fontWeight: "bold", margin: 0 }}>{role}</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

// 5. Componente Principal
export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [telaAtiva, setTelaAtiva] = useState("lista");
  const [alunoEditando, setAlunoEditando] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCarregando(false);
    });
    return () => unsubscribe();
  }, []);

  const fazerLogout = () => signOut(auth);

  const irParaNovoFormulario = () => {
    setAlunoEditando(null);
    setTelaAtiva("formulario");
  };

  const irParaEditarFormulario = (aluno) => {
    setAlunoEditando(aluno);
    setTelaAtiva("formulario");
  };

  if (carregando)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        A carregar...
      </div>
    );
  if (!usuario) return <LoginScreen />;

  if (telaAtiva === "lista") {
    return (
      <ListaAlunos
        onNovo={irParaNovoFormulario}
        onEditar={irParaEditarFormulario}
        onLogout={fazerLogout}
      />
    );
  } else {
    return (
      <SistemaPEI
        alunoData={alunoEditando}
        onVoltar={() => setTelaAtiva("lista")}
        onLogout={fazerLogout}
      />
    );
  }
}
