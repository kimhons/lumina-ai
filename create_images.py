import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import random

# Create directory for images if it doesn't exist
os.makedirs('/home/ubuntu/lumina-ai-website/images', exist_ok=True)

# Define color palette based on Lumina AI branding
colors = {
    'primary': (41, 128, 185),      # Blue
    'secondary': (26, 188, 156),    # Teal
    'accent': (155, 89, 182),       # Purple
    'dark': (44, 62, 80),           # Dark blue
    'light': (236, 240, 241),       # Light gray
    'white': (255, 255, 255),       # White
    'black': (0, 0, 0)              # Black
}

# Function to create a logo
def create_logo():
    # Create a 200x200 image with transparent background
    img = Image.new('RGBA', (200, 200), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw a circle
    draw.ellipse((20, 20, 180, 180), fill=colors['primary'])
    
    # Draw an inner circle
    draw.ellipse((40, 40, 160, 160), fill=colors['secondary'])
    
    # Draw a stylized "L" for Lumina
    points = [(60, 70), (90, 70), (90, 130), (140, 130), (140, 150), (60, 150)]
    draw.polygon(points, fill=colors['white'])
    
    # Save the logo
    img.save('/home/ubuntu/lumina-ai-website/images/lumina_ai_logo.png')
    print("Created logo: lumina_ai_logo.png")

# Function to create abstract tech background
def create_tech_background():
    width, height = 1200, 600
    img = Image.new('RGB', (width, height), colors['dark'])
    draw = ImageDraw.Draw(img)
    
    # Draw network of connected nodes
    nodes = []
    for _ in range(30):
        x = random.randint(50, width-50)
        y = random.randint(50, height-50)
        size = random.randint(5, 15)
        nodes.append((x, y, size))
    
    # Draw connections between nodes
    for i in range(len(nodes)):
        for j in range(i+1, len(nodes)):
            if random.random() < 0.2:  # 20% chance to connect nodes
                x1, y1, _ = nodes[i]
                x2, y2, _ = nodes[j]
                # Gradient line from blue to teal
                for t in range(0, 100, 2):
                    t = t / 100.0
                    x = int(x1 * (1-t) + x2 * t)
                    y = int(y1 * (1-t) + y2 * t)
                    r = int(colors['primary'][0] * (1-t) + colors['secondary'][0] * t)
                    g = int(colors['primary'][1] * (1-t) + colors['secondary'][1] * t)
                    b = int(colors['primary'][2] * (1-t) + colors['secondary'][2] * t)
                    draw.ellipse((x-1, y-1, x+1, y+1), fill=(r, g, b, 128))
    
    # Draw nodes
    for x, y, size in nodes:
        draw.ellipse((x-size, y-size, x+size, y+size), 
                     fill=random.choice([colors['primary'], colors['secondary'], colors['accent']]))
    
    # Apply slight blur for a glow effect
    img = img.filter(ImageFilter.GaussianBlur(radius=1))
    
    # Save the background
    img.save('/home/ubuntu/lumina-ai-website/images/tech_background.jpg', quality=90)
    print("Created background: tech_background.jpg")

# Function to create feature icons
def create_feature_icons():
    features = [
        'multi-agent', 'workflow', 'deployment', 
        'integration', 'governance', 'enduser'
    ]
    
    size = 200
    for feature in features:
        img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # Draw circle background
        draw.ellipse((10, 10, size-10, size-10), fill=colors['primary'])
        
        # Draw feature-specific icon
        if feature == 'multi-agent':
            # Draw multiple connected circles for agents
            positions = [(60, 60), (140, 60), (60, 140), (140, 140)]
            for x, y in positions:
                draw.ellipse((x-20, y-20, x+20, y+20), fill=colors['white'])
            
            # Connect the circles
            draw.line([(60, 60), (140, 60), (140, 140), (60, 140), (60, 60)], 
                      fill=colors['white'], width=5)
            draw.line([(60, 60), (140, 140)], fill=colors['white'], width=5)
            
        elif feature == 'workflow':
            # Draw flowchart-like icon
            draw.rectangle((50, 40, 150, 70), fill=colors['white'])
            draw.rectangle((50, 90, 150, 120), fill=colors['white'])
            draw.rectangle((50, 140, 150, 170), fill=colors['white'])
            
            # Connect boxes with arrows
            draw.line([(100, 70), (100, 90)], fill=colors['white'], width=5)
            draw.line([(100, 120), (100, 140)], fill=colors['white'], width=5)
            
            # Arrow heads
            draw.polygon([(90, 85), (100, 95), (110, 85)], fill=colors['white'])
            draw.polygon([(90, 135), (100, 145), (110, 135)], fill=colors['white'])
            
        elif feature == 'deployment':
            # Draw server rack icon
            draw.rectangle((60, 40, 140, 160), fill=colors['white'])
            
            # Server details
            for y in range(60, 160, 25):
                draw.rectangle((70, y, 130, y+15), fill=colors['primary'])
                draw.ellipse((120, y+5, 125, y+10), fill=colors['secondary'])
            
        elif feature == 'integration':
            # Draw puzzle pieces
            draw.rectangle((50, 50, 100, 100), fill=colors['white'])
            draw.rectangle((100, 50, 150, 100), fill=colors['white'])
            draw.rectangle((50, 100, 100, 150), fill=colors['white'])
            draw.rectangle((100, 100, 150, 150), fill=colors['white'])
            
            # Puzzle connectors
            draw.ellipse((90, 70, 110, 90), fill=colors['primary'])
            draw.ellipse((70, 90, 90, 110), fill=colors['primary'])
            draw.ellipse((110, 90, 130, 110), fill=colors['primary'])
            draw.ellipse((90, 110, 110, 130), fill=colors['primary'])
            
        elif feature == 'governance':
            # Draw shield icon
            draw.polygon([(100, 40), (160, 60), (140, 150), (100, 170), (60, 150), (40, 60)], 
                         fill=colors['white'])
            
            # Check mark inside shield
            draw.line([(70, 100), (90, 130), (130, 80)], fill=colors['primary'], width=8)
            
        elif feature == 'enduser':
            # Draw user interface icon
            draw.rectangle((50, 50, 150, 150), fill=colors['white'])
            
            # Header bar
            draw.rectangle((50, 50, 150, 70), fill=colors['secondary'])
            
            # Content lines
            for y in range(85, 140, 15):
                draw.line([(60, y), (140, y)], fill=colors['light'], width=4)
            
            # User icon
            draw.ellipse((90, 100, 110, 120), fill=colors['primary'])
            draw.rectangle((85, 120, 115, 140), fill=colors['primary'])
        
        # Save the icon
        img.save(f'/home/ubuntu/lumina-ai-website/images/feature-{feature}.png')
        print(f"Created feature icon: feature-{feature}.png")

# Function to create office images
def create_office_images():
    offices = ['sf', 'london', 'singapore']
    width, height = 400, 250
    
    for office in offices:
        img = Image.new('RGB', (width, height), colors['light'])
        draw = ImageDraw.Draw(img)
        
        # Draw a stylized office building
        if office == 'sf':
            # San Francisco style building
            draw.rectangle((100, 50, 300, 220), fill=colors['primary'])
            
            # Windows
            for y in range(70, 200, 30):
                for x in range(120, 280, 40):
                    draw.rectangle((x, y, x+20, y+20), fill=colors['light'])
            
            # Golden Gate Bridge element
            draw.line([(0, 100), (100, 50)], fill=colors['accent'], width=10)
            draw.line([(width, 100), (300, 50)], fill=colors['accent'], width=10)
            draw.line([(0, 100), (width, 100)], fill=colors['accent'], width=5)
            
        elif office == 'london':
            # London style building with Big Ben
            draw.rectangle((100, 70, 200, 220), fill=colors['primary'])
            
            # Windows
            for y in range(90, 200, 30):
                for x in range(120, 180, 30):
                    draw.rectangle((x, y, x+15, y+20), fill=colors['light'])
            
            # Big Ben tower
            draw.rectangle((220, 30, 270, 220), fill=colors['secondary'])
            draw.rectangle((235, 40, 255, 70), fill=colors['light'])  # Clock face
            
            # London Eye element
            draw.arc((300, 50, 380, 200), 0, 360, fill=colors['accent'], width=5)
            for angle in range(0, 360, 30):
                rads = np.radians(angle)
                x = 340 + 40 * np.cos(rads)
                y = 125 + 40 * np.sin(rads)
                draw.ellipse((x-5, y-5, x+5, y+5), fill=colors['light'])
            
        elif office == 'singapore':
            # Singapore style building with Marina Bay Sands
            for i in range(3):
                draw.rectangle((100 + i*70, 70, 150 + i*70, 180), fill=colors['primary'])
                
                # Windows
                for y in range(90, 170, 20):
                    draw.rectangle((110 + i*70, y, 140 + i*70, y+10), fill=colors['light'])
            
            # Top connecting structure
            draw.rectangle((100, 50, 290, 70), fill=colors['secondary'])
            
            # Merlion element
            draw.ellipse((50, 120, 80, 150), fill=colors['accent'])  # Head
            draw.polygon([(65, 150), (50, 220), (80, 220)], fill=colors['accent'])  # Body
            
        # Add city name
        try:
            # This will work if a font is available
            font = ImageFont.truetype("DejaVuSans.ttf", 24)
            draw.text((width//2, 20), office.upper(), fill=colors['dark'], font=font, anchor="mm")
        except:
            # Fallback if font not available
            pass
        
        # Save the office image
        img.save(f'/home/ubuntu/lumina-ai-website/images/office-{office}.jpg', quality=90)
        print(f"Created office image: office-{office}.jpg")

# Function to create team member images
def create_team_images():
    roles = ['ceo', 'cto', 'cpo', 'cso']
    width, height = 300, 300
    
    for role in roles:
        img = Image.new('RGB', (width, height), colors['light'])
        draw = ImageDraw.Draw(img)
        
        # Background gradient
        for y in range(height):
            r = int(colors['light'][0] * (1 - y/height) + colors['primary'][0] * (y/height))
            g = int(colors['light'][1] * (1 - y/height) + colors['primary'][1] * (y/height))
            b = int(colors['light'][2] * (1 - y/height) + colors['primary'][2] * (y/height))
            draw.line([(0, y), (width, y)], fill=(r, g, b))
        
        # Draw abstract person silhouette
        draw.ellipse((100, 50, 200, 150), fill=colors['dark'])  # Head
        draw.polygon([(120, 150), (180, 150), (200, 300), (100, 300)], fill=colors['dark'])  # Body
        
        # Role-specific elements
        if role == 'ceo':
            # CEO with leadership symbol
            draw.polygon([(150, 20), (180, 40), (120, 40)], fill=colors['accent'])
        elif role == 'cto':
            # CTO with tech symbol
            for i in range(3):
                draw.rectangle((120 + i*20, 20, 130 + i*20, 40), fill=colors['secondary'])
        elif role == 'cpo':
            # CPO with product symbol
            draw.rectangle((120, 20, 180, 40), fill=colors['secondary'])
            draw.line([(130, 30), (170, 30)], fill=colors['white'], width=2)
            draw.line([(150, 20), (150, 40)], fill=colors['white'], width=2)
        elif role == 'cso':
            # CSO with science symbol
            draw.ellipse((130, 20, 170, 40), fill=colors['accent'])
            draw.ellipse((140, 25, 160, 35), fill=colors['white'])
        
        # Save the team member image
        img.save(f'/home/ubuntu/lumina-ai-website/images/team-{role}.jpg', quality=90)
        print(f"Created team image: team-{role}.jpg")

# Function to create investor logos
def create_investor_logos():
    investors = ['1', '2', '3', '4', '5', '6']
    width, height = 200, 100
    
    for investor in investors:
        img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # Different logo styles for each investor
        if investor == '1':  # Horizon Ventures
            draw.rectangle((50, 30, 150, 70), outline=colors['primary'], width=3)
            try:
                font = ImageFont.truetype("DejaVuSans.ttf", 16)
                draw.text((100, 50), "HORIZON", fill=colors['primary'], font=font, anchor="mm")
            except:
                pass
            
        elif investor == '2':  # Innovation Capital
            draw.ellipse((60, 25, 140, 75), outline=colors['secondary'], width=3)
            try:
                font = ImageFont.truetype("DejaVuSans.ttf", 14)
                draw.text((100, 50), "INNOVATION", fill=colors['secondary'], font=font, anchor="mm")
            except:
                pass
            
        elif investor == '3':  # Future Fund
            draw.polygon([(100, 20), (150, 80), (50, 80)], outline=colors['accent'], width=3)
            try:
                font = ImageFont.truetype("DejaVuSans.ttf", 14)
                draw.text((100, 60), "FUTURE", fill=colors['accent'], font=font, anchor="mm")
            except:
                pass
            
        elif investor == '4':  # Tech Pioneers
            # Tech circuit board style logo
            draw.rectangle((50, 30, 150, 70), fill=colors['dark'])
            for i in range(5):
                draw.line([(60 + i*20, 30), (60 + i*20, 70)], fill=colors['light'], width=2)
            for i in range(3):
                draw.line([(50, 40 + i*15), (150, 40 + i*15)], fill=colors['light'], width=2)
            
        elif investor == '5':  # Global Ventures
            # Globe style logo
            draw.ellipse((70, 20, 130, 80), outline=colors['primary'], width=3)
            draw.arc((70, 20, 130, 80), 0, 180, fill=colors['primary'], width=2)
            draw.arc((70, 20, 130, 80), 180, 360, fill=colors['primary'], width=2)
            draw.line([(70, 50), (130, 50)], fill=colors['primary'], width=2)
            
        elif investor == '6':  # Enterprise Partners
            # Building blocks logo
            for i in range(3):
                for j in range(2):
                    draw.rectangle((60 + i*30, 30 + j*25, 80 + i*30, 50 + j*25), 
                                  outline=colors['secondary'], width=2)
        
        # Save the investor logo
        img.save(f'/home/ubuntu/lumina-ai-website/images/investor-{investor}.png')
        print(f"Created investor logo: investor-{investor}.png")

# Function to create mission illustration
def create_mission_illustration():
    width, height = 500, 300
    img = Image.new('RGB', (width, height), colors['white'])
    draw = ImageDraw.Draw(img)
    
    # Draw abstract network of connected agents
    center_x, center_y = width // 2, height // 2
    radius = 100
    
    # Central node
    draw.ellipse((center_x - 30, center_y - 30, center_x + 30, center_y + 30), 
                 fill=colors['primary'])
    
    # Surrounding nodes
    node_positions = []
    for i in range(6):
        angle = np.radians(i * 60)
        x = center_x + radius * np.cos(angle)
        y = center_y + radius * np.sin(angle)
        node_positions.append((x, y))
        
        node_color = colors['secondary'] if i % 2 == 0 else colors['accent']
        draw.ellipse((x - 20, y - 20, x + 20, y + 20), fill=node_color)
        
        # Connect to center
        draw.line([(center_x, center_y), (x, y)], fill=colors['dark'], width=3)
    
    # Connect nodes in a circle
    for i in range(len(node_positions)):
        start = node_positions[i]
        end = node_positions[(i + 1) % len(
(Content truncated due to size limit. Use line ranges to read in chunks)