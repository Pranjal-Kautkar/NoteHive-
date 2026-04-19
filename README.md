# 🐝 NoteHive

**NoteHive** is a beautifully designed, modern Student Note-Sharing Portal. It provides a centralized platform for students to upload, browse, and seamlessly download academic study materials and curriculum notes categorized elegantly by subjects.

## ✨ Features

- **Dynamic Categorization**: Notes uploaded are automatically grouped by standard academic subjects (e.g., Mathematics, Science, History, Computer Science).
- **Secure File Storage**: Direct file attachments (PDFs and Text files) via Supabase Storage integration.
- **Premium User Interface**: Extremely sleek, responsive UI leveraging the latest Tailwind CSS features, responsive grid systems, and glassmorphism styling parameters. Automatically accommodates light and dark modes natively.
- **Server-Side Rendered**: Lightning-fast speeds and secure database interactions using Next.js Server Components.

## 🛠️ Technology Stack

- **Framework:** Next.js (App Router Architecture)
- **Frontend library:** React
- **Styling:** Tailwind CSS 
- **Backend & Storage:** Supabase (PostgreSQL & Storage Buckets)

---

## 🚀 Local Development Setup

### 1. Requirements
- Node.js installed locally.
- A free [Supabase](https://supabase.com) account.

### 2. Configure Database & Storage
Create a fresh Supabase project. Head to the **SQL Editor** on your Supabase dashboard and run the code provided in the two configuration files inside this repository to create your tables, buckets, and security protocols:

1. Copy and run the entire contents of `supabase_setup.sql`
2. Copy and run the entire contents of `supabase_rls_fix.sql`

### 3. Environment Variables
Create a file named `.env.local` in the root of the project directory and fill it with your specific Supabase credentials:

```properties
NEXT_PUBLIC_SUPABASE_URL=your_project_url (e.g., https://your-id.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Install Dependencies & Launch
In your terminal, navigate to the NoteHive directory and install the necessary NPM packages:

```bash
npm install
```

Launch the local Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result! Your Student Portal is ready to go.

---

## 📦 Deployment

The application is thoroughly type-checked and linted. It is tailored perfectly to be instantly deployed onto frontend hosting providers such as **Vercel** or **Netlify**. Simply push your repository to GitHub, link the repository to your host, and inject your Supabase ENV variables into the production dashboard.
