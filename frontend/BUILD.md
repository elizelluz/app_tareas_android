# Guía para Generar el APK con EAS Build

## Requisitos Previos

1. **Cuenta de Expo** — Crea una cuenta gratuita en https://expo.dev
2. **Node.js y npm** instalados en tu computadora
3. **EAS CLI** instalado globalmente:
   ```bash
   npm install -g eas-cli
   ```

---

## Pasos para Generar el APK

### Paso 1: Descargar el Código

Clona o descarga el repositorio:
```bash
git clone https://github.com/elizelluz/app_tareas_android.git
cd app_tareas_android/frontend
```

### Paso 2: Iniciar Sesión en EAS

```bash
eas login
```
Ingresa tu email y contraseña de Expo.

### Paso 3: Configurar el Proyecto

```bash
eas build:configure
```
Esto creará un proyecto en tu cuenta de Expo y te asignará un **Project ID**.

### Paso 4: Actualizar app.json con tu Project ID

Abre `app.json` y reemplaza `YOUR_EAS_PROJECT_ID` con el ID que obtuviste:

```json
"extra": {
  "eas": {
    "projectId": "TU-PROJECT-ID-AQUI"
  }
}
```

### Paso 5: Generar el APK

**Para un APK de prueba (preview) — recomendado:**
```bash
eas build --platform android --profile preview
```

**Para un APK de producción:**
```bash
eas build --platform android --profile production
```

### Paso 6: Esperar el Build

- El build se procesa en los servidores de Expo (~10-20 minutos)
- Recibirás un email cuando esté listo
- O revisa el progreso en: https://expo.dev → Projects → app-tareas

### Paso 7: Descargar el APK

1. Visita https://expo.dev
2. Ve a tu proyecto → Builds
3. Selecciona el build completado
4. Descarga el archivo `.apk`

---

## Instalar el APK en tu Teléfono

1. Transfiere el APK a tu dispositivo Android
2. Habilita *"Instalar apps de fuentes desconocidas"* en Ajustes
3. Toca el archivo APK para instalarlo

---

## Perfiles de Build

| Perfil | Comando | Tipo | Uso |
|--------|---------|------|-----|
| **Preview** | `eas build -p android --profile preview` | APK | Pruebas internas |
| **Production** | `eas build -p android --profile production` | APK | Release final |

---

## Solución de Problemas

**Error: "eas-cli not found"**
```bash
npm install -g eas-cli
```

**Error: "Not authenticated"**
```bash
eas login
```

**Error durante el build:**
- Revisa los logs en el dashboard de Expo
- Asegúrate de tener internet estable
- Verifica que `app.json` tenga el Project ID correcto

---

## Alternativa Rápida: Expo Go

Si solo quieres probar la app sin generar APK:
1. Instala **Expo Go** desde Google Play
2. Ejecuta `npx expo start` en la carpeta `frontend`
3. Escanea el QR con Expo Go

---

## Configuración Actual de la App

| Propiedad | Valor |
|-----------|-------|
| **Nombre** | App Tareas |
| **Package** | `com.elizelluz.apptareas` |
| **Versión** | 1.0.0 |
| **Build Type** | APK |
| **Android SDK** | 35 |

---

**¿Necesitas ayuda?** Abre un issue en https://github.com/elizelluz/app_tareas_android/issues
