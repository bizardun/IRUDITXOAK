import re

with open('types.ts', 'r') as f:
    content = f.read()

old = """export interface RestaurantConfig {
    id: string;
    name: string;
    slogan: string;
    initialPlatos: Plato[];
    theme?: ThemeConfig;
    adminPassword?: string;
}"""

new = """export interface RestaurantConfig {
    id: string;
    name: string;
    slogan: string;
    initialPlatos: Plato[];
    theme?: ThemeConfig;
    adminPassword?: string;
    officialWebsite?: string;
}"""

if old in content:
    content = content.replace(old, new)
    with open('types.ts', 'w') as f:
        f.write(content)
    print("Updated types.ts")
else:
    print("Could not find block in types.ts")
