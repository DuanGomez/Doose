import { HttpErrorResponse, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { catchError, delay, dematerialize, from, map, materialize, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Backend simulado para el modo demo (GitHub Pages). Replica los controladores y servicios
 * de Spring Boot (auth, portafolio, favoritos, servicios, usuarios, contacto) guardando los
 * datos en localStorage. Solo se registra cuando `environment.demo` es true.
 */

type Role = 'ADMIN' | 'USER' | 'TATTOER';
interface DbUser { id: number; name: string; email: string; password: string; role: Role; specialty?: string; experience?: number; createdAt: string; }
interface DbItem { id: number; imageBase64: string; description: string; price: number; size: string; favoritesCount: number; createdAt: string; }
interface DbService { id: number; name: string; description: string; imageBase64?: string; price: number; duration: number; type: string; createdAt: string; }
interface DbMessage { id: number; name: string; email: string; phone?: string; message: string; createdAt: string; }
interface Db {
  version: number; users: DbUser[]; portfolio: DbItem[]; services: DbService[];
  favorites: { userId: number; itemId: number }[]; messages: DbMessage[]; seq: Record<string, number>;
}

const STORAGE_KEY = 'doose_demo_db';
const VERSION = 1;
const LATENCY_MS = 200;
const IMG = (name: string) => `assets/demo/${name}.svg`;

class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
const fail = (m: string) => new ApiError(400, m); // RuntimeException → 400 en GlobalExceptionHandler

function seed(): Db {
  const day = 86400000;
  const ago = (d: number) => new Date(Date.now() - d * day).toISOString();
  const users: DbUser[] = [
    { id: 1, name: 'AdminDuSe', email: 'admin@gmail.com', password: 'admin123', role: 'ADMIN', createdAt: ago(60) },
    { id: 2, name: 'Duan Gomez', email: 'duan@gmail.com', password: 'duan123', role: 'USER', createdAt: ago(40) },
    { id: 3, name: 'Sebastián Ríos', email: 'sebastian@tattoo.com', password: 'sebastian123', role: 'TATTOER', specialty: 'Blackwork', experience: 8, createdAt: ago(55) },
    { id: 4, name: 'Valentina Cruz', email: 'valentina@tattoo.com', password: 'valentina123', role: 'TATTOER', specialty: 'Acuarela', experience: 5, createdAt: ago(50) },
    { id: 5, name: 'Andrés Montoya', email: 'andres@tattoo.com', password: 'andres123', role: 'TATTOER', specialty: 'Geométrico', experience: 10, createdAt: ago(45) },
  ];
  const services: DbService[] = ([
    ['Tatuaje Minimalista', 'Líneas finas y diseños simples pero elegantes. Perfecto para una primera vez.', 150000, 60, 'Minimalista pequeño', 'minimal'],
    ['Frase Personalizada', 'Tu frase favorita, cita o nombre en la fuente que elijas. Única y especial.', 100000, 45, 'Frase corta', 'script'],
    ['Tribal de Brazo', 'Diseños tribales que recorren el brazo con patrones culturales y fuerza visual.', 320000, 180, 'Tribal brazo', 'tribal'],
    ['Realismo Pequeño', 'Retratos hiperrealistas en formato pequeño. Cada detalle recreado con precisión.', 260000, 120, 'Realista pequeño', 'eye'],
    ['Tatuaje Anime', 'Personajes y escenas de anime en tamaño mediano con colores vibrantes.', 290000, 150, 'Anime mediano', 'kitsune'],
    ['Diseño Geométrico', 'Figuras y patrones geométricos con precisión milimétrica. Arte y matemática.', 210000, 90, 'Geométrico', 'geometric'],
    ['Blackwork Artístico', 'Diseños sólidos en tinta negra con alto contraste y gran impacto visual.', 360000, 210, 'Blackwork', 'mandala'],
    ['Tatuaje Acuarela', 'Efecto pintura acuarela con colores que se difuminan como en un lienzo.', 310000, 180, 'Acuarela', 'watercolor'],
    ['Retrato Realista', 'Retratos de personas, mascotas o iconos con detalle fotográfico. La cúspide del realismo.', 520000, 300, 'Retrato realista', 'eye'],
    ['Tatuaje Grande de Espalda', 'Obra maestra que cubre toda la espalda. El proyecto más ambicioso del estudio.', 850000, 480, 'Tatuaje grande espalda', 'koi'],
  ] as [string, string, number, number, string, string][]).map(([name, description, price, duration, type, img], i) => ({
    id: i + 1, name, description, price, duration, type, imageBase64: IMG(img), createdAt: ago(30),
  }));
  const portfolio: DbItem[] = ([
    ['Rosa tradicional con hojas, línea fina y sombra suave.', 280000, 'Mediano', 'rose', 14, 3],
    ['Golondrina old school en blackwork sólido.', 240000, 'Mediano', 'swallow', 9, 5],
    ['Daga con guarda dorada y ornamentos.', 320000, 'Grande', 'dagger', 11, 6],
    ['Serpiente punteada envolviendo el antebrazo.', 380000, 'Grande', 'snake', 7, 2],
    ['Luna creciente con estrellas doradas.', 160000, 'Pequeño', 'moon', 18, 1],
    ['Mariposa blackwork con detalles dorados.', 210000, 'Mediano', 'butterfly', 12, 4],
    ['Brújula náutica de línea fina.', 230000, 'Mediano', 'compass', 6, 12],
    ['Ola japonesa con sol naciente.', 450000, 'Grande', 'wave', 15, 9],
    ['Mandala blackwork de 12 pétalos.', 360000, 'Grande', 'mandala', 10, 20],
  ] as [string, number, string, string, number, number][]).map(([description, price, size, img, favoritesCount, days], i) => ({
    id: i + 1, imageBase64: IMG(img), description, price, size, favoritesCount, createdAt: ago(days),
  }));
  const messages: DbMessage[] = [
    { id: 1, name: 'Mariana López', email: 'mariana@correo.com', phone: '3001234567', message: 'Hola, quiero cotizar una frase en el antebrazo. ¿Tienen cita el viernes?', createdAt: ago(1) },
    { id: 2, name: 'Carlos Pérez', email: 'carlos@correo.com', message: '¿Hacen cover-up de tatuajes viejos?', createdAt: ago(3) },
  ];
  return {
    version: VERSION, users, portfolio, services, messages, favorites: [{ userId: 2, itemId: 5 }, { userId: 2, itemId: 8 }],
    seq: { users: users.length, portfolio: portfolio.length, services: services.length, messages: messages.length },
  };
}

let cache: Db | null = null;
function db(): Db {
  if (cache) return cache;
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    if (stored?.version === VERSION) return (cache = stored as Db);
  } catch { /* datos corruptos: se regeneran */ }
  cache = seed();
  save();
  return cache;
}
function save(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    throw new ApiError(507, 'El almacenamiento del navegador está lleno. Usa imágenes más livianas.');
  }
}
const nextId = (t: string) => (db().seq[t] = (db().seq[t] ?? 0) + 1);

const publicUser = ({ password, ...u }: DbUser) => u;
const authResponse = (u: DbUser) => ({ token: `demo.${u.id}`, id: u.id, name: u.name, email: u.email, role: u.role });

function currentUser(req: HttpRequest<unknown>): DbUser | null {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '') ?? '';
  return db().users.find((u) => token === `demo.${u.id}`) ?? null;
}

type Ctx = { body: any; id: number; user: () => DbUser };
type Rule = 'public' | 'auth' | 'admin';
const routes: [string, RegExp, Rule, (c: Ctx) => unknown][] = [];
const route = (method: string, pattern: string, rule: Rule, h: (c: Ctx) => unknown) =>
  routes.push([method, new RegExp(`^${pattern.replace(':id', '(\\d+)')}$`), rule, h]);

// Auth
route('POST', 'auth/login', 'public', ({ body }) => {
  const u = db().users.find((x) => x.email.toLowerCase() === String(body?.email ?? '').trim().toLowerCase());
  if (!u || u.password !== body?.password) throw fail('Credenciales incorrectas');
  return authResponse(u);
});
route('POST', 'auth/register', 'public', ({ body }) => {
  const name = String(body?.name ?? '').trim();
  const email = String(body?.email ?? '').trim();
  if (!name || !/^\S+@\S+\.\S+$/.test(email)) throw fail('Nombre y correo válidos son obligatorios');
  if (String(body?.password ?? '').length < 6) throw fail('La contraseña debe tener al menos 6 caracteres');
  if (db().users.some((u) => u.email.toLowerCase() === email.toLowerCase())) throw fail('El correo ya está registrado');
  const u: DbUser = {
    id: nextId('users'), name, email, password: body.password,
    role: email.toLowerCase().endsWith('@tattoo.com') ? 'TATTOER' : 'USER', createdAt: new Date().toISOString(),
  };
  db().users.push(u);
  save();
  return authResponse(u);
});

// Portafolio
route('GET', 'portfolio', 'public', () => db().portfolio);
route('GET', 'portfolio/stat/top-week', 'admin', () => {
  const weekAgo = Date.now() - 7 * 86400000;
  return [...db().portfolio].filter((p) => Date.parse(p.createdAt) > weekAgo)
    .sort((a, b) => b.favoritesCount - a.favoritesCount)[0] ?? null;
});
route('POST', 'portfolio', 'admin', ({ body }) => {
  const item: DbItem = {
    id: nextId('portfolio'), imageBase64: body.imageBase64, description: body.description ?? '', price: Number(body.price) || 0,
    size: body.size ?? '', favoritesCount: Number(body.favoritesCount) || 0, createdAt: new Date().toISOString(),
  };
  db().portfolio.push(item);
  save();
  return item;
});
route('PUT', 'portfolio/:id', 'admin', ({ id, body }) => {
  const item = db().portfolio.find((p) => p.id === id);
  if (!item) throw fail('Ítem de portafolio no encontrado');
  Object.assign(item, { description: body.description, price: Number(body.price) || 0, size: body.size });
  if (body.imageBase64?.trim()) item.imageBase64 = body.imageBase64;
  save();
  return item;
});
route('DELETE', 'portfolio/:id', 'admin', ({ id }) => {
  db().favorites = db().favorites.filter((f) => f.itemId !== id);
  db().portfolio = db().portfolio.filter((p) => p.id !== id);
  save();
  return null;
});

// Favoritos
route('GET', 'favorites', 'auth', ({ user }) => {
  const ids = db().favorites.filter((f) => f.userId === user().id).map((f) => f.itemId);
  return db().portfolio.filter((p) => ids.includes(p.id));
});
route('POST', 'favorites/:id', 'auth', ({ id, user }) => {
  const u = user();
  if (db().favorites.some((f) => f.userId === u.id && f.itemId === id)) throw fail('Ya está en favoritos');
  const item = db().portfolio.find((p) => p.id === id);
  if (!item) throw fail('Ítem de portafolio no encontrado');
  item.favoritesCount += 1;
  db().favorites.push({ userId: u.id, itemId: id });
  save();
  return null;
});
route('DELETE', 'favorites/:id', 'auth', ({ id, user }) => {
  const u = user();
  const item = db().portfolio.find((p) => p.id === id);
  if (!item) throw fail('Ítem de portafolio no encontrado');
  db().favorites = db().favorites.filter((f) => !(f.userId === u.id && f.itemId === id));
  item.favoritesCount = Math.max(0, item.favoritesCount - 1);
  save();
  return null;
});

// Servicios
route('GET', 'services', 'public', () => db().services);
route('POST', 'services', 'admin', ({ body }) => {
  const s: DbService = {
    id: nextId('services'), name: body.name, description: body.description ?? '', imageBase64: body.imageBase64,
    price: Number(body.price) || 0, duration: Number(body.duration) || 60, type: body.type ?? '', createdAt: new Date().toISOString(),
  };
  db().services.push(s);
  save();
  return s;
});
route('PUT', 'services/:id', 'admin', ({ id, body }) => {
  const s = db().services.find((x) => x.id === id);
  if (!s) throw fail('Servicio no encontrado');
  Object.assign(s, {
    name: body.name, description: body.description, price: Number(body.price) || 0,
    duration: Number(body.duration) || s.duration, type: body.type,
  });
  if (body.imageBase64) s.imageBase64 = body.imageBase64;
  save();
  return s;
});
route('DELETE', 'services/:id', 'admin', ({ id }) => {
  db().services = db().services.filter((s) => s.id !== id);
  save();
  return null;
});

// Usuarios y perfil
route('GET', 'admin/users', 'admin', () => db().users.map(({ password, specialty, experience, ...u }) => u));
route('GET', 'admin/users/tattoers', 'auth', () => db().users.filter((u) => u.role === 'TATTOER').map(publicUser));
route('PUT', 'users/profile', 'auth', ({ user, body }) => {
  Object.assign(user(), { specialty: body?.specialty, experience: Number(body?.experience) || 0 });
  save();
  return null;
});

// Contacto
route('POST', 'contact', 'public', ({ body }) => {
  if (!body?.name?.trim() || !body?.email?.trim() || !body?.message?.trim()) throw fail('Nombre, correo y mensaje son obligatorios');
  const m: DbMessage = { id: nextId('messages'), name: body.name, email: body.email, phone: body.phone, message: body.message, createdAt: new Date().toISOString() };
  db().messages.unshift(m);
  save();
  return m;
});
route('GET', 'contact', 'admin', () => db().messages);

export const demoBackendInterceptor: HttpInterceptorFn = (req, next) => {
  const prefix = `${environment.apiUrl}/`;
  if (!req.url.startsWith(prefix)) return next(req);
  const path = req.url.slice(prefix.length).split('?')[0];

  const run = async () => {
    const found = routes.find(([m, p]) => m === req.method && p.test(path));
    if (!found) throw new ApiError(404, `No existe ${req.method} /api/${path}`);
    const [, pattern, rule, handler] = found;
    const user = currentUser(req);
    if (rule !== 'public' && !user) throw new ApiError(401, 'Debes iniciar sesión');
    if (rule === 'admin' && user!.role !== 'ADMIN') throw new ApiError(403, 'Acceso denegado');
    const data = handler({ body: req.body, id: Number(path.match(pattern)![1]), user: () => user! });
    return { success: true, message: 'OK', data: data ?? null };
  };

  return from(run()).pipe(
    map((body) => new HttpResponse({ status: 200, body, url: req.url })),
    catchError((e) => {
      const err = e instanceof ApiError ? e : new ApiError(500, 'Error interno del servidor');
      if (!(e instanceof ApiError)) console.error(e);
      return throwError(() => new HttpErrorResponse({
        status: err.status, url: req.url, error: { success: false, message: err.message, data: null },
      }));
    }),
    materialize(),
    delay(LATENCY_MS),
    dematerialize(),
  );
};
