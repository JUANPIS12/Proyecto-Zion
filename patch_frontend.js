const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'frontend/src/App.jsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Añadir el estado de token
if (!content.includes('const [token, setToken] = useState')) {
    content = content.replace(
        `const [isLoggedIn, setIsLoggedIn] = useState(false);`,
        `const [isLoggedIn, setIsLoggedIn] = useState(false);\n  const [token, setToken] = useState(localStorage.getItem('token') || '');\n  const [rolUsuario, setRolUsuario] = useState(localStorage.getItem('rol') || '');\n  const [puedeCrearAdmin, setPuedeCrearAdmin] = useState(localStorage.getItem('puedeCrearAdmin') === 'true');`
    );
}

// 2. Parchear fetchJson
const oldFetch = `  async function fetchJson(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(\`Error al consultar \${url}\`);
    return res.json();
  }`;

const newFetch = `  async function fetchJson(url) {
    const res = await fetch(url, {
      headers: {
        'Authorization': \`Bearer \${token}\`
      }
    });
    if (res.status === 401 || res.status === 403) {
      handleLogout();
      throw new Error("Sesión expirada o sin permisos");
    }
    if (!res.ok) throw new Error(\`Error al consultar \${url}\`);
    return res.json();
  }`;
content = content.replace(oldFetch, newFetch);

// 3. Parchear postJson
const oldPost = `  async function postJson(url, body) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });`;
const newPost = `  async function postJson(url, body) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = \`Bearer \${token}\`;
    
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });`;
content = content.replace(oldPost, newPost);

// 4. Parchear patchJson
const oldPatch = `  async function patchJson(url, body) {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });`;
const newPatch = `  async function patchJson(url, body) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = \`Bearer \${token}\`;

    const res = await fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body),
    });`;
content = content.replace(oldPatch, newPatch);

// 5. Agregar handleLogin de verdad
const oldHandleLogin = `  function handleLogin(e) {
    e.preventDefault();
    if (email && password) {
      setIsLoggedIn(true);
    }
  }`;

const newHandleLogin = `  async function handleLogin(e) {
    e.preventDefault();
    if (email && password) {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(\`http://localhost:8080/auth/login\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: email, password })
        });
        
        if (!res.ok) {
           throw new Error('Credenciales inválidas');
        }
        
        const data = await res.json();
        setToken(data.token);
        setRolUsuario(data.rol);
        setPuedeCrearAdmin(data.puedeCrearAdmin);
        setIsLoggedIn(true);
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('rol', data.rol);
        localStorage.setItem('puedeCrearAdmin', data.puedeCrearAdmin);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setToken('');
    setRolUsuario('');
    setPuedeCrearAdmin(false);
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('puedeCrearAdmin');
  }
`;
if (content.includes(oldHandleLogin)) {
    content = content.replace(oldHandleLogin, newHandleLogin);
} else if (!content.includes('async function handleLogin')) {
    // Si no lo encuentra exactamente, lo pegamos antes de isLoggedIn change
    content = content.replace(/function handleLogin[^{]*{[^}]*}/s, newHandleLogin);
}

// 6. Efecto de auto-login basado en token (opcional)
const useEffectAuto = `  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);`;

if (!content.includes('if (token) {')) {
  content = content.replace('export default function App() {', \`export default function App() {\\n\${useEffectAuto}\`);
}


fs.writeFileSync(file, content, 'utf8');
console.log("App.jsx patched successfully.");
