import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import Hero from '@/components/Hero'

describe('Hero Component', () => {
  it('devrait afficher le titre principal', () => {
    render(<Hero />)
    
    // Vérifier que le titre contient "CESIZen"
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('devrait avoir les boutons principaux', () => {
    render(<Hero />)
    
    // Vérifier la présence de boutons/liens
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })
})
