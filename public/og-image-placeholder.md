# Open Graph Image

To create a proper Open Graph image for social media previews:

1. **Create an image** (1200x630 pixels recommended):
   - Use a design tool (Figma, Canva, etc.)
   - Include your logo/branding
   - Add text: "Gas Safety Certificate Booking"
   - Save as `og-image.png`

2. **Place the image**:
   - Save it in the `public/` folder as `og-image.png`
   - Update `index.html` with your actual domain URL

3. **Alternative**: Use a service like:
   - [og-image.vercel.app](https://og-image.vercel.app) - Generate dynamic OG images
   - Or create a static image with your branding

4. **Update the URL** in `index.html`:
   - Replace `https://your-domain.vercel.app/` with your actual Vercel domain
   - Replace `og-image.png` path if you use a different filename

Example image specifications:
- Dimensions: 1200x630 pixels
- Format: PNG or JPG
- File size: Under 1MB (recommended)
- Content: Should represent your service/brand

