import re

with open('static/style.css', 'r') as f:
    content = f.read()

# 1. Unified Hover Logic for all cards
# We replace the old "SOFT GLOW" and any other stray hover blocks
new_hover = """/* --- 3D PUSH BACK INTERACTION --- */
.about-card:hover, .form:hover, .donate-wheelchair-card:hover, 
.donate-shower-chair-card:hover, .donate-crutches-card:hover, 
.donate-total-card:hover, .get-supplies-selection-card:hover, 
.get-supplies-form-card:hover, .schedule-pickup-card:hover, 
.donate-confirmation-card:hover, .get-supplies-confirmation-card:hover {
    /* Pushes the card back and down for physical depth */
    transform: scale(0.98) translateY(6px);
    
    /* Slight darkening to simulate recessed area */
    background: rgba(240, 244, 250, 0.7);
    backdrop-filter: blur(50px) saturate(140%);
    
    /* The Neomorphic 'Pushed In' Look */
    box-shadow: 
        /* Sharp inner white highlight on top/left (matching the reference image) */
        inset 3px 3px 5px rgba(255, 255, 255, 0.9),
        /* Broad inner shadow to create the hollowed-out depth */
        inset 0px 15px 35px rgba(31, 38, 135, 0.12),
        /* External glow is removed to emphasize the push */
        0 2px 4px rgba(0, 0, 0, 0.04);
        
    border-color: rgba(255, 255, 255, 0.4);
}"""

# Remove the old SOFT GLOW block
content = re.sub(r'/\* --- THE "SOFT GLOW" INTERACTION --- \*/.*?/\* =========================================', '/* =========================================', content, flags=re.DOTALL)

# Remove the recently added 3D INTERACTIVE HIGHLIGHT blocks at the end
content = re.sub(r'/\* --- 3D INTERACTIVE HIGHLIGHT --- \*/.*$', '', content, flags=re.DOTALL)
content = re.sub(r'/\* Enhancing the 3D "Pushed" Shadow \*/.*?}', '', content, flags=re.DOTALL)

# Insert the new hover block before the Navbar section
content = content.replace('/* =========================================\n   5. FLOATING NAVBAR', new_hover + '\n\n' + '/* =========================================\n   5. FLOATING NAVBAR')

with open('static/style.css', 'w') as f:
    f.write(content.strip() + '\n')
