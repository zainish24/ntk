# SMS Provider Setup Guide

## ✅ Custom SMS Integration Complete!

Your project now supports **multiple Pakistani SMS providers**. Switch between providers by changing environment variables.

---

## 🔧 Setup Steps

### 1. Run OTP Table Script
In Supabase SQL Editor:
```sql
-- Run this script
scripts/006_otp_table.sql
```

### 2. Choose Your Provider

#### **Option A: Unifonic** (Recommended)
- **Website:** https://www.unifonic.com/pk
- **Cost:** Rs. 0.80-1.50 per SMS
- **Setup:**
  1. Create account
  2. Recharge Rs. 5,000 minimum
  3. Get API Key from dashboard

**Update .env.local:**
```env
SMS_PROVIDER=unifonic
SMS_API_KEY=your_unifonic_api_key
SMS_SENDER_ID=NTR
```

#### **Option B: Telenor**
- Contact Telenor Business
- Get API credentials

**Update .env.local:**
```env
SMS_PROVIDER=telenor
SMS_API_KEY=your_telenor_api_key
SMS_SENDER_ID=NTR
```

#### **Option C: Jazz**
- Contact Jazz Business
- Get API credentials

**Update .env.local:**
```env
SMS_PROVIDER=jazz
SMS_API_KEY=your_jazz_api_key
SMS_SENDER_ID=NTR
```

#### **Option D: Eocean**
- **Website:** https://eocean.us
- Get API Key

**Update .env.local:**
```env
SMS_PROVIDER=eocean
SMS_API_KEY=your_eocean_api_key
SMS_SENDER_ID=NTR
```

---

## 🔄 How to Switch Providers

**Sirf 3 lines change karo:**

```env
# Change these 3 lines in .env.local
SMS_PROVIDER=unifonic    # Change to: telenor, jazz, eocean
SMS_API_KEY=new_api_key  # New provider's API key
SMS_SENDER_ID=NTR        # Your sender name
```

**Restart server:**
```bash
npm run dev
```

**Done!** ✅

---

## 📝 Files Created

1. **scripts/006_otp_table.sql** - OTP storage table
2. **lib/sms-service.ts** - Multi-provider SMS service
3. **app/api/auth/send-otp/route.ts** - Send OTP API
4. **app/api/auth/verify-otp/route.ts** - Verify OTP API
5. **Updated:** app/auth/login/page.tsx - Custom OTP flow

---

## 🧪 Testing

### Test Without Real SMS:
```typescript
// In lib/sms-service.ts, temporarily add:
async sendOTP(phone: string, otp: string): Promise<boolean> {
  console.log(`TEST MODE - OTP for ${phone}: ${otp}`)
  return true // Skip actual SMS
}
```

Check console for OTP, then verify manually.

---

## 💰 Cost Comparison

| Provider | Cost/SMS | Minimum | Best For |
|----------|----------|---------|----------|
| Unifonic | Rs. 0.80-1.50 | Rs. 5,000 | ✅ Recommended |
| Eocean | Rs. 1-2 | Rs. 3,000 | Budget |
| Telenor | Rs. 2-3 | Contact | Enterprise |
| Jazz | Package | Contact | High Volume |

---

## 🚀 Production Checklist

- [ ] Run `006_otp_table.sql` in Supabase
- [ ] Choose SMS provider
- [ ] Get API credentials
- [ ] Update `.env.local`
- [ ] Test OTP flow
- [ ] Deploy to Vercel
- [ ] Add env vars in Vercel dashboard

---

## 🔐 Security Notes

- OTPs expire in 5 minutes
- One-time use only
- Stored securely in database
- Auto-cleanup of expired OTPs

---

## 📞 Provider Support

**Unifonic:** +92-21-111-111-123
**Eocean:** info@eocean.us
**Telenor:** Business Center
**Jazz:** Business Helpline

---

**Setup Complete!** 🎉

Your client can now use any Pakistani SMS provider!
