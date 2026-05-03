import React, { createContext, useContext, useState, useEffect } from 'react'
import logoImg from '../assets/images/logo.png'

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [logoUrl, setLogoUrl] = useState(logoImg)
  const [siteName, setSiteName] = useState('Cleo')
  const [settings, setSettings] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  // Helper to parse booleans from strings
  const toBool = (val, fallback = false) => {
    if (val === null || val === undefined) return fallback
    if (typeof val === 'boolean') return val
    return val === 'true'
  }

  // Update tab title when siteName changes
  useEffect(() => {
    document.title = siteName
  }, [siteName])

  const fetchAllSettings = () => {
    setIsLoading(true)
    fetch('http://localhost:5000/api/public/settings')
      .then(r => r.json())
      .then(data => {
        // Update specific tracked states
        if (data.logoUrl) setLogoUrl(data.logoUrl)
        if (data.siteName) setSiteName(data.siteName)

        // Parse and store all settings for general use
        const parsedSettings = { ...data }
        // Pre-parse common booleans for convenience
        parsedSettings.allowRegistration = toBool(data.allowRegistration, true)
        parsedSettings.sessionTimeout = toBool(data.sessionTimeout, true)
        parsedSettings.pwdRequireLength = toBool(data.pwdRequireLength, true)
        parsedSettings.pwdRequireUppercase = toBool(data.pwdRequireUppercase, true)
        parsedSettings.showTips = toBool(data.showTips, true)
        parsedSettings.enableOvulationDisplay = toBool(data.enableOvulationDisplay, true)
        parsedSettings.showCycleSummary = toBool(data.showCycleSummary, true)
        // Parse sessionDuration to number (minutes)
        parsedSettings.sessionDuration = parseInt(data.sessionDuration) || 20

        setSettings(parsedSettings)
      })
      .catch((err) => {
        console.error("Failed to load settings:", err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    fetchAllSettings()
  }, [])

  return (
    <SettingsContext.Provider value={{
      logoUrl,
      siteName,
      settings,
      isLoading,
      setLogoUrl,
      setSiteName,
      refreshSettings: fetchAllSettings
    }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
