import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.smartagenda',
  appName: 'Smart Agenda',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
}

export default config
