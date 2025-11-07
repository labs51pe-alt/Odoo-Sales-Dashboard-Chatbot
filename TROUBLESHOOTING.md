# Troubleshooting: "Odoo environment variables are not set"

¡Hola! Si estás viendo este error, ¡no te preocupes! Es un problema muy común y la solución suele ser muy sencilla. Has llegado al último obstáculo.

Este error significa que tu función de Supabase (`get-odoo-sales`) no puede encontrar las credenciales de Odoo que guardaste en los "Secrets". Aunque estés seguro de que los guardaste, a veces la función necesita un "reinicio" para poder leerlos.

---

### ✅ Solución Principal: Re-desplegar la Función

La causa más probable (99% de las veces) es que la función necesita ser actualizada para cargar los nuevos secretos que has añadido.

1.  **Abre tu terminal** en la carpeta de tu proyecto (`mi-dashboard-backend`).
2.  **Ejecuta el siguiente comando** para volver a desplegar únicamente la función de Odoo:

    ```bash
    supabase functions deploy get-odoo-sales --no-verify-jwt
    ```
3.  Espera a que el comando termine. Una vez que diga `Deployed Functions...`, **recarga la página de tu aplicación en el navegador**.

¡Con esto debería ser suficiente para solucionar el problema!

---

### 🔍 Si el problema persiste: Checklist de Verificación de Secretos

Si después de re-desplegar la función sigues viendo el error, por favor, verifica que los nombres de tus secretos en el dashboard de Supabase sean **exactamente** como se muestra a continuación. Un pequeño error tipográfico puede ser la causa.

1.  Ve a tu proyecto en Supabase -> `Edge Functions` -> `Secrets`.
2.  Compara tus secretos con esta lista. **Presta especial atención a los guiones bajos (`_`).**

| Nombre Exacto del Secreto | Ejemplo de Valor |
| :------------------------ | :------------------------- |
| `ODOO_URL`                | `https://vida.facturaclic.pe` |
| `ODOO_DB`                 | `vida_master`              |
| `ODOO_USER`               | `soporte@facturaclic.pe`   |
| `ODOO_API_KEY`            | `Tu clave API de Odoo`      |
| `GEMINI_API_KEY`          | `Tu clave API de Gemini`    |

**Errores Comunes a Evitar:**
*   Escribir `ODOO-URL` en lugar de `ODOO_URL`.
*   Un espacio en blanco al principio o al final del nombre o del valor.

Si encuentras un error, corrígelo, haz clic en **`Save`**, y luego **vuelve a ejecutar el comando de re-despliegue** del paso anterior.

¡Estás a un paso de que todo funcione!
