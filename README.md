# rondas — prototipo

Red de acompañamiento terapéutico. Prototipo funcional (Vite + React + Tailwind).

## Correr en local

```bash
npm install
npm run dev
```

Abre en http://localhost:5173

## Deploy en Vercel

Ver instrucciones completas en la conversación con Claude. Resumen:

1. Subir esta carpeta a un repo de GitHub
2. Entrar a vercel.com → "Add New Project" → importar el repo
3. Vercel detecta Vite automáticamente (build: `npm run build`, output: `dist`)
4. Deploy

## Nota sobre el guardián de privacidad con IA

La función que revisa las notas de las salidas con IA hace un `fetch` directo a la API de Anthropic desde el navegador. **Eso no es seguro para producción** porque expone la lógica al cliente. Antes de usarlo con datos reales, hay que mover esa llamada a una API Route de Vercel (serverless function) con la API key en una variable de entorno del servidor. Ver sección correspondiente en la conversación con Claude.
