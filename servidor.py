# Servidor local para probar la carga remota (fetch / $.getJSON) sin que el navegador la bloquee.
# Uso:  python servidor.py   y abrir  http://localhost:8000
import http.server
import socketserver
import webbrowser

PUERTO = 8000

class Manejador(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Evita que el navegador guarde datos.json en caché mientras pruebas
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

with socketserver.TCPServer(("", PUERTO), Manejador) as servidor:
    print(f"Dulce Nube Leonel en http://localhost:{PUERTO}  (Ctrl + C para detener)")
    webbrowser.open(f"http://localhost:{PUERTO}/index.html")
    servidor.serve_forever()
