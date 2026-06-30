import re
import json

with open('/Users/macair1/projects/SectorCalc-p5a/tools_form_sayfasi_.txt', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract styles
style_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
styles = style_match.group(1) if style_match else ''

# Extract body HTML (everything between </style> and <script>)
body_match = re.search(r'</style>\s*(.*?)<script>', content, re.DOTALL)
body_html = body_match.group(1).strip() if body_match else ''

# Extract script
script_match = re.search(r'<script>(.*?)</script>', content, re.DOTALL)
script_js = script_match.group(1) if script_match else ''

tsx_content = f"""'use client';
import {{ useEffect }} from 'react';

const STATIC_HTML = {json.dumps(f"<style>{styles}</style>{body_html}")};

const STATIC_SCRIPT = {json.dumps(script_js)};

export function PremiumStaticForm() {{
  useEffect(() => {{
    const script = document.createElement('script');
    script.innerHTML = STATIC_SCRIPT;
    script.id = 'premium-static-script';
    // Append to body to ensure it executes globally
    document.body.appendChild(script);
    return () => {{
      const existing = document.getElementById('premium-static-script');
      if (existing) existing.remove();
    }};
  }}, []);

  return <div dangerouslySetInnerHTML={{{{ __html: STATIC_HTML }}}} />;
}}
"""

with open('/Users/macair1/projects/SectorCalc-p5a/src/components/tools/PremiumStaticForm.tsx', 'w', encoding='utf-8') as f:
    f.write(tsx_content)

print("Generated src/components/tools/PremiumStaticForm.tsx")
