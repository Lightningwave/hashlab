# Deployment Guide

## Deploying to GitHub Pages

### Method 1: Automatic Deployment (Recommended)

This project is configured with GitHub Actions for automatic deployment.

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - The workflow will automatically build and deploy

3. **Access your site:**
   - Your site will be available at: `https://<username>.github.io/<repository-name>/`
   - Wait 2-3 minutes for the first deployment to complete

### Method 2: Manual Deployment

If you prefer manual deployment:

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Build the WASM module:**
   ```bash
   cd ../rust-wasm
   wasm-pack build --release --target web --out-dir ../pkg --out-name rust_wasm
   ```

3. **Build and deploy:**
   ```bash
   cd ../frontend
   npm run deploy
   ```

4. **Configure GitHub Pages:**
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `root`
   - Save

### Configuration

The project is already configured for GitHub Pages deployment:

- ✅ `vite.config.js` has `base: './'` for relative paths
- ✅ `.github/workflows/deploy.yml` for automatic deployment
- ✅ `package.json` has deploy scripts
- ✅ `.gitignore` excludes build artifacts

### Troubleshooting

**Issue: WASM not loading**
- Make sure the `pkg/` directory is committed to your repo
- Or ensure the GitHub Actions workflow builds WASM

**Issue: 404 errors**
- Check that `base: './'` is set in `vite.config.js`
- Verify GitHub Pages is enabled in repository settings

**Issue: Build fails**
- Make sure all dependencies are listed in `package.json`
- Check that Node.js version is compatible (20+)

### Local Testing

Test the production build locally before deploying:

```bash
cd frontend
npm run build
npm run preview
```

Visit `http://localhost:4173` to test the production build.

### Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file in `frontend/public/`:
   ```
   yourdomain.com
   ```

2. Configure DNS records:
   - Add an A record pointing to GitHub's IPs
   - Or add a CNAME record pointing to `<username>.github.io`

3. Enable custom domain in GitHub Settings → Pages

## Production Checklist

Before deploying to production:

- [ ] Test all encryption/decryption functionality
- [ ] Test all hash algorithms
- [ ] Test all encoding/decoding features
- [ ] Verify WASM loads correctly
- [ ] Check browser console for errors
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices
- [ ] Verify all images load (logo, favicon)

## Updating the Site

To update your deployed site:

1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
3. GitHub Actions will automatically rebuild and deploy

Or manually:
```bash
cd frontend
npm run deploy
```

---

**Note:** All cryptographic operations run client-side. No data is sent to any server.

