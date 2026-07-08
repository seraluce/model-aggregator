import { useEffect, useState, type ReactNode } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { apiFetch, setToken, UNAUTHORIZED_EVENT, type ApiError } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { FieldError } from '@/components/ui/field-error'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { isEmail } from '@/lib/validate'
import { useI18n } from '@/i18n'

const PASSWORD_MIN = 8

interface AuthStatus {
  needsSetup: boolean
  authenticated: boolean
  email: string | null
}

function Logo() {
  return (
    <svg viewBox="0 0 64 64" className="size-10" fill="none">
      <circle cx="32" cy="32" r="11" className="fill-foreground" />
      <circle cx="32" cy="32" r="22" className="stroke-foreground" strokeWidth="6" strokeLinecap="round"
        strokeDasharray="104 34" transform="rotate(-60 32 32)" style={{ opacity: 0.45 }} />
    </svg>
  )
}

function AuthForm({ mode, onAuthed }: { mode: 'setup' | 'login'; onAuthed: () => void }) {
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [setupCode, setSetupCode] = useState('')
  const [codeRequired, setCodeRequired] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [attempted, setAttempted] = useState(false)

  const isSetup = mode === 'setup'

  const emailError = !email.trim()
    ? t('validation.required')
    : !isEmail(email)
      ? t('validation.email')
      : null
  const passwordError = !password
    ? t('validation.required')
    : isSetup && password.length < PASSWORD_MIN
      ? t('validation.passwordMin', { min: PASSWORD_MIN })
      : null

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (emailError || passwordError) {
      setAttempted(true)
      return
    }
    setBusy(true)
    setError('')
    try {
      const payload: Record<string, string> = { email, password }
      if (isSetup && setupCode) payload.setupCode = setupCode.trim()
      const res = await apiFetch<{ token: string }>(isSetup ? '/api/auth/setup' : '/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      setToken(res.token)
      onAuthed()
    } catch (err) {
      if (isSetup && (err as ApiError).code === 'setup_code_required') {
        setCodeRequired(true)
      }
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col items-center mb-8">
        <div className="mb-4">
          <Logo />
        </div>
        <h1 className="text-xl font-semibold tracking-tight">ModelHub</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Unified LLM Router &middot; {isSetup ? 'Get started' : 'Welcome back'}
        </p>
      </div>

      <div className="rounded-2xl border bg-card/80 backdrop-blur-sm p-6 shadow-sm">
        <h2 className="text-sm font-medium mb-1">
          {isSetup ? t('auth.createYourAccount') : t('auth.signIn')}
        </h2>
        <p className="text-xs text-muted-foreground mb-5">
          {isSetup ? t('auth.setupDescription') : t('auth.loginDescription')}
        </p>

        <form onSubmit={submit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium" htmlFor="auth-email">{t('auth.email')}</Label>
            <Input
              id="auth-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t('auth.emailPlaceholder')}
              aria-invalid={attempted && !!emailError}
              className="h-9"
            />
            {attempted && <FieldError error={emailError} />}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium" htmlFor="auth-password">{t('auth.password')}</Label>
            <Input
              id="auth-password"
              type="password"
              autoComplete={isSetup ? 'new-password' : 'current-password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={isSetup ? t('auth.passwordPlaceholderSetup') : t('auth.passwordPlaceholderLogin')}
              aria-invalid={attempted && !!passwordError}
              className="h-9"
            />
            {attempted && <FieldError error={passwordError} />}
          </div>

          {isSetup && codeRequired && (
            <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
              <Label className="text-xs font-medium" htmlFor="auth-setup-code">{t('auth.setupCode')}</Label>
              <Input
                id="auth-setup-code"
                type="text"
                autoComplete="off"
                value={setupCode}
                onChange={e => setSetupCode(e.target.value)}
                placeholder={t('auth.setupCodePlaceholder')}
                className="h-9"
              />
              <p className="text-xs text-muted-foreground">{t('auth.setupCodeHint')}</p>
            </div>
          )}

          {error && (
            <p className="text-destructive text-xs flex items-center gap-1.5">
              <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5 shrink-0">
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1ZM7 5a1 1 0 0 1 2 0v3a1 1 0 1 1-2 0V5Zm1 6.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
              </svg>
              {error}
            </p>
          )}

          <Button type="submit" className="w-full h-9" disabled={busy}>
            {busy ? (
              <span className="flex items-center gap-1.5">
                <svg className="animate-spin size-3.5" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" opacity="0.25" />
                  <path d="M14 8A6 6 0 0 1 2 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                {isSetup ? t('auth.creating') : t('auth.signingIn')}
              </span>
            ) : isSetup ? t('auth.createAccount') : t('auth.signIn')}
          </Button>
        </form>
      </div>
    </div>
  )
}

export function AuthGate({ children }: { children: ReactNode }) {
  const { t } = useI18n()
  const queryClient = useQueryClient()
  const { data, isLoading, isError, refetch } = useQuery<AuthStatus>({
    queryKey: ['auth-status'],
    queryFn: () => apiFetch('/api/auth/status'),
    retry: false,
  })

  useEffect(() => {
    const handler = () => { refetch() }
    window.addEventListener(UNAUTHORIZED_EVENT, handler)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handler)
  }, [refetch])

  function onAuthed() {
    queryClient.invalidateQueries()
    refetch()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin size-5 text-muted-foreground" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" opacity="0.25" />
            <path d="M14 8A6 6 0 0 1 2 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p className="text-sm text-muted-foreground">{t('auth.loading')}</p>
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center text-center max-w-xs">
          <div className="size-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-6 text-destructive">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">
            {t('auth.serverUnreachableBefore')}<code className="font-mono text-xs">npm run dev</code>{t('auth.serverUnreachableAfter')}
          </p>
        </div>
      </div>
    )
  }

  if (data.needsSetup) {
    return (
      <AuthLayout>
        <AuthForm mode="setup" onAuthed={onAuthed} />
      </AuthLayout>
    )
  }

  if (!data.authenticated) {
    return (
      <AuthLayout>
        <AuthForm mode="login" onAuthed={onAuthed} />
      </AuthLayout>
    )
  }

  return <>{children}</>
}

function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden p-4">
      {/* Decorative gradient orbs */}
      <div className="pointer-events-none absolute inset-0 select-none">
        <div className="absolute -top-32 -right-32 size-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 size-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 size-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 size-48 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {children}
      </div>
    </div>
  )
}
