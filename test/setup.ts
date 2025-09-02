import '@testing-library/jest-dom'
import { beforeAll, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Configuration globale pour les tests
beforeAll(() => {
  // Mock des variables d'environnement pour les tests
  process.env.NEXTAUTH_SECRET = 'test-secret'
  process.env.NEXTAUTH_URL = 'http://localhost:3000'
})

// Nettoyage après chaque test
afterEach(() => {
  cleanup()
})

// Mock de Next.js router
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  reload: vi.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
}

vi.mock('next/router', () => ({
  useRouter: () => mockRouter,
}))

// Mock de next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))
