#!/usr/bin/env python3
"""
Simple HTTP server for 20/59 Ventures website
"""
from http.server import HTTPServer, SimpleHTTPRequestHandler
import sys
import os

class CustomHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        sys.stdout.write(f"{self.log_date_time_string()} - {format%args}\n")
        sys.stdout.flush()

if __name__ == "__main__":
    # Change to the correct directory
    os.chdir('/home/user/webapp')
    
    server_address = ('0.0.0.0', 8000)
    server = HTTPServer(server_address, CustomHandler)
    
    print("20/59 Ventures website server starting on port 8000")
    print("Serving files from: /home/user/webapp")
    sys.stdout.flush()
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer shutting down...")
        server.shutdown()