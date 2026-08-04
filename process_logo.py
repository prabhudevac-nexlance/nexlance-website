from PIL import Image

src_path = 'C:/Users/chinn/.gemini/antigravity/brain/b8255ad3-e851-4c06-9c90-5def38d5dff0/.user_uploaded/media_1785841331335.jpg'
dest_path = 'C:/Users/chinn/.gemini/antigravity/scratch/nexlance-website/assets/logo.png'

img = Image.open(src_path).convert('RGBA')

new_pixels = []
for r, g, b, a in img.getdata():
    luminance = (0.299 * r + 0.587 * g + 0.114 * b)
    # Background is light (white/gray > 220)
    if luminance > 225:
        new_pixels.append((255, 255, 255, 0))
    else:
        # Smooth anti-aliased transparency for edges
        alpha = int(255 * (1.0 - (max(0, luminance - 50) / 175.0)))
        alpha = max(0, min(255, alpha))
        new_pixels.append((255, 255, 255, alpha))

img.putdata(new_pixels)

# Crop tight bounding box
bbox = img.getbbox()
if bbox:
    img = img.crop(bbox)

img.save(dest_path, 'PNG')
print(f"Processed logo saved successfully! Dimensions: {img.size}")
