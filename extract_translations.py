import json
import os

# Load all translation files
languages = ['en', 'de', 'es', 'fr', 'nl']
translations = {}

base_path = 'c:/Users/Avijit/Desktop/growbrandaiapp/public/locales'

for lang in languages:
    file_path = f'{base_path}/{lang}/translation.json'
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            translations[lang] = json.load(f)
    except Exception as e:
        print(f"Error loading {lang}: {e}")

# Function to create localized object
def create_localized(key_path):
    """Extract a value from all language files and create localized object"""
    result = {}
    keys = key_path.split('.')
    
    for lang in languages:
        value = translations.get(lang, {})
        for key in keys:
            if isinstance(value, dict):
                value = value.get(key, '')
            else:
                value = ''
                break
        result[lang] = value
    
    return result

# Function to recursively process a section
def process_section(section_name, depth=0):
    """Recursively process a section and generate TypeScript object"""
    en_section = translations['en'].get(section_name, {})
    
    if not isinstance(en_section, dict):
        return None
    
    result = []
    indent = '    ' * (depth + 1)
    
    for key, value in en_section.items():
        if isinstance(value, dict):
            # Nested object - recurse
            nested = process_section_nested(f"{section_name}.{key}", depth + 1)
            if nested:
                result.append(f"{indent}{key}: {{\n{nested}\n{indent}}},")
        elif isinstance(value, str):
            # Simple string - create localized object
            localized = create_localized(f"{section_name}.{key}")
            loc_str = ', '.join([f'{lang}: "{localized[lang]}"' for lang in languages])
            result.append(f"{indent}{key}: {{ {loc_str} }},")
    
    return '\n'.join(result)

def process_section_nested(key_path, depth):
    """Process nested sections"""
    keys = key_path.split('.')
    en_data = translations['en']
    
    for key in keys:
        en_data = en_data.get(key, {})
    
    if not isinstance(en_data, dict):
        return None
    
    result = []
    indent = '    ' * (depth + 1)
    
    for key, value in en_data.items():
        if isinstance(value, dict):
            nested = process_section_nested(f"{key_path}.{key}", depth + 1)
            if nested:
                result.append(f"{indent}{key}: {{\n{nested}\n{indent}}},")
        elif isinstance(value, str):
            localized = create_localized(f"{key_path}.{key}")
            # Escape quotes and special characters
            loc_str = ', '.join([f'{lang}: "{localized[lang].replace(chr(34), chr(92)+chr(34))}"' for lang in languages])
            result.append(f"{indent}{key}: {{ {loc_str} }},")
    
    return '\n'.join(result)

# Generate seed data for key sections
sections_to_extract = [
    'common',
    'app', 
    'portfolio',
    'stats',
    'projects_preview',
    'contact_page',
    'slogan_generator',
]

print("// Generated SEED DATA - Add to SeedData.tsx\n")
print("const ADDITIONAL_SITE_CONTENT = {")

for section in sections_to_extract:
    print(f"    {section}: {{")
    content = process_section(section, depth=1)
    if content:
        print(content)
    print("    },")

print("};")

print("\n\n// To merge with existing SEED_SITE_CONTENT:")
print("// const SEED_SITE_CONTENT = { ...SEED_SITE_CONTENT, ...ADDITIONAL_SITE_CONTENT };")
