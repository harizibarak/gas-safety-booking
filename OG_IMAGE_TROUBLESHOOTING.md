# OG Image Troubleshooting Guide

If your OG image is not showing on WhatsApp/Facebook, follow these steps:

## Step 1: Verify Image is Accessible

1. **Check the image URL directly**:
   Open in browser: `https://gas-safety-booking.vercel.app/og-image.png`
   - Should load and display the image
   - If it doesn't, the file might not be deployed correctly

2. **Verify file exists**:
   - File should be in `public/og-image.png`
   - After build, it should be in `dist/og-image.png`
   - File size should be under 8MB (recommended: under 1MB)

## Step 2: Clear Facebook/WhatsApp Cache

Facebook and WhatsApp aggressively cache OG images. You need to clear their cache:

### Facebook Sharing Debugger:
1. Go to: https://developers.facebook.com/tools/debug/
2. Enter your URL: `https://gas-safety-booking.vercel.app/`
3. Click "Debug"
4. Click "Scrape Again" to force refresh
5. Check if the image appears

### WhatsApp:
WhatsApp uses Facebook's cache, so clearing Facebook cache should help. However, WhatsApp can take longer to update.

**Note**: After clearing cache, wait a few minutes and test again.

## Step 3: Verify Image Requirements

Your OG image must meet these requirements:
- ✅ Minimum size: 200x200 pixels (yours: 1200x630 - perfect!)
- ✅ Maximum size: 8MB
- ✅ Format: PNG, JPG, or GIF
- ✅ Must be publicly accessible (no authentication)
- ✅ Must be served over HTTPS

## Step 4: Check Image URL in Meta Tags

Verify the URL in your HTML source:
```html
<meta property="og:image" content="https://gas-safety-booking.vercel.app/og-image.png" />
```

Make sure:
- URL is absolute (starts with https://)
- URL matches your actual Vercel domain
- No typos in the filename

## Step 5: Test Image Accessibility

Run these checks:

1. **Direct URL test**:
   ```bash
   curl -I https://gas-safety-booking.vercel.app/og-image.png
   ```
   Should return `200 OK` and `Content-Type: image/png`

2. **Check in browser**:
   - Open the image URL directly
   - Should display the image
   - Check browser console for errors

## Step 6: Alternative Solutions

If still not working:

1. **Use a CDN**:
   - Upload image to a CDN (Cloudinary, Imgur, etc.)
   - Update meta tags with CDN URL

2. **Use a different filename**:
   - Sometimes changing the filename helps
   - Try `og-image.jpg` or `social-preview.png`

3. **Check Vercel deployment**:
   - Ensure `public/` folder files are included in build
   - Check Vercel build logs for any errors

## Common Issues

### Issue: Image shows in debugger but not in WhatsApp
**Solution**: Wait 24-48 hours for WhatsApp cache to update, or try sharing a different URL (add `?v=2` to force refresh)

### Issue: Image is too large
**Solution**: Compress the image using tools like TinyPNG or ImageOptim

### Issue: Image format not supported
**Solution**: Convert to PNG or JPG format

### Issue: CORS or authentication errors
**Solution**: Ensure image is publicly accessible, no login required

## Quick Test Checklist

- [ ] Image URL loads directly in browser
- [ ] Image is under 1MB
- [ ] Image is 1200x630 pixels
- [ ] Meta tags are in HTML source
- [ ] Facebook debugger shows image after scraping
- [ ] URL is absolute (https://)
- [ ] No typos in domain or filename

## Still Not Working?

1. Try using Facebook's Sharing Debugger to see exact error messages
2. Check Vercel deployment logs
3. Verify the image file is actually in the `dist/` folder after build
4. Try a different image to rule out file corruption


