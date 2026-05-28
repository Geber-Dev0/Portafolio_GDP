import { Request, Response, NextFunction } from 'express';
import config from '@config';

const COOKIE_NAME = 'swagger_token';
const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000;

function isTokenValid(token: string): boolean {
  return config.swaggerAccessToken !== '' && token === config.swaggerAccessToken;
}

export function swaggerLogin(req: Request, res: Response): void {
  const { token } = req.body;

  if (!token || !isTokenValid(token)) {
    res.status(401).json({ success: false, message: 'Token incorrecto' });
    return;
  }

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/api/docs'
  });

  res.json({ success: true, redirect: '/api/docs' });
}

export function swaggerAuth(req: Request, res: Response, next: NextFunction): void {
  if (!config.swaggerAccessToken) {
    next();
    return;
  }

  const qToken = req.query.token as string;
  const hToken = req.headers['x-access-token'] as string;
  const cToken = req.cookies?.[COOKIE_NAME] as string;

  if (isTokenValid(qToken) || isTokenValid(hToken) || isTokenValid(cToken)) {
    if (qToken && !cToken) {
      res.cookie(COOKIE_NAME, qToken, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: COOKIE_MAX_AGE,
        path: '/api/docs'
      });
    }
    next();
    return;
  }

  res.status(401).send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Acceso a Documentación API</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #e2e8f0; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
        .card { background: #1e293b; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.4); padding: 2rem; width: 360px; }
        h1 { font-size: 1.25rem; margin-bottom: 0.5rem; }
        p { color: #94a3b8; font-size: 0.875rem; margin-bottom: 1.5rem; }
        label { display: block; font-size: 0.8rem; font-weight: 600; color: #cbd5e1; margin-bottom: 0.4rem; }
        input { width: 100%; padding: 0.6rem 0.8rem; background: #0f172a; border: 1px solid #334155; border-radius: 6px; color: #e2e8f0; font-size: 0.9rem; outline: none; }
        input:focus { border-color: #6366f1; }
        button { width: 100%; margin-top: 1.25rem; padding: 0.6rem; background: #6366f1; border: none; border-radius: 6px; color: #fff; font-weight: 600; font-size: 0.9rem; cursor: pointer; }
        button:hover { background: #4f46e5; }
        button:disabled { opacity: 0.6; cursor: not-allowed; }
        .error { color: #f87171; font-size: 0.8rem; margin-top: 0.75rem; display: none; }
        .spinner { display: none; width: 16px; height: 16px; border: 2px solid #fff; border-top-color: transparent; border-radius: 50%; animation: spin 0.6s linear infinite; margin: 0 auto; }
        @keyframes spin { to { transform: rotate(360deg); } }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Acceso Restringido</h1>
        <p>Ingresa el token de acceso para ver la documentaci\u00f3n de la API.</p>
        <form id="loginForm" method="POST" action="/api/docs/auth">
          <label for="tokenInput">Token de acceso</label>
          <input id="tokenInput" name="token" type="password" placeholder="Ingresa el token" required autocomplete="off">
          <button type="submit" id="submitBtn">
            <span id="btnText">Ingresar</span>
            <span class="spinner" id="spinner"></span>
          </button>
          <div class="error" id="errorMsg">Token incorrecto</div>
        </form>
      </div>
      <script>
        document.getElementById('loginForm').addEventListener('submit', async function(e) {
          e.preventDefault();
          const token = document.getElementById('tokenInput').value.trim();
          if (!token) return;
          const btn = document.getElementById('submitBtn');
          const text = document.getElementById('btnText');
          const spinner = document.getElementById('spinner');
          const error = document.getElementById('errorMsg');
          btn.disabled = true;
          text.style.display = 'none';
          spinner.style.display = 'block';
          error.style.display = 'none';
          try {
            const res = await fetch('/api/docs/auth', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token })
            });
            const data = await res.json();
            if (data.success) {
              window.location.href = data.redirect;
            } else {
              error.style.display = 'block';
              btn.disabled = false;
              text.style.display = 'inline';
              spinner.style.display = 'none';
            }
          } catch {
            error.textContent = 'Error de conexi\u00f3n';
            error.style.display = 'block';
            btn.disabled = false;
            text.style.display = 'inline';
            spinner.style.display = 'none';
          }
        });
      </script>
    </body>
    </html>
  `);
}
