const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5112'

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function peticion<T>(path: string, options?: RequestInit): Promise<T> {
  const respuesta = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include',
  })

  if (!respuesta.ok) {
    const cuerpo = await respuesta.json().catch(() => ({}))
    throw new ApiError(
      cuerpo.mensaje ?? cuerpo.error ?? 'Error en la solicitud',
      respuesta.status,
    )
  }

  if (respuesta.headers.get('content-type')?.includes('application/json')) {
    return respuesta.json()
  }

  return undefined as T
}

async function peticionBinaria(path: string): Promise<Blob> {
  const respuesta = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
  })

  if (!respuesta.ok) {
    const cuerpo = await respuesta.json().catch(() => ({}))
    throw new ApiError(
      cuerpo.mensaje ?? cuerpo.error ?? 'Error en la solicitud',
      respuesta.status,
    )
  }

  return respuesta.blob()
}

async function peticionFormData<T>(path: string, formData: FormData): Promise<T> {
  const respuesta = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  })

  if (!respuesta.ok) {
    const cuerpo = await respuesta.json().catch(() => ({}))
    throw new ApiError(
      cuerpo.mensaje ?? cuerpo.error ?? 'Error en la solicitud',
      respuesta.status,
    )
  }

  return respuesta.json()
}

function cookieHeader(tokenSesion?: string): Record<string, string> {
  return tokenSesion ? { Cookie: `token_sesion=${tokenSesion}` } : {}
}

export { API_BASE, ApiError, peticion, peticionBinaria, peticionFormData, cookieHeader }
