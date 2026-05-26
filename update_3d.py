import re

# --- 1. UPDATE CSS ---
with open('static/style.css', 'r') as f:
    css = f.read()

# Replace the existing interaction block with the new amplified one
css_replacement = """/* --- 3D PUSH BACK & CURSOR HIGHLIGHT --- */
.about-card, .form, .donate-wheelchair-card, 
.donate-shower-chair-card, .donate-crutches-card, .donate-total-card, 
.get-supplies-selection-card, .get-supplies-form-card, .schedule-pickup-card, 
.donate-confirmation-card, .get-supplies-confirmation-card {
    /* Ensure transform is transitioned */
    transition: transform 0.6s var(--spring-bounce), 
                box-shadow 0.6s var(--spring-bounce), 
                border-color 0.4s ease;
}

.about-card:hover, .form:hover, .donate-wheelchair-card:hover,
.donate-shower-chair-card:hover, .donate-crutches-card:hover,
.donate-total-card:hover, .get-supplies-selection-card:hover,
.get-supplies-form-card:hover, .schedule-pickup-card:hover,
.donate-confirmation-card:hover, .get-supplies-confirmation-card:hover {
    /* AMPLIFIED PUSH BACK: Deeper scale and stronger translate */
    transform: perspective(1000px) scale(0.93) translateY(12px) rotateX(2deg);

    /* HIGHLIGHT & SHADOW: Radial gradient tracking the cursor */
    /* Center highlight, transitioning to a slight darkening shadow elsewhere */
    background: radial-gradient(
        500px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
        rgba(255, 255, 255, 0.8) 0%,
        rgba(255, 255, 255, 0.1) 40%,
        rgba(15, 25, 50, 0.08) 100%
    );
    backdrop-filter: blur(50px) saturate(140%);

    /* Deep internal shadows to emphasize being pressed into the page */
    box-shadow:
        inset 2px 2px 4px rgba(255, 255, 255, 0.9),
        inset 0px 20px 40px rgba(31, 38, 135, 0.15),
        inset 0px -5px 15px rgba(0, 0, 0, 0.05),
        0 2px 5px rgba(0, 0, 0, 0.05);

    border-color: rgba(255, 255, 255, 0.5);
}"""

# Remove old interactions
css = re.sub(r'/\* --- 3D TILT INTERACTION.*?}', '', css, flags=re.DOTALL)
css = re.sub(r'/\* --- 3D PUSH BACK INTERACTION.*?}', '', css, flags=re.DOTALL)
css = re.sub(r'/\* =========================================\s*14\. CURSOR HIGHLIGHT \+ VIGNETTE.*?}', '', css, flags=re.DOTALL)

# Insert the new interaction block before section 5
css = css.replace('/* =========================================\n   5. FLOATING NAVBAR', css_replacement + '\n\n/* =========================================\n   5. FLOATING NAVBAR')

with open('static/style.css', 'w') as f:
    f.write(css.strip() + '\n')


# --- 2. UPDATE JS ---
with open('static/script.js', 'r') as f:
    js = f.read()

js_addition = """

// --- MOUSE TRACKING FOR 3D CARDS ---
document.querySelectorAll('.about-card, .form, .donate-wheelchair-card, .donate-shower-chair-card, .donate-crutches-card, .donate-total-card, .get-supplies-selection-card, .get-supplies-form-card, .schedule-pickup-card, .donate-confirmation-card, .get-supplies-confirmation-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element.
        const y = e.clientY - rect.top;  // y position within the element.
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});
"""

if "// --- MOUSE TRACKING FOR 3D CARDS ---" not in js:
    with open('static/script.js', 'a') as f:
        f.write(js_addition)

