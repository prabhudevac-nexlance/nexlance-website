from PIL import Image, ImageEnhance

src_path = 'C:/Users/chinn/.gemini/antigravity/brain/b8255ad3-e851-4c06-9c90-5def38d5dff0/.user_uploaded/media_1786599321146.png'
base_dir = 'C:/Users/chinn/.gemini/antigravity/scratch/nexlance-website'

img = Image.open(src_path).convert('RGBA')

# Tight crop around non-transparent pixels
bbox = img.getbbox()
if bbox:
    cropped = img.crop(bbox)
else:
    cropped = img

# Create square canvas for uniform scaling
max_dim = max(cropped.width, cropped.height)
# Add minimal 2% padding so edges are smooth
padding = int(max_dim * 0.02)
canvas_size = max_dim + (padding * 2)

square = Image.new('RGBA', (canvas_size, canvas_size), (0, 0, 0, 0))
offset_x = (canvas_size - cropped.width) // 2
offset_y = (canvas_size - cropped.height) // 2
square.paste(cropped, (offset_x, offset_y))

# Save high-res master icon in assets
square.resize((512, 512), Image.Resampling.LANCZOS).save(f'{base_dir}/assets/logo-icon.png', 'PNG')
square.resize((512, 512), Image.Resampling.LANCZOS).save(f'{base_dir}/assets/favicon-512x512.png', 'PNG')
square.resize((192, 192), Image.Resampling.LANCZOS).save(f'{base_dir}/assets/favicon-192x192.png', 'PNG')
square.resize((144, 144), Image.Resampling.LANCZOS).save(f'{base_dir}/assets/favicon-144x144.png', 'PNG')
square.resize((96, 96), Image.Resampling.LANCZOS).save(f'{base_dir}/assets/favicon-96x96.png', 'PNG')
square.resize((48, 48), Image.Resampling.LANCZOS).save(f'{base_dir}/assets/favicon-48x48.png', 'PNG')
square.resize((32, 32), Image.Resampling.LANCZOS).save(f'{base_dir}/assets/favicon.png', 'PNG')

# Generate multi-size favicon.ico at root
square.save(f'{base_dir}/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])

print("All favicons generated successfully!")
