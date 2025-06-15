import json
import os
import sqlite3
import requests
from datetime import datetime
from urllib.parse import urlencode

def handler(event, context):
    """Netlify serverless function for Militect configurator"""
    
    # Handle different HTTP methods and paths
    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')
    query_params = event.get('queryStringParameters') or {}
    
    # Static file serving
    if path.startswith('/static/'):
        return serve_static_file(path)
    
    # Route handling
    if path == '/' or path == '/index.html':
        return serve_landing_page()
    elif path == '/demo':
        return serve_configurator_demo()
    elif path == '/configurator':
        return serve_configurator()
    elif path == '/login':
        return handle_login()
    elif path == '/callback':
        return handle_oauth_callback(query_params)
    elif path == '/purchase' and method == 'POST':
        return handle_purchase(event)
    elif path == '/demo/purchase' and method == 'POST':
        return handle_demo_purchase(event)
    else:
        return {
            'statusCode': 404,
            'body': 'Page not found'
        }

def serve_landing_page():
    """Serve the main landing page"""
    with open('templates/militect_index.html', 'r') as f:
        content = f.read()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'text/html'},
        'body': content
    }

def serve_configurator_demo():
    """Serve demo configurator"""
    with open('templates/militect_configurator.html', 'r') as f:
        content = f.read()
    
    # Replace template variables for demo
    content = content.replace('{{ user.username }}', 'Demo User')
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'text/html'},
        'body': content
    }

def serve_static_file(path):
    """Serve static files"""
    file_path = path[1:]  # Remove leading slash
    
    try:
        content_types = {
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.jpg': 'image/jpeg',
            '.png': 'image/png',
            '.svg': 'image/svg+xml'
        }
        
        extension = os.path.splitext(file_path)[1]
        content_type = content_types.get(extension, 'text/plain')
        
        with open(file_path, 'r' if extension in ['.css', '.js'] else 'rb') as f:
            content = f.read()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': content_type},
            'body': content if extension in ['.css', '.js'] else content.decode('utf-8') if isinstance(content, bytes) else content
        }
    except FileNotFoundError:
        return {
            'statusCode': 404,
            'body': 'File not found'
        }

def handle_login():
    """Handle Discord OAuth login"""
    discord_client_id = os.environ.get('DISCORD_CLIENT_ID')
    redirect_uri = f"https://{os.environ.get('URL', 'your-site.netlify.app')}/callback"
    
    params = {
        'client_id': discord_client_id,
        'redirect_uri': redirect_uri,
        'response_type': 'code',
        'scope': 'identify email'
    }
    
    auth_url = f"https://discord.com/api/oauth2/authorize?{urlencode(params)}"
    
    return {
        'statusCode': 302,
        'headers': {'Location': auth_url},
        'body': ''
    }

def handle_oauth_callback(query_params):
    """Handle Discord OAuth callback"""
    code = query_params.get('code')
    error = query_params.get('error')
    
    if error:
        return {
            'statusCode': 302,
            'headers': {'Location': '/?error=oauth_failed'},
            'body': ''
        }
    
    if not code:
        return {
            'statusCode': 302,
            'headers': {'Location': '/?error=no_code'},
            'body': ''
        }
    
    # Exchange code for access token
    discord_client_id = os.environ.get('DISCORD_CLIENT_ID')
    discord_client_secret = os.environ.get('DISCORD_CLIENT_SECRET')
    redirect_uri = f"https://{os.environ.get('URL', 'your-site.netlify.app')}/callback"
    
    token_data = {
        'client_id': discord_client_id,
        'client_secret': discord_client_secret,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': redirect_uri
    }
    
    response = requests.post('https://discord.com/api/oauth2/token', data=token_data)
    
    if response.status_code == 200:
        token_info = response.json()
        access_token = token_info.get('access_token')
        
        # Get user info and redirect to configurator
        user_data = get_discord_user_info(access_token)
        if user_data:
            # Store session (in production, use proper session management)
            return {
                'statusCode': 302,
                'headers': {'Location': '/configurator'},
                'body': ''
            }
    
    return {
        'statusCode': 302,
        'headers': {'Location': '/?error=login_failed'},
        'body': ''
    }

def get_discord_user_info(access_token):
    """Get Discord user information"""
    headers = {'Authorization': f'Bearer {access_token}'}
    response = requests.get('https://discord.com/api/users/@me', headers=headers)
    
    if response.status_code == 200:
        return response.json()
    return None

def serve_configurator():
    """Serve authenticated configurator"""
    with open('templates/militect_configurator.html', 'r') as f:
        content = f.read()
    
    # In production, implement proper session management
    content = content.replace('{{ user.username }}', 'Authenticated User')
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'text/html'},
        'body': content
    }

def handle_purchase(event):
    """Handle authenticated purchase"""
    try:
        body = json.loads(event.get('body', '{}'))
        
        # Store order in database
        conn = sqlite3.connect('/tmp/militect.db')
        cursor = conn.cursor()
        
        # Initialize database if needed
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                username TEXT,
                academy_theme TEXT,
                custom_theme TEXT,
                environment TEXT,
                layout TEXT,
                addons TEXT,
                currency TEXT,
                total_price INTEGER,
                timestamp TEXT,
                status TEXT
            )
        ''')
        
        cursor.execute('''
            INSERT INTO orders (user_id, username, academy_theme, custom_theme, environment, layout, addons, currency, total_price, timestamp, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            'authenticated_user',
            'Authenticated User',
            body.get('academyTheme'),
            body.get('customTheme'),
            body.get('environment'),
            body.get('layout'),
            json.dumps(body.get('addons', [])),
            body.get('currency'),
            body.get('totalPrice'),
            body.get('timestamp'),
            'pending'
        ))
        
        conn.commit()
        conn.close()
        
        # Return payment URLs
        if body.get('currency') == 'robux':
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({
                    'success': True,
                    'gamepassUrl': 'https://www.roblox.com/game-pass/123456789/Military-Academy-Map'
                })
            }
        else:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({
                    'success': True,
                    'checkoutUrl': 'https://checkout.stripe.com/payment-session'
                })
            }
            
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Purchase failed'})
        }

def handle_demo_purchase(event):
    """Handle demo purchase"""
    try:
        body = json.loads(event.get('body', '{}'))
        
        # Simulate successful purchase
        if body.get('currency') == 'robux':
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({
                    'success': True,
                    'gamepassUrl': 'https://www.roblox.com/game-pass/123456789/Military-Academy-Map'
                })
            }
        else:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({
                    'success': True,
                    'checkoutUrl': 'https://checkout.stripe.com/demo-session'
                })
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Demo purchase failed'})
        }