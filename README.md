# FinAppV3 - Financial Planning & Modeling App

A table-first financial modeling application built with Next.js and Supabase.

## Features

- **Table-Centric Design**: Financial data organized in a spreadsheet-like table
- **Relative Time Periods**: Uses Month 1, Year 1 format (no absolute dates)
- **Flexible Formula System**: Calculate projections using formulas with row references
- **Multiple View Modes**: Toggle between monthly and yearly views
- **Public Sharing**: Share financial models via unique links
- **No Authentication**: Simple, straightforward access (authentication can be added later)

## Tech Stack

- **Next.js 14** (App Router, TypeScript)
- **Supabase** (PostgreSQL database)
- **Tailwind CSS** (Minimal white UI)
- **Custom Calculation Engine** (Formula evaluation)

## Project Structure

```
finappv3/
├── app/                  # Next.js app directory
│   └── page.tsx         # Home page
├── components/          # React components
│   └── FinancialTable.tsx
├── lib/                 # Utilities and helpers
│   ├── supabase.ts     # Supabase client
│   ├── types.ts        # TypeScript types
│   └── calculator.ts   # Calculation engine
├── supabase/
│   └── migrations/     # Database schema
│       └── 001_initial_schema.sql
└── QUESTIONNAIRE_NOTES.md
```

## Database Schema

### Tables
- **models**: Financial model metadata (view mode, periods, sharing)
- **table_rows**: Row definitions (income, expenses, debt, etc.)
- **table_cells**: Cell values (inputs and calculated values)
- **formulas**: Reusable formula templates

### Formula Syntax
- `ROW(category)`: Reference same period value
- `PREV(category)`: Reference previous period value
- `SUM(row_type)`: Sum all rows of a type

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Supabase
1. Create a Supabase project at https://supabase.com
2. Edit `.env.local` and add your credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### 3. Run Migrations
- Go to Supabase SQL Editor
- Run the migration from `supabase/migrations/001_initial_schema.sql`

### 4. Start Development Server
```bash
npm run dev
```

Visit http://localhost:3000

## Next Steps

### Questionnaire Flow (Not Yet Built)
Initial questions will be:
1. **Annual Salary**
2. **Age**
3. **Target Retirement Age**

This will calculate working years and create initial table structure.

## Planned Features
- ✅ Database schema
- ✅ Table component
- ✅ Calculation engine
- ✅ Basic layout
- ⏳ Questionnaire flow
- ⏳ Model creation
- ⏳ Cell editing
- ⏳ Public sharing
- ⏳ Export to CSV
- ⏳ Add/remove rows dynamically

## License

MIT
