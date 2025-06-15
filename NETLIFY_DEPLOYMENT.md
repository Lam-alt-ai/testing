# Militect Tesla-Style Configurator - Netlify Deployment Guide

## Quick Deployment Steps

### 1. Prepare Repository
Upload these files to your Git repository:
- `netlify.toml` (configuration)
- `netlify/functions/app.py` (serverless backend)
- `templates/` (HTML templates)
- `static/` (CSS, JS, assets)

### 2. Environment Variables
In your Netlify dashboard, set these environment variables:
- `DISCORD_CLIENT_ID`: Your Discord application client ID
- `DISCORD_CLIENT_SECRET`: Your Discord application client secret
- `URL`: Your Netlify site URL (e.g., `militect-configurator.netlify.app`)

### 3. Discord OAuth Configuration
Update your Discord application settings:
1. Go to https://discord.com/developers/applications
2. Select your application
3. Navigate to OAuth2 → General
4. Add redirect URI: `https://YOUR-SITE.netlify.app/callback`
5. Replace `YOUR-SITE` with your actual Netlify subdomain

### 4. Deploy to Netlify
1. Connect your Git repository to Netlify
2. Build command: `pip install -r requirements.txt` (handled automatically)
3. Publish directory: `.` (root)
4. Deploy!

## Features Included

### Tesla-Style Interface
- Academy Theme selection (USA/UK/Other with custom input)
- Environment options (Tropical/Snowy/Grass/Desert)
- Three layout types with visual previews
- Real-time pricing calculator
- Professional animations and transitions

### Payment Integration
- Robux gamepass payments
- USD Stripe/PayPal processing
- Automatic Discord ticket creation
- Terms of Service validation

### Technical Implementation
- Serverless Python backend
- Discord OAuth authentication
- SQLite database for orders
- Responsive design
- Security console warnings

## File Structure
```
/
├── netlify.toml
├── netlify/functions/app.py
├── templates/
│   ├── militect_index.html
│   └── militect_configurator.html
├── static/
│   ├── militect_styles.css
│   ├── militect_configurator.js
│   ├── militect_landing.js
│   └── preview-default.jpg
└── NETLIFY_DEPLOYMENT.md
```

## URLs After Deployment
- Landing page: `https://your-site.netlify.app/`
- Demo configurator: `https://your-site.netlify.app/demo`
- Full configurator: `https://your-site.netlify.app/configurator` (requires Discord login)

## Testing
1. Test the demo configurator first: `/demo`
2. Verify Discord OAuth flow: `/login`
3. Test purchase workflows with demo data
4. Confirm all static assets load correctly

## Support
The configurator automatically creates Discord tickets for your development team when customers complete purchases, streamlining your map commission workflow.