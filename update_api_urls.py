#!/usr/bin/env python3
"""
Script to update all hardcoded API URLs to use API_CONFIG
Run this from the project root: python3 update_api_urls.py
"""

import os
import re
from pathlib import Path

# Mapping of hardcoded URLs to API_CONFIG calls
REPLACEMENTS = {
    r"url:\s*['\"]http://10\.0\.2\.2:3000/api/v1/users/login['\"]": "url: API_CONFIG.LOGIN",
    r"url:\s*['\"]http://10\.0\.2\.2:3000/api/v1/users/signup['\"]": "url: API_CONFIG.SIGNUP",
    r"url:\s*`http://10\.0\.2\.2:3000/api/v1/users/\$\{([^}]+)\}`": r"url: API_CONFIG.GET_USER(\1)",
    
    r"url:\s*`http://10\.0\.2\.2:3000/api/v1/makers/\$\{([^}]+)\}`": r"url: API_CONFIG.GET_MAKER(\1)",
    r"url:\s*['\"]http://10\.0\.2\.2:3000/api/v1/makers['\"]": "url: API_CONFIG.GET_MAKERS",
    r"url:\s*`http://10\.0\.2\.2:3000/api/v1/makers/\$\{([^}]+)\}/shop-status`": r"url: API_CONFIG.UPDATE_MAKER_STATUS(\1)",
    r"url:\s*`http://10\.0\.2\.2:3000/api/v1/makers/\$\{([^}]+)\}/categories`": r"url: API_CONFIG.GET_CATEGORIES(\1)",
    
    r"url:\s*`http://10\.0\.2\.2:3000/api/v1/menus/\$\{([^}]+)\}`": r"url: API_CONFIG.GET_MENU(\1)",
    
    r"url:\s*`http://10\.0\.2\.2:3000/api/v1/dishes/\$\{([^}]+)\}`": r"url: API_CONFIG.GET_DISH(\1)",
    r"url:\s*['\"]http://10\.0\.2\.2:3000/api/v1/dishes['\"]": "url: API_CONFIG.CREATE_DISH",
    
    r"url:\s*`http://10\.0\.2\.2:3000/api/v1/orders/\$\{([^}]+)\}`": r"url: API_CONFIG.GET_ORDER(\1)",
    r"url:\s*['\"]http://10\.0\.2\.2:3000/api/v1/orders['\"]": "url: API_CONFIG.GET_ORDERS",
    r"url:\s*['\"]http://10\.0\.2\.2:3000/api/v1/orders/?['\"]": "url: API_CONFIG.GET_ORDERS",
    
    r"url:\s*['\"]http://10\.0\.2\.2:3000/api/v1/cloudinary/signature['\"]": "url: API_CONFIG.GET_CLOUDINARY_SIGNATURE",
    r"url:\s*['\"]http://10\.0\.2\.2:3000/api/v1/images/search['\"]": "url: API_CONFIG.SEARCH_IMAGES",
}

# Files to skip
SKIP_FILES = {'.gitignore', '.env', 'config.env', 'render.yaml', 'package-lock.json'}

# Directories to check
SOURCE_DIRS = ['src/screens', 'src/server']

def should_process_file(filepath):
    """Check if file should be processed"""
    if any(filepath.endswith(skip) for skip in SKIP_FILES):
        return False
    if not filepath.endswith(('.js', '.tsx', '.ts')):
        return False
    return True

def add_api_config_import(content, filepath):
    """Add API_CONFIG import if not present and file has http:// URLs"""
    if 'API_CONFIG' in content or 'http://10.0.2.2' not in content:
        return content
    
    # Count depth for relative import
    depth = filepath.count('/') - 2
    import_path = '../' * depth + 'config/api'
    
    lines = content.split('\n')
    insert_index = 0
    
    # Find last import statement
    for i, line in enumerate(lines):
        if line.startswith('import '):
            insert_index = i + 1
    
    import_statement = f"import API_CONFIG from '{import_path}';"
    lines.insert(insert_index, import_statement)
    return '\n'.join(lines)

def update_file(filepath):
    """Update a single file with API_CONFIG"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Skip if no hardcoded URLs
        if 'http://10.0.2.2' not in content:
            return False
        
        # Add import
        content = add_api_config_import(content, filepath)
        
        # Replace URLs
        for pattern, replacement in REPLACEMENTS.items():
            content = re.sub(pattern, replacement, content)
        
        # Write back only if changed
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    """Main function"""
    updated = 0
    
    for directory in SOURCE_DIRS:
        if not os.path.exists(directory):
            continue
        
        for filepath in Path(directory).rglob('*.js'):
            if should_process_file(str(filepath)):
                if update_file(str(filepath)):
                    print(f"✅ Updated: {filepath}")
                    updated += 1
    
    print(f"\n✨ Updated {updated} files!")
    print("🚀 All API URLs now use API_CONFIG")

if __name__ == '__main__':
    main()
